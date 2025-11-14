import React from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@app/hooks/auth.hook';

import LoginScreen from '@features/auth/screens/LoginScreen';
import SignUpScreen from '@features/auth/screens/SignUpScreen';
import ResetPassScreen from "@features/auth/screens/ResetPassScreen";
import CheckEmailScreen from "@features/auth/screens/CheckEmailScreen";

import TodayScreen from "@features/main/screens/today/TodayScreen";
import ActivitiesScreen from "@features/activities/ActivitiesScreen";
import ProfileScreen from "@features/main/screens/profile/ProfileScreen";
import PersonalInfoScreen from "@features/main/screens/personal-info/PersonalInfoScreen";

import { useCustomTheme } from "@app/theme/ThemeContext";
import { Routes } from "@app/navigation/const";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SubscriptionSettingsScreen from "@features/main/screens/subscription-settings/SubscriptionSettingsScreen";
import { RouteProp } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import ArticleScreen from "@features/main/screens/article/ArticleScreen";
import { LoadingSpinner } from "@shared/components/LoadingSpinner/LoadingSpinner";
import OnboardingTemplate from "@features/auth/screens/Onboarding/OnboardingTemplate";

type RootStackParamList = {
    [Routes.LOGIN]: undefined;
    [Routes.SIGN_UP]: undefined;
    [Routes.RESET_PASS]: undefined;
    [Routes.CHECK_EMAIL]: { email: string };
    [Routes.TODAY]: undefined;
    [Routes.ACTIVITIES]: undefined;
    [Routes.PROFILE]: undefined;
    [Routes.PERSONAL_INFO]: undefined;
    [Routes.SUBSCRIPTION_SETTINGS]: undefined;
    [Routes.ARTICLE]: { id: string };
    [Routes.REDIRECT]: undefined;
    [Routes.ONBOARDING]: undefined;
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.LOGIN>;
export type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.SIGN_UP>;
export type ResetPassScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.RESET_PASS>;
export type CheckEmailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.CHECK_EMAIL>;
export type TodayScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.TODAY>;
// Общий тип навигации для табов и других экранов
export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type ActivitiesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.ACTIVITIES>;
export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.PROFILE>;
export type PersonalInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.PERSONAL_INFO>;
export type SubscriptionSettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.SUBSCRIPTION_SETTINGS>;
export type ArticleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.ARTICLE>;

export type ArticleScreenRouteProp = RouteProp<RootStackParamList, Routes.ARTICLE>;
export type CheckEmailScreenRouteProp = RouteProp<RootStackParamList, Routes.CHECK_EMAIL>;

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
    const { isAuthenticated, isLoading } = useAuth();
    const { theme } = useCustomTheme();

    const { colors } = useTheme();
    colors.background = 'transparent';

    if (isLoading) {
        return (
            <View style={styles.main}>
                <LoadingSpinner visible={true} />
            </View>
        );
    }

    return (
        <View style={styles.main}>
            <Stack.Navigator
                initialRouteName={isAuthenticated ? Routes.TODAY : Routes.LOGIN}
                screenOptions={ ({ route }) => {
                    // Список роутов табов, для которых не нужна анимация
                    const tabRoutes = [Routes.TODAY, Routes.ACTIVITIES, Routes.PROFILE];
                    const isTabRoute = tabRoutes.includes(route.name as Routes);
                    
                    return {
                        headerShown: false,
                        cardStyle: { backgroundColor: 'transparent' },
                        cardOverlayEnabled: false,
                        // Для табов отключаем анимацию полностью
                        animationEnabled: !isTabRoute,
                        transitionSpec: isTabRoute ? {
                            open: { animation: 'timing', config: { duration: 0 } },
                            close: { animation: 'timing', config: { duration: 0 } },
                        } : undefined,
                        // Для табов - без анимации, для остальных - с анимацией
                        cardStyleInterpolator: isTabRoute 
                            ? () => ({ cardStyle: { opacity: 1 } })
                            : ({ current, next, layouts }) => {
                                const translateX = current.progress.interpolate({
                                    inputRange: [ 0, 1 ],
                                    outputRange: [ layouts.screen.width + 40, 0 ],
                                });

                                const nextTranslateX = next
                                    ? next.progress.interpolate({
                                        inputRange: [ 0, 1 ],
                                        outputRange: [ 0, -layouts.screen.width - 40 ],
                                    })
                                    : 0;

                                return {
                                    cardStyle: {
                                        transform: [
                                            {
                                                translateX: next ? nextTranslateX : translateX,
                                            },
                                        ],
                                    },
                                };
                            },
                    };
                } }
            >
                { isAuthenticated ? (
                    <>
                        <Stack.Screen 
                            name={ Routes.TODAY } 
                            component={ TodayScreen }
                        />
                        <Stack.Screen 
                            name={ Routes.ACTIVITIES } 
                            component={ ActivitiesScreen }
                        />
                        <Stack.Screen 
                            name={ Routes.PROFILE } 
                            component={ ProfileScreen }
                        />
                        <Stack.Screen name={ Routes.PERSONAL_INFO } component={ PersonalInfoScreen }/>
                        <Stack.Screen name={ Routes.SUBSCRIPTION_SETTINGS } component={ SubscriptionSettingsScreen }/>
                        <Stack.Screen name={ Routes.ARTICLE } component={ ArticleScreen }/>
                    </>
                ) : (
                    <>
                        <Stack.Screen name={ Routes.LOGIN } component={ LoginScreen }/>
                        <Stack.Screen name={ Routes.ONBOARDING } component={ OnboardingTemplate }/>
                        <Stack.Screen name={ Routes.SIGN_UP } component={ SignUpScreen }/>
                        <Stack.Screen name={ Routes.RESET_PASS } component={ ResetPassScreen }/>
                        <Stack.Screen name={ Routes.CHECK_EMAIL } component={ CheckEmailScreen }/>
                    </>
                ) }
            </Stack.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        height: "100%",
        width: "100%",
        paddingTop: 60,
        paddingHorizontal: 14,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center',
    },
});
