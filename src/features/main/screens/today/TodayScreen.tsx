import React, { useEffect, useState, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, LayoutChangeEvent, Pressable } from 'react-native';
import { useCustomTheme } from "@app/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import FireIcon from "@assets/icons/FireIcon";
import InfoIcon from "@assets/icons/InfoIcon";
import { SegmentedProgressBar } from "@shared/components/SegmentedProgressBar/SegmentedProgressBar";
import { DailyActivityIcon } from "@assets/icons/DailyActivityIcon";
import {
    AdditionalActivityType,
    additionalTaskSections,
    DailyActivityType
} from "@features/main/screens/today/const";
import { AddButton } from "@shared/components/AddButton/AddButton";
import BottomSheet from "@shared/components/BottomSheet/BottomSheet";
import CustomButton from "@shared/components/Button/Button";
import { HelloIcon } from "@assets/icons/HelloIcon";
import SatisfactionSlider from "@shared/components/Slider/Slider";
import WhiteCheckmarkIcon from "@assets/icons/WhiteCheckmarkIcon";
import { WhiteCheckmarkIconDisabled } from "@assets/icons/WhiteCheckmarkIconDisabled";
import { TodayScreenNavigationProp } from "@app/navigation/AppNavigator";
import SemiCircleSplit from "@shared/components/GradientArc/GradientArc";
import MoodTracker from "@features/main/screens/mood-tracker/MoodTracker";
import { Routes } from '@app/navigation/const';
import {useProfile} from "@app/hooks/profile.hook";
import { useCurrentMoodContext } from '@app/hooks/current-mood.hook';
import { ActivityLabel } from '@shared/components/ActivityLabel';
import {TooltipPage} from "@shared/components/InfoPopup/InfoPopup";
import {getResponsiveActivityMaxWidth} from "@shared/utils/screenUtils";
import {PageTooltips} from "@shared/components/PageTooltips";
import { useAuth } from '@app/hooks/auth.hook';
import { EmailVerificationModal } from '@shared/components/EmailVerificationModal';
import { InfoPopup } from '@shared/components/InfoPopup/InfoPopup';
import { TabScreenContainer } from '@shared/components/TabScreenContainer/TabScreenContainer';
import { useRandomArticle, useRandomSurvey, useMyActivities, useCloseActivity, useActivityStatistics } from '@shared/services/api/hooks';
import { amplitudeAnalyticsService } from '@shared/services/analytics';
import { JoyfulIcon } from '@assets/icons/smiles/JoyfulIcon';

const circleSize = 16;

