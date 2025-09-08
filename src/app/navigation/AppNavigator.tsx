import React from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@app/hooks/auth.hook';

import LoginScreen from '@features/auth/screens/LoginScreen';
import ResetPassScreen from "@features/auth/screens/ResetPassScreen";
import CheckEmailScreen from "@features/auth/screens/CheckEmailScreen";

import MainScreen from "@features/main/screens/MainScreen";
import PersonalInfoScreen from "@features/main/screens/personal-info/PersonalInfoScreen";

import { useCustomTheme } from "@app/theme/ThemeContext";
import { Routes } from "@app/navigation/const";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SubscriptionSettingsScreen from "@features/main/screens/subscription-settings/SubscriptionSettingsScreen";
import { RouteProp } from "@react-navigation/native";
import { useTheme } from '@react-navigation/native';
import ArticleScreen from "@features/main/screens/article/ArticleScreen";

type RootStackParamList = {
    [Routes.LOGIN]: undefined;
    [Routes.RESET_PASS]: undefined;
    [Routes.CHECK_EMAIL]: undefined;
    [Routes.HOME]: undefined;
    [Routes.PERSONAL_INFO]: undefined;
    [Routes.SUBSCRIPTION_SETTINGS]: undefined;
    [Routes.ARTICLE]: { id: string };
};

export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.LOGIN>;
export type ResetPassScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.RESET_PASS>;
export type CheckEmailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.CHECK_EMAIL>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.HOME>;
export type PersonalInfoScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.PERSONAL_INFO>;
export type SubscriptionSettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.SUBSCRIPTION_SETTINGS>;
export type ArticleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, Routes.ARTICLE>;

export type ArticleScreenRouteProp = RouteProp<RootStackParamList, Routes.ARTICLE>;

const Stack = createStackNavigator<RootStackParamList>();

export function AppNavigator() {
    const { isAuthenticated } = useAuth();
    const { theme } = useCustomTheme();

    const { colors } = useTheme();
    colors.background = 'transparent';

    return (
        <View style={styles.main}>
            <Stack.Navigator
                screenOptions={ {
                    headerShown: false,
                    cardStyle: { backgroundColor: 'transparent' },
                    cardOverlayEnabled: false,
                    cardStyleInterpolator: ({ current, next, layouts }) => {
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

                        console.log(next)
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
                } }
            >
                { isAuthenticated ? (
                    <>
                        <Stack.Screen name={ Routes.HOME } component={ MainScreen } />
                        <Stack.Screen name={ Routes.PERSONAL_INFO } component={ PersonalInfoScreen }/>
                        <Stack.Screen name={ Routes.SUBSCRIPTION_SETTINGS } component={ SubscriptionSettingsScreen }/>
                        <Stack.Screen name={ Routes.ARTICLE } component={ ArticleScreen }/>
                    </>
                ) : (
                    <>
                        <Stack.Screen name={ Routes.LOGIN } component={ LoginScreen }/>
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
