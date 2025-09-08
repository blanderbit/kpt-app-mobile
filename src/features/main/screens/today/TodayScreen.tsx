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
import { HomeScreenNavigationProp } from "@app/navigation/AppNavigator";
import SemiCircleSplit from "@shared/components/GradientArc/GradientArc";
import MoodTracker from "@features/main/screens/mood-tracker/MoodTracker";
import { Routes } from '@app/navigation/const';

const circleSize = 16;

export default function TodayScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    const [ activitySections, setActivitySections ] = useState([ ...DailyActivitySections ])

    const [ circlesCount, setCirclesCount ] = useState(0);
    const [ weeklyTotalModalOpen, setWeeklyTotalModalOpen ] = useState(false);
    const [ activityModalOpen, setActivityModalOpen ] = useState(false);
    const [ moodTrackerModalOpen, setMoodTrackerModalOpen ] = useState(false);

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
            setMoodTrackerModalOpen(true)
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

    return (
        <View style={ styles.container }>
            <View style={ theme.flexBlocks.vertical8 }>
                <Text style={ theme.fonts.subtitle }>
                    { t('main.today.subtitle', { userName: 'Rostyk' }) }
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
                                <View style={ { ...styles.activityLabel, backgroundColor: section.backgroundColor } }>
                                    { section.icon }
                                    <Text style={ {
                                        ...theme.fonts.label,
                                        color: section.color
                                    } }>{ t(section.label) }</Text>
                                </View>

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
                            additionalTaskSections.map((section, index) => (
                                <Pressable key={ index } style={ {
                                    ...styles.activitySection,
                                    backgroundColor: '#fff',
                                    borderRadius: 24
                                } } onPress={ () => onAdditionalSectionClick(section) }>
                                    <View style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter ] }>
                                        { section.icon }

                                        <Text style={ theme.fonts.subtitle }>{ t(section.label) }</Text>
                                    </View>

                                    <View style={ theme.flexBlocks.vertical4 }>
                                        <Text style={ theme.fonts.subheader }>
                                            { t(section.info) }
                                        </Text>

                                        { section.description &&
                                            <Text style={ [ theme.fonts.regular, { opacity: .6 } ] }>
                                                { t(section.description) }
                                            </Text> }
                                    </View>
                                </Pressable>
                            ))
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
        </View>
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
