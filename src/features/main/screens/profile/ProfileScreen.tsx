import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Pressable, Alert } from 'react-native';
import { useCustomTheme } from '@app/theme/ThemeContext';
import { useTranslation } from "react-i18next";
import LayersIcon from "@assets/icons/LayersIcon";
import { MoodIcon } from "@assets/icons/MoodIcon";
import SettingsIcon from "@assets/icons/SettingsIcon";
import ToggleSwitch from "@shared/components/ToggleSwitch/ToggleSwitch";
import Progress from "@features/profile/components/Progress/Progress";
import { LinearGradient } from "expo-linear-gradient";
import {settingsElements, SettingsItem, weekDays} from "@features/main/screens/profile/const";
import { COLORS } from "@app/theme";
import { ChevronRightIcon } from "@assets/icons/ChevronRightIcon";
import { HomeScreenNavigationProp } from "@app/navigation/AppNavigator";
import { SectionItem } from "@shared/components/SectionItem/SectionItem";
import { useAuth } from "@app/hooks/auth.hook";
import { useProfile } from "@app/hooks/profile.hook";
import { useDeleteAccount, useMoodForLast7Days } from "@shared/services/api";
import { LoadingSpinner } from "@shared/components/LoadingSpinner/LoadingSpinner";

export default function ProfileScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const { logout } = useAuth();
    const { profile, isLoading, error, refreshProfile } = useProfile();
    const deleteAccount = useDeleteAccount();
    const { data: moodData, isLoading: isLoadingMood } = useMoodForLast7Days();

    const [ satisfaction, setSatisfaction ] = useState(75)
    const [ achieveness, setAchieveness ] = useState(25)

    const handleLogout = () => {
        Alert.alert(
            t('main.profile.settings.logOut'),
            t('main.profile.settings.areYouSureLogOut'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('main.profile.settings.logOut'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('🚪 Начинаем процесс выхода...');
                            await logout();
                            console.log('✅ Выход выполнен успешно');
                        } catch (error) {
                            console.error('❌ Ошибка выхода:', error);
                            Alert.alert('Ошибка', 'Не удалось выйти из аккаунта');
                        }
                    },
                },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            t('main.profile.settings.deleteAccount'),
            t('main.profile.settings.areYouSureDeleteAccount'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('main.profile.settings.deleteAccount'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('🗑️ Начинаем процесс удаления аккаунта...');
                            await deleteAccount.mutateAsync({ confirm: true });
                            console.log('✅ Аккаунт удален успешно');
                            
                            // После успешного удаления аккаунта выполняем логаут
                            await logout();
                            
                            Alert.alert(
                                t('main.profile.settings.accountDeleted'),
                                t('main.profile.settings.accountDeletedMessage'),
                                [{ text: t('ok') }]
                            );
                        } catch (error) {
                            console.error('❌ Ошибка удаления аккаунта:', error);
                            Alert.alert(
                                'Ошибка', 
                                error?.message || 'Не удалось удалить аккаунт'
                            );
                        }
                    },
                },
            ]
        );
    };

    // Создаем массив последних 7 дней с данными о настроениях
    const last7DaysMood = useMemo(() => {
        const days = [];
        const today = new Date();
        
        console.log('🎭 ProfileScreen: moodData from API:', moodData);
        
        // Создаем массив дней недели, начиная с сегодняшнего дня
        const todayDayOfWeek = today.getDay(); // 0 = воскресенье, 1 = понедельник, ..., 6 = суббота
        const weekDaysOrdered = [];
        
        // Создаем порядок дней недели, начиная с сегодняшнего дня
        for (let i = 0; i < 7; i++) {
            const dayIndex = (todayDayOfWeek - 6 + i + 7) % 7; // Начинаем с 6 дней назад
            weekDaysOrdered.push(weekDays[dayIndex]);
        }
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
            
            // Ищем настроение для этого дня в данных с бэкенда
            const moodForDay = moodData?.find(mood => mood.moodDate === dateString);
            
            days.push({
                date: dateString,
                mood: moodForDay || null,
                dayName: weekDaysOrdered[6 - i] // Используем переупорядоченные дни недели
            });
        }
        
        console.log('🎭 ProfileScreen: last7DaysMood processed:', days);
        console.log('🎭 ProfileScreen: today is', today.toDateString(), 'day of week:', todayDayOfWeek);
        return days;
    }, [moodData])

    // Показываем загрузку если профиль загружается
    if (isLoading) {
        return <LoadingSpinner visible={true} />;
    }

    // Показываем ошибку если не удалось загрузить профиль
    if (error) {
        Alert.alert('Ошибка', `Ошибка загрузки профиля: ${error}`);
        return null;
    }

    const handlePress = (nested: SettingsItem) => {
        if (nested.path) {
            navigation.navigate(nested.path);
        } else if (nested.label === 'main.profile.settings.logOut') {
            handleLogout();
        } else if (nested.label === 'main.profile.settings.deleteAccount') {
            handleDeleteAccount();
        }
    };

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
                        {profile?.firstName || 'Пользователь'}
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
                            { isLoadingMood ? (
                                <View style={ [ theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter, { paddingVertical: 20 } ] }>
                                    <Text style={ theme.fonts.subtitle }>{ t('main.profile.mood.loading') }</Text>
                                </View>
                            ) : (
                                <View style={ theme.flexBlocks.justifySpaceBetween }>
                                    { last7DaysMood.map((dayData, index) => (
                                        <View
                                            key={ index }
                                            style={ [ { flex: 1 }, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter, theme.flexBlocks.vertical8 ] }>
                                            <Text style={ { fontSize: 28, lineHeight: 28 } }>
                                                { dayData.mood?.moodTypeDetails?.emoji || '' }
                                            </Text>
                                            <Text style={ styles.progressLabel }>
                                                { dayData.dayName }
                                            </Text>
                                        </View>
                                    )) }
                                </View>
                            ) }
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
                                            { element.map((nested, nestedIndex) => {
                                                return (
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
                                                        onPress={ () => handlePress(nested) }
                                                    />
                                                );
                                            }) }
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
