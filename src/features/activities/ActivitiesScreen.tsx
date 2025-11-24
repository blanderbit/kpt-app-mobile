import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    TextInput,
    Keyboard,
    Animated,
} from 'react-native';
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
import { 
    useMyActivities, 
    useCreateActivity, 
    useDeleteActivity,
    useSuggestedActivities,
    useAddSuggestedActivityToActivities,
    useDeleteSuggestedActivity,
    useChangeActivityPosition,
    useArchivedActivities,
    useRestoreActivity
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

    const [ satisfaction, setSatisfaction ] = useState(0)
    const [ achieveness, setAchieveness ] = useState(0)
    const [ newActivity, setNewActivity ] = useState('');
    const [ inputHeight, setInputHeight ] = useState(28);
    const [ inputKey, setInputKey ] = useState(0);
    const inputRef = useRef<TextInput>(null);
    const activityValueRef = useRef('');
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Query client for cache invalidation
    const queryClient = useQueryClient();

    // API hooks
    const { data: myActivities, isLoading, error } = useMyActivities();
    const { data: suggestedActivitiesData } = useSuggestedActivities();
    const { data: archivedActivities } = useArchivedActivities();

    const createActivityMutation = useCreateActivity();
    const deleteActivityMutation = useDeleteActivity();
    const addSuggestedActivityMutation = useAddSuggestedActivityToActivities();
    const deleteSuggestedActivityMutation = useDeleteSuggestedActivity();
    const changePositionMutation = useChangeActivityPosition();
    const restoreActivityMutation = useRestoreActivity();

    // Событие: открытие страницы активностей
    useFocusEffect(
        React.useCallback(() => {
            amplitudeAnalyticsService.trackEvent('Activities Screen Opened');
        }, [])
    );

    // Debug logs
    console.log('myActivities:', myActivities);
    console.log('myActivities.data:', myActivities?.data);
    console.log('myActivities.data length:', myActivities?.data?.length);
    console.log('isLoading:', isLoading);
    console.log('error:', error);
    
    // Suggested Activities logs
    console.log('🎯 suggestedActivitiesData:', suggestedActivitiesData);
    console.log('🎯 suggestedActivitiesData length:', suggestedActivitiesData?.length);

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
            showToast({ message: "The name of activity should not be less than 10 symbols.", type: "error" })
            return;
        }
        
        createActivityMutation.mutate({
            activityName: activityValue
        }, {
            onSuccess: (data) => {
                // Событие: создать активность
                amplitudeAnalyticsService.trackEvent('Activities Create Activity', {
                    activity_name: activityValue,
                });
                console.log('✅ Activity created successfully:', data);
                showToast({ message: "Activity successfully added", type: "success" });
                activityValueRef.current = '';
                setNewActivity("");
                setInputKey(prev => prev + 1);
                Keyboard.dismiss();
                
                // Invalidate and refetch activities data
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                // Force refetch
                queryClient.refetchQueries({ queryKey: ['activities', 'my'] });
            },
            onError: (error) => {
                showToast({ message: "Failed to add activity", type: "error" });
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
                showToast({ message: "Activity archived", type: "success" });
                
                // Invalidate and refetch activities data
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
            },
            onError: (error) => {
                showToast({ message: "Failed to archive activity", type: "error" });
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
                showToast({ message: "Activity added to your list", type: "success" });
                
                // Invalidate and refetch activities data
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                queryClient.invalidateQueries({ queryKey: ['suggestedActivities'] });
            },
            onError: (error) => {
                showToast({ message: "Failed to add activity", type: "error" });
            }
        });
    };

    const handleDeleteSuggestedActivity = (suggestedActivityId: number) => {
        deleteSuggestedActivityMutation.mutate(suggestedActivityId, {
            onSuccess: () => {
                showToast({ message: "Suggested activity removed", type: "success" });
            },
            onError: (error) => {
                showToast({ message: "Failed to remove suggested activity", type: "error" });
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
                    // Инвалидируем кэш для обновления списка
                    queryClient.invalidateQueries({ queryKey: ['activities'] });
                    queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                },
                onError: (error) => {
                    console.error('❌ [handleDragEnd] Ошибка обновления позиции:', error);
                    showToast({ message: "Failed to update activity position", type: "error" });
                    // Откатываем изменения в UI
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
            <View style={ [ styles.container, theme.flexBlocks.vertical8 ] }>
            <View style={ theme.containers.cardRound }>
                <View
                    style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                    <LayersIcon/>

                    <Text style={ theme.fonts.subtitle }>
                        { t('main.activities.myActivities') }
                    </Text>
                </View>

                <View style={ styles.activitySections }>
                    {myActivities?.data && myActivities.data.length > 0 ? (
                        <DraggableList 
                            itemsArr={ myActivities.data }
                            itemHeight={ 90 }
                            onDragEnd={ handleDragEnd }
                            renderItem={ (activity, index, drag) => (
                                <View style={ {
                                    ...styles.activitySection,
                                    ...(index !== myActivities.data.length - 1
                                        ? { borderBottomWidth: 1, borderBottomColor: '#E2DDD8' }
                                        : {}),
                                } }>
                                    <Swipeable
                                        renderRightActions={ (progress, dragX) => renderRightActions(progress, dragX, activity.id) }
                                        overshootRight={ false }>
                                        <View style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter ] }>
                                            <Pressable onPressIn={drag}>
                                                <BurgerIcon/>
                                            </Pressable>

                                            <View style={theme.flexBlocks.vertical8}>
                                                <ActivityLabel id={activity.activityType} />

                                                <Pressable style={ styles.activityContent }>
                                                    <Text
                                                        style={ [ styles.activityTitle, theme.fonts.activityTitle ] }>
                                                        { activity.activityName } 
                                                    </Text>
                                                    <SemiCircleSplit valueA={ satisfaction }
                                                                     valueB={ achieveness }/>
                                                </Pressable>
                                            </View>
                                        </View>
                                    </Swipeable>
                                </View>
                            )}
                        />
                    ) : null}

                    <View
                        style={ [ styles.activitySection, theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter, { height: 'auto' } ] }>
                        <TextInput 
                            key={inputKey}
                            ref={inputRef}
                            style={ [ styles.textInput ] }
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
                                          ...(newActivity ? {} : { opacity: 0 }),
                                      } }
                                      contentStyle={ { gap: 4 } }
                                      disabled={ newActivity.trim().length < 10 }>
                            <PlusIcon color="#fff" size={ 20 }/>
                        </CustomButton>
                    </View>
                </View>
            </View>

            <View style={ theme.containers.cardRound }>
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
                                        style={ [ styles.activityTitle, theme.fonts.activityTitle ] }>
                                        { activity.activityName }
                                    </Text>

                                    <CustomButton title={ t('add') }
                                                  onPress={ () => handleAddSuggestedActivity(activity.id) }
                                                  buttonStyle={ styles.addBtn }
                                                  contentStyle={ { gap: 4 } }>
                                        <PlusIcon color="#fff" size={ 20 }/>
                                    </CustomButton>
                                </View>
                            </View>
                        ))
                    }
                </View>
            </View>

            <View style={ theme.containers.cardRound }>
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
                                                        showToast({ message: "Activity restored", type: "success" });
                                                        
                                                        // Invalidate and refetch activities data
                                                        queryClient.invalidateQueries({ queryKey: ['activities'] });
                                                        queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                                                        queryClient.invalidateQueries({ queryKey: ['activities', 'archived'] });
                                                    },
                                                    onError: (error) => {
                                                        showToast({ message: "Failed to restore activity", type: "error" });
                                                    }
                                                });
                                            } }
                                            buttonStyle={ styles.roundBtn }
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
        </View>
        </TabScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    activitySections: {
        flexDirection: 'column',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
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
        marginRight: -30
    },
    activityTitle: {
        maxWidth: '70%',
    },
    textInput: {
        backgroundColor: '#F5F5F5',
        fontSize: 20,
        lineHeight: 28,
        maxWidth: '70%',
        padding: 0,
        height: '100%',
        minHeight: 28,
        maxHeight: 56
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

