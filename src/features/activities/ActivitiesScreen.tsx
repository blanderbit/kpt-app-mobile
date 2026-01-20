import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    TextInput,
    Keyboard,
    Animated,
    Platform,
    ScrollView,
    LogBox,
} from 'react-native';
import Reanimated, { Easing as ReanimatedEasing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useCustomTheme } from '@app/theme/ThemeContext';
import { useTranslation } from "react-i18next";
import { ActivityLabel } from '@shared/components/ActivityLabel';
import { ActivitiesScreenNavigationProp } from "@app/navigation/AppNavigator";
import { InfoPopup } from "@shared/components/InfoPopup/InfoPopup";
import LayersIcon from "@assets/icons/LayersIcon";
import SemiCircleSplit from "@shared/components/GradientArc/GradientArc";
import CustomButton from "@shared/components/Button/Button";
import { PlusIcon } from "@assets/icons/PlusIcon";
import { useToast } from "@shared/components/Toast/ToastProvider";
import { SuggestedActivitiesIcon } from "@assets/icons/SuggestedActivitiesIcon";
import { ArchiveIcon } from "@assets/icons/ArchiveIcon";
import { ReturnIcon } from "@assets/icons/ReturnIcon";
import { ArchiveBackIcon } from "@assets/icons/ArchiveBackIcon";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { BurgerIcon } from "@assets/icons/BurgerIcon";
import DraggableList from "@features/activities/draggable-activities/DraggableActivities";
import {getResponsiveActivityMaxWidth, isSmallScreen, SCREEN_HEIGHT} from "@shared/utils/screenUtils";
import {
    useMyActivities,
    useCreateActivity,
    useDeleteActivity,
    useSuggestedActivities,
    useAddSuggestedActivityToActivities,
    useDeleteSuggestedActivity,
    useChangeActivityPosition,
    useArchivedActivities,
    useRestoreActivity,
    queryKeys
} from '@shared/services/api/hooks';
import { Activity } from '@shared/services/api/types';
import { useQueryClient } from '@tanstack/react-query';
import { TabScreenContainer } from '@shared/components/TabScreenContainer/TabScreenContainer';
import { amplitudeAnalyticsService } from '@shared/services/analytics';
import { useFocusEffect } from '@react-navigation/native';

