import React, { useEffect, useState } from 'react';
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
    DailyActivitySections,
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
import {PageTooltips} from "@shared/components/PageTooltips";
import { useAuth } from '@app/hooks/auth.hook';
import { EmailVerificationModal } from '@shared/components/EmailVerificationModal';
import { InfoPopup } from '@shared/components/InfoPopup/InfoPopup';
import { TabScreenContainer } from '@shared/components/TabScreenContainer/TabScreenContainer';

const circleSize = 16;

export default function TodayScreen({ navigation }: { navigation: TodayScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const { profile } = useProfile();
    const { hasMoodForToday, currentMood } = useCurrentMoodContext();
    const { isEmailVerified, isAuthenticated } = useAuth();

    console.log('TodayScreen state:', { 
        isEmailVerified, 
        isAuthenticated, 
        profileEmail: profile?.email,
        profileLoaded: !!profile,
        tooltipVisible: emailVerificationTooltipVisible,
        shouldShowTooltip: isAuthenticated && !isEmailVerified
    })

    const [ activitySections, setActivitySections ] = useState([ ...DailyActivitySections ])

    const [ circlesCount, setCirclesCount ] = useState(0);
    const [ weeklyTotalModalOpen, setWeeklyTotalModalOpen ] = useState(false);
    const [ activityModalOpen, setActivityModalOpen ] = useState(false);
    const [ moodTrackerModalOpen, setMoodTrackerModalOpen ] = useState(false);
    const [ emailVerificationModalOpen, setEmailVerificationModalOpen ] = useState(false);
    const [ emailVerificationTooltipVisible, setEmailVerificationTooltipVisible ] = useState(false);

    const [ satisfactionLevel, setSatisfactionLevel ] = useState(0);
    const [ hardnessLevel, setHardnessLevel ] = useState(0);

    const handleLayout = (e: LayoutChangeEvent) => {
        const width = e.nativeEvent.layout.width;
        setCirclesCount(Math.floor((width - 3) / circleSize));
    };

    const onSectionClick = (section) => {
        if ( section.mode === DailyActivityType.MEASURE_ACTIVITY && !section.done ) {
            setActivityModalOpen(true)
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
            navigation.navigate(Routes.ARTICLE, { id: '1' });
        }
    }

    useEffect(() => {
        if ( !activityModalOpen && satisfactionLevel > 0 && hardnessLevel > 0 ) {
            setActivitySections((prev) =>
                prev.map((section, index) =>
                    index === 0 ? { ...section, done: true } : section
                )
            );
        }
    }, [ activityModalOpen ]);

    // Показываем tooltip для неподтвержденного email
    useEffect(() => {
        console.log('useEffect triggered:', { isEmailVerified, isAuthenticated, profile: !!profile, email: profile?.email });
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
                    Program name
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
                        <Text style={ theme.fonts.subheader }>
                            { t('main.today.weekTotal.noInfo') }
                        </Text>

                        <Text style={ [ theme.fonts.regular, { opacity: .6 } ] }>
                            { t('main.today.weekTotal.description') }
                        </Text>
                    </View>

                    <SegmentedProgressBar/>

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
                        { activitySections.map((section, index) => (
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

                                <Pressable style={ styles.activityContent } onPress={ () => onSectionClick(section) }>
                                    <Text
                                        style={ [ styles.activityTitle, theme.fonts.subheader, section.done ? styles.activitySectionDone : {} ] }>
                                        { t(section.info) }
                                    </Text>

                                    {
                                        section.done ?
                                            <SemiCircleSplit valueA={ satisfactionLevel } valueB={ hardnessLevel }/> :
                                            <AddButton done/>
                                    }
                                </Pressable>
                            </View>
                        )) }
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
                            additionalTaskSections.map((section, index) => {
                                const isMoodSection = section.mode === AdditionalActivityType.MOOD_TRACKER;
                                const isBlocked = isMoodSection && hasMoodForToday;
                                
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
                                                { t(section.label) }
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
                                                { t(section.info) }
                                            </Text>

                                            { section.description &&
                                                <Text style={ [ 
                                                    theme.fonts.regular, 
                                                    { opacity: .6 },
                                                ] }>
                                                    { t(section.description) }
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
                         onClose={ () => setActivityModalOpen(false) }
                         button={
                             <CustomButton
                                 title={ t('complete') }
                                 themeName={ !satisfactionLevel || !hardnessLevel ? 'primary_disabled' : 'primary' }
                                 disabled={ !satisfactionLevel || !hardnessLevel }
                                 onPress={ () => setActivityModalOpen(false) }
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
        maxWidth: '70%'
    },
    activitySectionDone: {
        opacity: .3,
        textDecorationLine: "line-through",
    },
    additionalTaskSectionsTitle: {
        paddingVertical: 8,
        paddingHorizontal: 16
    }
});
