import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable } from 'react-native';
import { useCustomTheme } from '@app/theme/ThemeContext';
import { useTranslation } from "react-i18next";
import LayersIcon from "@assets/icons/LayersIcon";
import { MoodIcon } from "@assets/icons/MoodIcon";
import SettingsIcon from "@assets/icons/SettingsIcon";
import ToggleSwitch from "@shared/components/ToggleSwitch/ToggleSwitch";
import Progress from "@features/profile/components/Progress/Progress";
import { LinearGradient } from "expo-linear-gradient";
import { settingsElements, weekDays } from "@features/main/screens/profile/const";
import { COLORS } from "@app/theme";
import { ChevronRightIcon } from "@assets/icons/ChevronRightIcon";
import { HomeScreenNavigationProp } from "@app/navigation/AppNavigator";
import { SectionItem } from "@shared/components/SectionItem/SectionItem";
import { moodConfig } from "@features/main/screens/mood-tracker/const";

export default function ProfileScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    const [ satisfaction, setSatisfaction ] = useState(75)
    const [ achieveness, setAchieveness ] = useState(25)

    const moodValues = useMemo(() => ([
        {
            value: 1
        },
        {
            value: 2
        },
        {
            value: 3
        },
        {
            value: 4
        },
        {
            value: 5
        },
        {
            value: 6
        },
        {
            value: 1
        }
    ]))

    return (
        <View style={ [ styles.container ] }>
            <ScrollView
                contentContainerStyle={ [ styles.scrollContent, theme.flexBlocks.vertical8 ] }
                showsVerticalScrollIndicator={ false }
            >
                <View style={ theme.flexBlocks.vertical8 }>
                    <Text style={ { ...theme.fonts.subtitle, textAlign: 'left' } }>
                        { t('hello') }
                    </Text>

                    <Text style={ theme.fonts.title }>
                        Rostyk
                    </Text>
                </View>

                <View style={ theme.flexBlocks.vertical8 }>
                    <View style={ theme.containers.cardRound }>
                        <View
                            style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                            <LayersIcon/>

                            <Text style={ theme.fonts.subtitle }>
                                { t('main.profile.progress.title') }
                            </Text>
                        </View>

                        <View style={ styles.progressContainer }>
                            <View
                                style={ [ styles.progressMain, theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter ] }>
                                <Progress leftPercent={ satisfaction } rightPercent={ achieveness }/>

                                <View style={ theme.flexBlocks.vertical16 }>
                                    <View style={ theme.flexBlocks.vertical8 }>
                                        <View style={ theme.flexBlocks.horizontal4 }>
                                            <LinearGradient
                                                colors={ [ '#DD583D', '#FFC372' ] }
                                                start={ { x: 0, y: 0 } }
                                                end={ { x: 1, y: 0 } }
                                                style={ { width: 18, height: 18, borderRadius: 50 } }
                                            />

                                            <Text style={ theme.fonts.subtitle }>
                                                { t('main.today.weekTotal.satisfaction') }
                                            </Text>
                                        </View>

                                        <Text style={ theme.fonts.title }>{ satisfaction }%</Text>
                                    </View>

                                    <View style={ theme.flexBlocks.vertical8 }>
                                        <View style={ theme.flexBlocks.horizontal4 }>
                                            <LinearGradient
                                                colors={ [ '#CA21D0', '#810085' ] }
                                                start={ { x: 0, y: 0 } }
                                                end={ { x: 1, y: 0 } }
                                                style={ { width: 18, height: 18, borderRadius: 50 } }
                                            />

                                            <Text style={ theme.fonts.subtitle }>
                                                { t('main.today.weekTotal.achieveness') }
                                            </Text>
                                        </View>

                                        <Text style={ theme.fonts.title }>{ achieveness }%</Text>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={ { ...theme.flexBlocks.horizontal4, ...theme.flexBlocks.justifySpaceBetween } }>
                                <View
                                    style={ [ styles.progressCounter, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter, theme.flexBlocks.vertical4, { flex: 1 } ] }>
                                    <Text style={ theme.fonts.titleSecond }>
                                        14
                                    </Text>

                                    <Text style={ styles.progressLabel }>
                                        { t('main.profile.progress.daysStreak') }
                                    </Text>
                                </View>

                                <View
                                    style={ [ styles.progressCounter, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter, theme.flexBlocks.vertical4, { flex: 1 } ] }>
                                    <Text style={ theme.fonts.titleSecond }>
                                        24
                                    </Text>

                                    <Text style={ styles.progressLabel }>
                                        { t('main.profile.progress.tasksCompleted') }
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={ theme.containers.cardRound }>
                        <View
                            style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                            <MoodIcon/>

                            <Text style={ theme.fonts.subtitle }>
                                { t('main.today.additionalTasks.mood.title') }
                            </Text>
                        </View>

                        <View style={ [ styles.progressContainer, { paddingVertical: 16 } ] }>
                            <View style={ theme.flexBlocks.justifySpaceBetween }>
                                { weekDays.map((day, index) => (
                                    <View
                                        key={ index }
                                        style={ [ { flex: 1 }, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter, theme.flexBlocks.vertical8 ] }>
                                        { moodConfig(28).find(config => config.value === moodValues[index].value).icon }
                                        <Text style={ styles.progressLabel }>
                                            { day }
                                        </Text>
                                    </View>
                                )) }
                            </View>
                        </View>
                    </View>

                    <View style={ theme.containers.cardRound }>
                        <View
                            style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                            <SettingsIcon/>

                            <Text style={ theme.fonts.subtitle }>
                                { t('main.profile.settings.title') }
                            </Text>
                        </View>

                        <View style={ theme.flexBlocks.vertical8 }>
                            { settingsElements.map((element, index) => {
                                if ( Array.isArray(element) ) {
                                    return (
                                        <View key={ index }>
                                            { element.map((nested, nestedIndex) => (
                                                <SectionItem
                                                    key={ `${ index }-${ nestedIndex }` }
                                                    icon={ nested.icon }
                                                    label={ nested.label }
                                                    rightElement={ <ChevronRightIcon/> }
                                                    extraStyles={ [
                                                        nestedIndex === 0 ? styles.settingsElementsBorderTop : {},
                                                        nestedIndex === element.length - 1
                                                            ? styles.settingsElementsBorderBottom
                                                            : {},
                                                        nestedIndex < element.length - 1 ? styles.settingsElementsBorder : {},
                                                    ] }
                                                    onPress={ () => nested.path ? navigation.navigate(nested.path) : null }
                                                />
                                            )) }
                                        </View>
                                    );
                                }

                                return (
                                    <SectionItem
                                        key={ index }
                                        icon={ element.icon }
                                        label={ element.label }
                                        rightElement={ index > 0 ? <ChevronRightIcon/> : <ToggleSwitch/> }
                                        extraStyles={ [ styles.settingsElementsSingle ] }
                                        onPress={ () => element.path ? navigation.navigate(element.path) : null }
                                    />
                                );
                            }) }
                        </View>

                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    progressContainer: {
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#F5F5F5',
        padding: 8
    },
    progressMain: {
        paddingVertical: 16
    },
    progressCounter: {
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
    },
    progressLabel: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: .6
    },
    settingsElement: {
        backgroundColor: COLORS.gray_light,
    },
    settingsElementsSingle: {
        borderRadius: 16,
    },
    settingsElementsBorder: {
        borderBottomWidth: 1,
        borderColor: '#E2DDD8',
    },
    settingsElementsBorderTop: {
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16
    },
    settingsElementsBorderBottom: {
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16
    }
});