export default function TodayScreen({ navigation }: { navigation: TodayScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const { profile } = useProfile();
    const { hasMoodForToday, currentMood } = useCurrentMoodContext();
    const { isEmailVerified, isAuthenticated } = useAuth();

    // Загружаем случайную статью и опрос при монтировании экрана
    const { data: randomArticle, refetch: refetchArticle } = useRandomArticle();
    const { data: randomSurvey, refetch: refetchSurvey } = useRandomSurvey();

    // Загружаем активности пользователя с бекенда
    const { data: myActivitiesData, isLoading: isLoadingActivities } = useMyActivities();
    const myActivities = myActivitiesData?.data || [];
    const closeActivityMutation = useCloseActivity();

    // Загружаем статистику активностей для виджета "Your weekly total"
    const { data: activityStatistics } = useActivityStatistics();

    const hasNoWeekStatistics =
        !activityStatistics ||
        activityStatistics.totalRatedActivities === 0 ||
        (Number(activityStatistics.averageSatisfactionLevel) === 0 &&
            Number(activityStatistics.averageHardnessLevel) === 0);

    // Сохраняем ID выбранной активности
    const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);

    // При каждом попадании на TodayScreen делаем refetch для получения новых случайных значений
    useFocusEffect(
        React.useCallback(() => {
            amplitudeAnalyticsService.trackEvent('Today Screen Opened');
            refetchArticle();
            refetchSurvey();
        }, [refetchArticle, refetchSurvey])
    );

    const [ circlesCount, setCirclesCount ] = useState(0);
    const [ weeklyTotalModalOpen, setWeeklyTotalModalOpen ] = useState(false);
    const [ activityModalOpen, setActivityModalOpen ] = useState(false);
    const [ moodTrackerModalOpen, setMoodTrackerModalOpen ] = useState(false);
    const [ emailVerificationModalOpen, setEmailVerificationModalOpen ] = useState(false);
    const [ emailVerificationTooltipVisible, setEmailVerificationTooltipVisible ] = useState(false);

    const [ satisfactionLevel, setSatisfactionLevel ] = useState(0);
    const [ hardnessLevel, setHardnessLevel ] = useState(0);
    const [ activeSliderDrags, setActiveSliderDrags ] = useState(0);

    const handleLayout = (e: LayoutChangeEvent) => {
        const width = e.nativeEvent.layout.width;
        setCirclesCount(Math.floor((width - 3) / circleSize));
    };

    const onSectionClick = (section) => {
        if ( section.mode === DailyActivityType.MEASURE_ACTIVITY && !section.done ) {
            setSelectedActivityId(section.id);
            setActivityModalOpen(true);
        }
    };

    const onAdditionalSectionClick = (section) => {
        if ( section.mode === AdditionalActivityType.MOOD_TRACKER ) {
            if (!hasMoodForToday) {
                setMoodTrackerModalOpen(true);
            }
            // Если настроение уже записано, ничего не делаем (секция заблокирована)
        }
        if ( section.mode === AdditionalActivityType.ARTICLE ) {
            if (randomArticle?.id) {
                navigation.navigate(Routes.ARTICLE, { id: randomArticle.id.toString() });
            }
        }
        if ( section.mode === AdditionalActivityType.SURVEY ) {
            if (randomSurvey?.id) {
                navigation.navigate(Routes.SURVEY, { id: randomSurvey.id.toString() });
            }
        }
    }

    // Преобразуем активности с бекенда в формат для отображения
    const activitySections = useMemo(() => {
        if (!myActivities || myActivities.length === 0) {
            return [];
        }

        return myActivities
            .sort((a, b) => a.position - b.position) // Сортируем по position
            .map((activity) => {
                // Получаем satisfactionLevel и hardnessLevel из первого элемента rateActivities
                const firstRateActivity = activity.rateActivities && activity.rateActivities.length > 0
                    ? activity.rateActivities[0]
                    : null;

                return {
                    id: activity.id,
                    activityName: activity.activityName,
                    activityType: activity.activityType,
                    done: activity.status === 'closed', // Определяем done по статусу
                    mode: DailyActivityType.MEASURE_ACTIVITY,
                    satisfactionLevel: firstRateActivity?.satisfactionLevel || 0,
                    hardnessLevel: firstRateActivity?.hardnessLevel || 0,
                };
            });
    }, [myActivities]);

    // Показываем tooltip для неподтвержденного email
    useEffect(() => {
        if (isAuthenticated && !isEmailVerified && profile && profile.email) {
            setEmailVerificationTooltipVisible(true);
        }
    }, [isEmailVerified, isAuthenticated, profile]);

    return (
        <TabScreenContainer>
            <View style={ styles.container }>
            {isAuthenticated && isEmailVerified && (
                <PageTooltips
                    page={TooltipPage.DASHBOARD}
                    autoShow={true}
                    delay={2000}
                />
            )}

            {/* Email verification tooltip */}
            {(() => {
                const shouldShow = isAuthenticated && !isEmailVerified;
                return shouldShow;
            })() && (
                <View style={{ width: '100%' }}>
                    <InfoPopup
                        title={t('main.today.emailVerification.tooltip.title')}
                        desc={t('main.today.emailVerification.tooltip.message')}
                        visible={true}
                        onPress={() => {
                            setEmailVerificationTooltipVisible(false);
                            setEmailVerificationModalOpen(true);
                        }}
                    />
                </View>
            )}

            <View style={ theme.flexBlocks.vertical8 }>
                <Text style={ theme.fonts.subtitle }>
                    { t('main.today.subtitle', { userName: profile?.firstName }) }
                </Text>

                <Text style={ theme.fonts.title }>
                    Plesury
                </Text>
            </View>

            <View style={ styles.main }>
                <View style={ [ theme.containers.card, styles.cardTotal ] } onLayout={ handleLayout }>
                    <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                        <View style={ styles.weekTotal }>
                            <FireIcon/>

                            <Text style={ theme.fonts.subtitle }>
                                { t('main.today.weekTotal.header') }
                            </Text>
                        </View>

                        <Pressable onPress={ () => setWeeklyTotalModalOpen(true) }>
                            <InfoIcon/>
                        </Pressable>
                    </View>

                    <View style={ styles.weekInfo }>
                        {hasNoWeekStatistics ? (
                            <>
                                <Text style={ theme.fonts.subheader }>
                                    { t('main.today.weekTotal.noInfo') }
                                </Text>
                                <Text style={ [ theme.fonts.regular, { opacity: .6 } ] }>
                                    { t('main.today.weekTotal.description') }
                                </Text>
                            </>
                        ) : activityStatistics?.relationship ? (
                            <Text style={ theme.fonts.subheader }>
                                { t(`main.today.weekTotal.relationship.${activityStatistics.relationship}`) }
                            </Text>
                        ) : (
                            <>
                                <Text style={ theme.fonts.subheader }>
                                    { t('main.today.weekTotal.noInfo') }
                                </Text>
                                <Text style={ [ theme.fonts.regular, { opacity: .6 } ] }>
                                    { t('main.today.weekTotal.description') }
                                </Text>
                            </>
                        )}
                    </View>

                    <SegmentedProgressBar
                        satisfactionLevel={activityStatistics?.averageSatisfactionLevel || 0}
                        hardnessLevel={activityStatistics?.averageHardnessLevel || 0}
                    />

                    { circlesCount > 0 && (
                        <View style={ styles.circlesRow }>
                            { Array.from({ length: circlesCount }, (_, i) => (
                                <View key={ i } style={ [ styles.circle, { backgroundColor: theme.background } ] }/>
                            )) }
                        </View>
                    ) }
                </View>

                <View style={ theme.containers.cardRound }>
                    <View style={ [ styles.weekTotal, { paddingHorizontal: 8 } ] }>
                        <DailyActivityIcon/>

                        <Text style={ theme.fonts.subtitle }>
                            { t('main.today.activity.title') }
                        </Text>
                    </View>

                    <View style={ styles.activitySections }>
                        { activitySections.length === 0 ? (
                            <View style={ styles.emptyActivityContainer }>
                                <JoyfulIcon />
                                <View style={ styles.emptyActivityTextContainer }>
                                    <Text style={ [ theme.fonts.subheader, styles.emptyActivityText ] }>
                                        { t('main.today.activity.empty.title') }
                                    </Text>
                                    <Text style={ [ theme.fonts.subheader, styles.emptyActivityText ] }>
                                        { t('main.today.activity.empty.description') }
                                    </Text>
                                </View>
                                <CustomButton
                                    title={ t('main.today.activity.empty.button') }
                                    onPress={ () => navigation.navigate(Routes.ACTIVITIES) }
                                    themeName="primary"
                                />
                            </View>
                        ) : (
                            activitySections.map((section, index) => (
                                <View
                                    key={ index }
                                    style={ {
                                        ...styles.activitySection,
                                        ...(index !== activitySections.length - 1
                                            ? { borderBottomWidth: 1, borderBottomColor: '#E2DDD8' }
                                            : {}),
                                    } }
                                >
                                    <ActivityLabel
                                        id={section.activityType}
                                    />

                                    <Pressable
                                        style={ styles.activityContent }
                                        onPress={ () => onSectionClick(section) }
                                        disabled={ section.done }
                                    >
                                        <Text
                                            style={ [
                                                styles.activityTitle,
                                                theme.fonts.subheader,
                                                section.done ? {
                                                    ...styles.activitySectionDone,
                                                    textDecorationLine: 'line-through',
                                                    opacity: 0.3
                                                } : {}
                                            ] }>
                                            { section.activityName }
                                        </Text>

                                        {
                                            section.done ?
                                                <SemiCircleSplit valueA={ section.satisfactionLevel } valueB={ section.hardnessLevel }/> :
                                                <AddButton done/>
                                        }
                                    </Pressable>
                                </View>
                            ))
                        ) }
                    </View>
                </View>

                <View>
                    <View style={ styles.additionalTaskSectionsTitle }>
                        <Text style={ theme.fonts.subtitleSecond }>
                            { t('main.today.additionalTasks.title') }
                        </Text>
                    </View>

                    <View style={ theme.flexBlocks.vertical8 }>
                        {
                            additionalTaskSections
                                .filter((section) => {
                                    // Фильтруем секции: если для ARTICLE или SURVEY нет данных, не показываем секцию
                                    const isArticleSection = section.mode === AdditionalActivityType.ARTICLE;
                                    const isSurveySection = section.mode === AdditionalActivityType.SURVEY;

                                    if (isArticleSection && !randomArticle) {
                                        return false; // Не показываем секцию ARTICLE, если нет данных
                                    }

                                    if (isSurveySection && !randomSurvey) {
                                        return false; // Не показываем секцию SURVEY, если нет данных
                                    }

                                    return true; // Показываем все остальные секции
                                })
                                .map((section, index) => {
                                const isMoodSection = section.mode === AdditionalActivityType.MOOD_TRACKER;
                                const isArticleSection = section.mode === AdditionalActivityType.ARTICLE;
                                const isSurveySection = section.mode === AdditionalActivityType.SURVEY;
                                const isBlocked = isMoodSection && hasMoodForToday;

                                // Получаем данные для article и survey
                                const articleData = isArticleSection ? randomArticle : null;
                                const surveyData = isSurveySection ? randomSurvey : null;

                                // Определяем текст для отображения
                                let displayTitle = t(section.label);
                                let displayInfo = t(section.info);
                                let displayDescription = section.description ? t(section.description) : null;

                                // Если есть данные из API, используем их
                                if (articleData) {
                                    displayInfo = articleData.title || displayInfo;
                                    if (articleData.text) {
                                        displayDescription = articleData.text.length > 100
                                            ? articleData.text.substring(0, 100) + '...'
                                            : articleData.text;
                                    }
                                }

                                if (surveyData) {
                                    displayInfo = surveyData.title || displayInfo;
                                    if (surveyData.description) {
                                        if (typeof surveyData.description === 'string') {
                                            displayDescription = surveyData.description.length > 100
                                                ? surveyData.description.substring(0, 100) + '...'
                                                : surveyData.description;
                                        } else {
                                            // Если description - объект, используем fallback
                                            displayDescription = displayDescription;
                                        }
                                    }
                                }

                                return (
                                    <Pressable
                                        key={ index }
                                        style={ {
                                            ...styles.activitySection,
                                            backgroundColor: '#fff',
                                            borderRadius: 24,
                                            opacity: isBlocked ? 0.6 : 1
                                        } }
                                        onPress={ () => onAdditionalSectionClick(section) }
                                        disabled={ isBlocked }
                                    >
                                        <View style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter ] }>
                                            { section.icon }

                                            <Text style={ [
                                                theme.fonts.subtitle,
                                            ] }>
                                                { displayTitle }
                                            </Text>

                                            { isBlocked && (
                                                <WhiteCheckmarkIcon />
                                            )}
                                        </View>

                                        <View style={ theme.flexBlocks.vertical4 }>
                                            <Text style={ [
                                                theme.fonts.subheader,
                                                isBlocked && {
                                                    color: '#000',
                                                    textDecorationLine: 'line-through',
                                                    opacity: 0.3
                                                }
                                            ] }>
                                                { displayInfo }
                                            </Text>

                                            { displayDescription &&
                                                <Text style={ [
                                                    theme.fonts.regular,
                                                    { opacity: .6 },
                                                ] } numberOfLines={2}>
                                                    { displayDescription }
                                                </Text>
                                            }
                                        </View>
                                    </Pressable>
                                );
                            })
                        }
                    </View>

                </View>
            </View>

            <BottomSheet title={ t('main.today.weekTotal.header') } visible={ weeklyTotalModalOpen }
                         onClose={ () => setWeeklyTotalModalOpen(false) }
                         button={
                             <CustomButton
                                 title={ t('close') }
                                 onPress={ () => setWeeklyTotalModalOpen(false) }
                             />
                         }>
                <View style={ theme.flexBlocks.vertical8 }>
                    <FireIcon/>

                    <View>
                        <Text style={ { ...theme.fonts.title, textAlign: 'left' } }>
                            Information about balance and how it works
                        </Text>

                        <Text style={ [ theme.fonts.regular, { opacity: .6 } ] }>
                            Description
                        </Text>
                    </View>
                </View>
            </BottomSheet>

            <BottomSheet title={ t('main.modals.measureActivity.title') } visible={ activityModalOpen }
                         onClose={ () => {
                             setActivityModalOpen(false);
                             setSelectedActivityId(null);
                             setSatisfactionLevel(0);
                             setHardnessLevel(0);
                             setActiveSliderDrags(0);
                         } }
                         scrollEnabled={ activeSliderDrags === 0 }
                         button={
                             <CustomButton
                                 title={ t('complete') }
                                 themeName={ !satisfactionLevel || !hardnessLevel ? 'primary_disabled' : 'primary' }
                                 disabled={ !satisfactionLevel || !hardnessLevel || closeActivityMutation.isPending }
                                 loading={ closeActivityMutation.isPending }
                                 onPress={ () => {
                                     if (selectedActivityId && satisfactionLevel && hardnessLevel) {
                                         closeActivityMutation.mutate(
                                             {
                                                 id: selectedActivityId,
                                                 data: {
                                                     satisfactionLevel,
                                                     hardnessLevel,
                                                 },
                                             },
                                             {
                                                 onSuccess: () => {
                                                     setActivityModalOpen(false);
                                                     setSelectedActivityId(null);
                                                     setSatisfactionLevel(0);
                                                     setHardnessLevel(0);
                                                 },
                                                 onError: () => {},
                                             }
                                         );
                                     }
                                 } }
                             >
                                 { !satisfactionLevel || !hardnessLevel ? <WhiteCheckmarkIconDisabled/> :
                                     <WhiteCheckmarkIcon/> }
                             </CustomButton>
                         }>
                <View style={ theme.flexBlocks.vertical16 }>
                    <View style={ theme.flexBlocks.vertical8 }>
                        <HelloIcon/>

                        <Text style={ { ...theme.fonts.title, textAlign: 'left' } }>
                            { t('main.modals.measureActivity.info') }
                        </Text>
                    </View>

                    <View>
                        <SatisfactionSlider
                            label={ t('main.modals.measureActivity.satisfactionLevel.label') }
                            startLabel={ t('main.modals.measureActivity.satisfactionLevel.startLabel') }
                            endLabel={ t('main.modals.measureActivity.satisfactionLevel.endLabel') }
                            initialValue={ satisfactionLevel }
                            onChange={ setSatisfactionLevel }
                            onDragStart={ () => setActiveSliderDrags(prev => prev + 1) }
                            onDragEnd={ () => setActiveSliderDrags(prev => Math.max(0, prev - 1)) }
                            colors={ [ '#DD583D', '#FFC372' ] }
                        />
                    </View>

                    <View>
                        <SatisfactionSlider
                            label={ t('main.modals.measureActivity.hardnessLevel.label') }
                            startLabel={ t('main.modals.measureActivity.hardnessLevel.startLabel') }
                            endLabel={ t('main.modals.measureActivity.hardnessLevel.endLabel') }
                            initialValue={ hardnessLevel }
                            onChange={ setHardnessLevel }
                            onDragStart={ () => setActiveSliderDrags(prev => prev + 1) }
                            onDragEnd={ () => setActiveSliderDrags(prev => Math.max(0, prev - 1)) }
                            colors={ [ '#CA21D0', '#810085' ] }
                        />
                    </View>
                </View>
            </BottomSheet>

            <MoodTracker visible={ moodTrackerModalOpen } onClose={ () => setMoodTrackerModalOpen(false) }/>

            <EmailVerificationModal
                visible={emailVerificationModalOpen}
                onClose={() => setEmailVerificationModalOpen(false)}
                onSuccess={() => {
                    setEmailVerificationModalOpen(false);
                    setEmailVerificationTooltipVisible(false);
                }}
            />
        </View>
        </TabScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'transparent',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 24
    },
    main: {
        width: '100%',
        flexDirection: 'column',
        gap: 8
    },
    cardTotal: {
        padding: 16,
        position: 'relative',
    },
    circlesRow: {
        position: 'absolute',
        bottom: -8,
        left: 5,
        flexDirection: 'row',
        width: '100%',
        gap: 11,
    },
    circle: {
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2
    },
    weekTotal: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    weekInfo: {
        flexDirection: 'column',
        gap: 4
    },
    activitySections: {
        flexDirection: 'column',
        backgroundColor: '#F5F5F5',
        borderRadius: 16
    },
    activitySection: {
        flexDirection: 'column',
        padding: 16,
        gap: 8
    },
    activityLabel: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 24,
        flexDirection: 'row',
        gap: 4,
        alignSelf: "flex-start"
    },
    activityContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16
    },
    activityTitle: {
        maxWidth: getResponsiveActivityMaxWidth()
    },
    activitySectionDone: {
        opacity: .3,
        textDecorationLine: "line-through",
    },
    additionalTaskSectionsTitle: {
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    emptyActivityContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        gap: 16
    },
    emptyActivityTextContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0
    },
    emptyActivityText: {
        textAlign: 'center',
        color: '#000000',
        fontWeight: '600'
    }
});