export default function ActivitiesScreen({ navigation }: { navigation: ActivitiesScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const { showToast } = useToast();
    const isSmall = isSmallScreen();
    const activityMaxWidth = isSmall ? getResponsiveActivityMaxWidth() : '70%';

    const [ satisfaction, setSatisfaction ] = useState(0)
    const [ achieveness, setAchieveness ] = useState(0)
    const [ newActivity, setNewActivity ] = useState('');
    const [ inputHeight, setInputHeight ] = useState(28);
    const [ inputKey, setInputKey ] = useState(0);
    const inputRef = useRef<TextInput>(null);
    // Держим maxHeight на UI thread (Reanimated), чтобы анимация не дергалась при нагрузке на JS
    const maxHeightSv = useSharedValue(SCREEN_HEIGHT * 0.55);
    const activityValueRef = useRef('');
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    // Refs для управления Swipeable при drag-and-drop
    const swipeableRefs = useRef<Map<number, Swipeable>>(new Map());
    // Локальное состояние для управления порядком элементов (чтобы DraggableFlatList не терял состояние)
    const [localActivities, setLocalActivities] = useState<Activity[] | null>(null);

    // Query client for cache invalidation
    const queryClient = useQueryClient();

    // API hooks
    const { data: myActivities, isLoading, error, refetch: refetchMyActivities } = useMyActivities();
    const { data: suggestedActivitiesData } = useSuggestedActivities();
    const { data: archivedActivities } = useArchivedActivities();

    // Синхронизируем локальное состояние с данными из API
    // Сбрасываем локальное состояние только если данные изменились и мы не в процессе drag
    useEffect(() => {
        if (myActivities?.data) {
            // Если локальное состояние пустое или данные изменились (например, после создания/удаления)
            // обновляем локальное состояние
            const shouldUpdate = !localActivities ||
                localActivities.length !== myActivities.data.length ||
                localActivities.some((local, index) => local.id !== myActivities.data[index]?.id);

            if (shouldUpdate) {
                setLocalActivities(myActivities.data);
            }
        }
    }, [myActivities?.data]);

    const createActivityMutation = useCreateActivity();
    const deleteActivityMutation = useDeleteActivity();
    const addSuggestedActivityMutation = useAddSuggestedActivityToActivities();
    const deleteSuggestedActivityMutation = useDeleteSuggestedActivity();
    const changePositionMutation = useChangeActivityPosition();
    const restoreActivityMutation = useRestoreActivity();

    // Подавляем предупреждение о вложенных VirtualizedLists
    useEffect(() => {
        LogBox.ignoreLogs([
            'VirtualizedLists should never be nested inside plain ScrollViews',
        ]);
    }, []);

    // Отслеживание состояния клавиатуры с плавной анимацией
    useEffect(() => {
        const animateHeight = (toValue: number, duration?: number) => {
            // withTiming на UI thread, более гладко чем Animated.timing в JS
            maxHeightSv.value = withTiming(toValue, {
                duration: duration ?? 250,
                easing: ReanimatedEasing.inOut(ReanimatedEasing.cubic),
            });
        };

        const showKeyboard = (e?: any) => {
            const d = Platform.OS === 'ios' ? e?.duration : undefined;
            animateHeight(SCREEN_HEIGHT * 0.3, d);
        };

        const hideKeyboard = (e?: any) => {
            const d = Platform.OS === 'ios' ? e?.duration : undefined;
            animateHeight(SCREEN_HEIGHT * 0.55, d);
        };

        // Используем правильные события для каждой платформы
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

        const keyboardShowListener = Keyboard.addListener(showEvent, showKeyboard);
        const keyboardHideListener = Keyboard.addListener(hideEvent, hideKeyboard);

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, [maxHeightSv]);

    const myActivitiesMaxHeightStyle = useAnimatedStyle(() => {
        return { maxHeight: maxHeightSv.value };
    }, []);

    // Событие: открытие страницы активностей и обновление данных
    useFocusEffect(
        React.useCallback(() => {
            amplitudeAnalyticsService.trackEvent('Activities Screen Opened');
            // Обновляем список активностей с бекенда при каждом заходе на страницу
            refetchMyActivities();
        }, [refetchMyActivities])
    );

    // Debug logs для myActivities с бекенда
    useEffect(() => {
        if (myActivities?.data) {
            console.log('📋 [ActivitiesScreen] Мои активности с бекенда:', {
                totalCount: myActivities.data.length,
                activities: myActivities.data.map(activity => ({
                    id: activity.id,
                    activityName: activity.activityName,
                    activityType: activity.activityType,
                    position: activity.position,
                    status: activity.status,
                })),
                fullData: JSON.stringify(myActivities.data, null, 2)
            });
        }
    }, [myActivities?.data]);

    const updateActivityState = useCallback((value: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            setNewActivity(value);
        }, 100);
    }, []);

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handleAddNewActivity = () => {
        const activityValue = activityValueRef.current.trim();
        if ( activityValue.length < 10 ) {
            showToast({ message: t('toast.activityNameMinLength'), type: "error" })
            return;
        }

        createActivityMutation.mutate({
            activityName: activityValue
        }, {
            onSuccess: async (data) => {
                // Событие: создать активность
                amplitudeAnalyticsService.trackEvent('Activities Create Activity', {
                    activity_name: activityValue,
                });
                console.log('✅ Activity created successfully:', data);
                showToast({ message: t('toast.activitySuccessfullyAdded'), type: "success" });
                activityValueRef.current = '';
                setNewActivity("");
                setInputKey(prev => prev + 1);
                Keyboard.dismiss();

                // Invalidate queries
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                
                // Получаем актуальный список активностей с сервера
                const { data: updatedActivities } = await refetchMyActivities();
                
                // Обновляем локальное состояние новыми данными
                if (updatedActivities?.data) {
                    setLocalActivities(updatedActivities.data);
                } else {
                    // Если данные не пришли, сбрасываем для синхронизации через useEffect
                    setLocalActivities(null);
                }
            },
            onError: (error) => {
                showToast({ message: t('toast.failedToAddActivity'), type: "error" });
            }
        });
    };

    const handleArchiveActivity = (activityId: number) => {
        deleteActivityMutation.mutate(activityId, {
            onSuccess: () => {
                // Событие: архивация активности
                amplitudeAnalyticsService.trackEvent('Activities Archive Activity', {
                    activity_id: activityId,
                });
                showToast({ message: t('toast.activityArchived'), type: "success" });

                // Invalidate and refetch activities data
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                // Сбрасываем локальное состояние, чтобы синхронизироваться с новыми данными
                setLocalActivities(null);
            },
            onError: (error) => {
                showToast({ message: t('toast.failedToArchiveActivity'), type: "error" });
            }
        });
    };

    const handleAddSuggestedActivity = (suggestedActivityId: number) => {
        addSuggestedActivityMutation.mutate({
            id: suggestedActivityId
        }, {
            onSuccess: () => {
                // Событие: перенести с саджестед в активити
                amplitudeAnalyticsService.trackEvent('Activities Add From Suggested', {
                    suggested_activity_id: suggestedActivityId,
                });
                showToast({ message: t('toast.activityAddedToList'), type: "success" });

                // Invalidate and refetch activities data
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                queryClient.invalidateQueries({ queryKey: ['suggestedActivities'] });
                // Сбрасываем локальное состояние, чтобы синхронизироваться с новыми данными
                setLocalActivities(null);
            },
            onError: (error) => {
                showToast({ message: t('toast.failedToAddActivity'), type: "error" });
            }
        });
    };

    const handleDeleteSuggestedActivity = (suggestedActivityId: number) => {
        deleteSuggestedActivityMutation.mutate(suggestedActivityId, {
            onSuccess: () => {
                showToast({ message: t('toast.suggestedActivityRemoved'), type: "success" });
            },
            onError: (error) => {
                showToast({ message: t('toast.failedToRemoveSuggestedActivity'), type: "error" });
            }
        });
    };

    const handleDragEnd = (data: Activity[], from: number, to: number) => {
        if (from === to) return;

        const movedActivity = data[to];
        // Передаем индекс напрямую (0-based), как ожидает бэкенд
        const newPosition = to;

        console.log('🔄 [handleDragEnd] Перемещение активности:', {
            activityId: movedActivity.id,
            activityName: movedActivity.activityName,
            from,
            to,
            oldPosition: movedActivity.position,
            newPosition,
        });

        // Обновляем локальное состояние сразу (для мгновенного отклика UI)
        const updatedData = data.map((activity, index) => ({
            ...activity,
            position: index,
        }));
        setLocalActivities(updatedData);

        // Сохраняем текущие данные для возможного отката
        const previousData = myActivities;
        const previousLocalData = localActivities;

        // Оптимистично обновляем кэш с новым порядком элементов
        queryClient.setQueryData(queryKeys.myActivities(), (oldData: typeof myActivities) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                data: updatedData,
            };
        });

        changePositionMutation.mutate(
            {
                id: movedActivity.id,
                data: { position: newPosition },
            },
            {
                onSuccess: () => {
                    // Событие: смена позиции активности
                    amplitudeAnalyticsService.trackEvent('Activities Change Position', {
                        activity_id: movedActivity.id,
                        from_position: from,
                        to_position: to,
                    });
                    console.log('✅ [handleDragEnd] Позиция успешно обновлена');
                    // Инвалидируем кэш для синхронизации с сервером
                    queryClient.invalidateQueries({ queryKey: ['activities'] });
                    queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                    // Не сбрасываем локальное состояние, так как оно уже обновлено оптимистично
                    // После refetch данные синхронизируются автоматически через useEffect
                },
                onError: (error) => {
                    console.error('❌ [handleDragEnd] Ошибка обновления позиции:', error);
                    showToast({ message: t('toast.failedToUpdateActivityPosition'), type: "error" });
                    // Откатываем оптимистичное обновление
                    if (previousData) {
                        queryClient.setQueryData(queryKeys.myActivities(), previousData);
                    }
                    // Откатываем локальное состояние
                    if (previousLocalData) {
                        setLocalActivities(previousLocalData);
                    }
                    // Инвалидируем кэш для получения актуальных данных с сервера
                    queryClient.invalidateQueries({ queryKey: ['activities'] });
                    queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                },
            }
        );
    };

    const renderRightActions = (progress, dragX, activityId: number) => {
        // Используем progress (0-1) для масштабирования
        // progress = 0 (закрыто) -> scale = 0.2
        // progress = 1 (полностью открыто) -> scale = 1
        const scale = progress.interpolate({
            inputRange: [ 0, 1 ],
            outputRange: [ 0.2, 1 ],
            extrapolate: 'clamp',
        });

        // Прозрачность также увеличивается при свайпе
        const opacity = progress.interpolate({
            inputRange: [ 0, 0.5, 1 ],
            outputRange: [ 0.3, 0.6, 1 ],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View
                style={ {
                    transform: [ { scale } ],
                    opacity,
                    justifyContent: "center",
                    marginLeft: 10,
                } }
            >
                <RectButton onPress={ () => handleArchiveActivity(activityId) }>
                    <Pressable style={ styles.archiveBtn }>
                        <ArchiveIcon/>
                    </Pressable>
                </RectButton>
            </Animated.View>
        );
    };

    return (
        <TabScreenContainer>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                {/* Секция "Мои активности" с DraggableFlatList */}
                <View style={ theme.containers.cardRound }>
                    <View
                        style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                        <LayersIcon/>

                        <Text style={ theme.fonts.subtitle }>
                            { t('main.activities.myActivities') }
                        </Text>
                    </View>

                    <View style={ [styles.activitySections, { maxHeight: SCREEN_HEIGHT * 0.65 }] }>
                        <Reanimated.View style={ myActivitiesMaxHeightStyle }>
                            {(localActivities || myActivities?.data) && (localActivities || myActivities.data)!.length > 0 ? (
                                <DraggableList
                                    itemsArr={ localActivities || myActivities.data! }
                                    itemHeight={ 90 }
                                    onDragEnd={ handleDragEnd }
                                    renderItem={ (activity, index, drag) => {
                                        let longPressTimer: NodeJS.Timeout | null = null;

                                        const handlePressIn = () => {
                                            // Закрываем Swipeable перед началом drag
                                            const swipeable = swipeableRefs.current.get(activity.id);
                                            if (swipeable) {
                                                swipeable.close();
                                            }
                                            // Запускаем таймер для долгого нажатия
                                            longPressTimer = setTimeout(() => {
                                                drag();
                                            }, 100);
                                        };

                                        const handlePressOut = () => {
                                            // Отменяем таймер, если палец отпущен до истечения времени
                                            if (longPressTimer) {
                                                clearTimeout(longPressTimer);
                                                longPressTimer = null;
                                            }
                                        };

                                        return (
                                            <View style={ {
                                                ...styles.activitySection,
                                                ...(index !== (localActivities || myActivities.data)!.length - 1
                                                    ? { borderBottomWidth: 1, borderBottomColor: '#E2DDD8' }
                                                    : {}),
                                            } }>
                                                <Swipeable
                                                    ref={(ref) => {
                                                        if (ref) {
                                                            swipeableRefs.current.set(activity.id, ref);
                                                        } else {
                                                            swipeableRefs.current.delete(activity.id);
                                                        }
                                                    }}
                                                    renderRightActions={ (progress, dragX) => renderRightActions(progress, dragX, activity.id) }
                                                    overshootRight={ false }
                                                    enabled={true}>
                                                    <View style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter ] }>
                                                        <Pressable
                                                            onPressIn={handlePressIn}
                                                            onPressOut={handlePressOut}
                                                            style={{ padding: 8, marginLeft: -8 }}>
                                                            <BurgerIcon/>
                                                        </Pressable>

                                                        <View style={theme.flexBlocks.vertical8}>
                                                            <ActivityLabel id={activity.activityType} />

                                                            <Pressable style={ styles.activityContent }>
                                                                <Text
                                                                    style={ [ styles.activityTitle, theme.fonts.activityTitle, { maxWidth: activityMaxWidth } ] }>
                                                                    { activity.activityName }
                                                                </Text>
                                                                <SemiCircleSplit valueA={ satisfaction }
                                                                                 valueB={ achieveness }/>
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                </Swipeable>
                                            </View>
                                        );
                                    }}
                                />
                            ) : null}
                        </Reanimated.View>

                    <View
                        style={ [ styles.activitySection, theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter, { height: 'auto' } ] }>
                        <TextInput
                            key={inputKey}
                            ref={inputRef}
                            style={ [ styles.textInput, styles.textInputWithButton ] }
                            placeholder={ t('main.activities.addNewActivity') }
                            multiline
                            defaultValue=""
                            onChangeText={ (val) => {
                                activityValueRef.current = val;
                                if ( val.endsWith('\n') ) {
                                    handleAddNewActivity();
                                } else {
                                    updateActivityState(val);
                                }
                            } }/>

                        <CustomButton title={ t('add') }
                                      onPress={ handleAddNewActivity }
                                      buttonStyle={ {
                                          ...styles.addBtn,
                                          ...styles.addBtnFixed,
                                          ...(newActivity ? {} : { opacity: 0 }),
                                      } }
                                      contentStyle={ { gap: 4 } }
                                      disabled={ newActivity.trim().length < 10 }>
                            <PlusIcon color="#fff" size={ 20 }/>
                        </CustomButton>
                    </View>
                </View>
            </View>

            {/* Остальные секции */}
            <View style={ [theme.containers.cardRound, { marginTop: 16 }] }>
                    <View
                        style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                        <SuggestedActivitiesIcon/>

                    <Text style={ theme.fonts.subtitle }>
                        { t('main.activities.suggestedActivities') }
                    </Text>
                </View>

                <View style={ styles.activitySections }>
                    {suggestedActivitiesData && suggestedActivitiesData.length > 0 &&
                        suggestedActivitiesData.map((activity, index) => (
                            <View
                                key={ activity.id }
                                style={ {
                                    ...styles.activitySection,
                                    ...(index !== suggestedActivitiesData.length - 1
                                        ? { borderBottomWidth: 1, borderBottomColor: '#E2DDD8' }
                                        : {}),
                                } }
                            >
                                <ActivityLabel id={activity.activityType} />

                                <View style={ [ styles.activityContent, theme.flexBlocks.alignCenter ] }>
                                    <Text
                                        style={ [ styles.activityTitle, styles.activityTitleWithButton, theme.fonts.activityTitle ] }>
                                        { activity.activityName }
                                    </Text>

                                    <CustomButton title={ t('add') }
                                                  onPress={ () => handleAddSuggestedActivity(activity.id) }
                                                  buttonStyle={ [ styles.addBtn, styles.addBtnFixed ] }
                                                  contentStyle={ { gap: 4 } }>
                                        <PlusIcon color="#fff" size={ 20 }/>
                                    </CustomButton>
                                </View>
                            </View>
                        ))
                    }
                </View>
            </View>

            <View style={ [theme.containers.cardRound, { marginTop: 16 }] }>
                <View
                    style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                    <ArchiveIcon/>

                    <Text style={ theme.fonts.subtitle }>
                        { t('main.activities.archivedActivities') }
                    </Text>
                </View>

                <View style={ styles.activitySections }>
                    {archivedActivities?.data && archivedActivities.data.length > 0 &&
                        archivedActivities.data.map((activity, index) => {
                            return (
                                <View
                                    key={ activity.id }
                                    style={ {
                                        ...styles.activitySection,
                                        ...(index !== archivedActivities.data.length - 1
                                            ? { borderBottomWidth: 1, borderBottomColor: '#E2DDD8' }
                                            : {}),
                                    } }
                                >
                                    <ActivityLabel id={activity.activityType} />

                                    <View style={ [ styles.activityContent, theme.flexBlocks.alignCenter ] }>
                                        <Text
                                            style={ [
                                                styles.activityTitle,
                                                styles.activityTitleWithButton,
                                                theme.fonts.activityTitle,
                                                {
                                                    textDecorationLine: 'line-through',
                                                    opacity: 0.3
                                                }
                                            ] }>
                                            { activity.activityName }
                                        </Text>

                                        <CustomButton
                                            onPress={ () => {
                                                restoreActivityMutation.mutate(activity.id, {
                                                    onSuccess: () => {
                                                        showToast({ message: t('toast.activityRestored'), type: "success" });

                                                        // Invalidate and refetch activities data
                                                        queryClient.invalidateQueries({ queryKey: ['activities'] });
                                                        queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                                                        queryClient.invalidateQueries({ queryKey: ['activities', 'archived'] });
                                                    },
                                                    onError: (error) => {
                                                        showToast({ message: t('toast.failedToRestoreActivity'), type: "error" });
                                                    }
                                                });
                                            } }
                                            buttonStyle={ [ styles.roundBtn, styles.addBtnFixed ] }
                                            contentStyle={ { gap: 0 } }>
                                            <ArchiveBackIcon color="#fff" size={ 20 }/>
                                        </CustomButton>
                                    </View>
                                </View>
                            );
                        })
                    }
                </View>
            </View>
            </ScrollView>
        </TabScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    activitySections: {
        flexDirection: 'column',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        overflow: 'hidden',
    },
    activitySection: {
        width: '100%',
        minHeight: 90,
        flexDirection: 'column',
        padding: 16,
        gap: 8,
    },
    activityLabel: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 24,
        flexDirection: 'row',
        gap: 4,
        alignSelf: 'flex-start',
    },
    activityContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        width: '100%',
        marginRight: -40
    },
    activityTitle: {
        maxWidth: '60%', // Оригинальное значение для средних/больших экранов
    },
    activityTitleWithButton: {
        flex: 1,
        flexShrink: 1,
        maxWidth: undefined, // Убираем maxWidth когда есть кнопка
    },
    addBtnFixed: {
        flexShrink: 0, // Кнопка не должна сжиматься
    },
    textInput: {
        backgroundColor: '#F5F5F5',
        fontSize: 20,
        lineHeight: 28,
        maxWidth: '70%', // Оригинальное значение для средних/больших экранов
        padding: 0,
        height: '100%',
        minHeight: 28,
        maxHeight: 56
    },
    textInputWithButton: {
        flex: 1,
        flexShrink: 1,
        maxWidth: undefined, // Убираем maxWidth когда есть кнопка
    },
    addBtn: {
        width: 'auto',
        height: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    returnBtn: {
        width: 'auto',
        height: 'auto',
        paddingVertical: 11,
        paddingHorizontal: 11,
    },
    archiveBtn: {
        backgroundColor: '#8100851A',
        borderRadius: 12,
        padding: 6,
    },
    roundBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        padding: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

