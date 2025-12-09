import React, { useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { AuthProvider } from "@features/auth/AuthProvider";
import { ProfileProvider } from "@features/profile/ProfileProvider";
import { QueryProvider } from "@shared/services/query/QueryProvider";
import { useFonts } from "expo-font";
import "../locales";
import { ThemeProvider, useCustomTheme } from "@app/theme/ThemeContext";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "@app/navigation/AppNavigator";
import { ToastProvider } from "@shared/components/Toast/ToastProvider";
import { ScrollBlockerProvider } from "@app/scroll-blocker/ScrollBlockerContext";
import { SubscriptionOfferingProvider } from "@features/auth/screens/SubcriptionOffering/SubscriptionOfferingProvider";
import { Routes } from "@app/navigation/const";
import { amplitudeAnalyticsService } from "@shared/services/analytics";
import { appsFlyerService } from "@shared/services/appsflyer";
import { configureGoogleSignIn } from "@features/auth/screens/firebaseAuth";
// import { revenueCatService } from "@shared/services/revenuecat";
// import { getRevenueCatApiKey } from "@app/config/revenuecat.config";

function MainApp() {
    const { theme } = useCustomTheme();

    return (
        <ImageBackground
            source={ theme.backgroundImage }
            style={ { flex: 1 } }
            resizeMode="cover"
            imageStyle={ { opacity: 1 } }>
            <View style={ [ styles.container ] }>
                <NavigationContainer
                    linking={{
                        prefixes: ['plesury://', 'exp+plesury://'],
                        config: {
                            screens: {
                                Today: 'today',
                                Activities: 'activities',
                                Profile: 'profile',
                                PersonalInfo: 'personal-info',
                                SubscriptionSettings: 'subscription-settings',
                                Article: {
                                    path: 'article',
                                    parse: {
                                        id: (id: string) => id,
                                    },
                                },
                                Survey: {
                                    path: 'survey',
                                    parse: {
                                        id: (id: string) => id,
                                    },
                                },
                                Login: 'login',
                                SignUp: 'sign-up',
                                ResetPass: 'reset-pass',
                                CheckEmail: {
                                    path: 'check-email',
                                    parse: {
                                        email: (email: string) => decodeURIComponent(email),
                                    },
                                },
                                Onboarding: 'onboarding',
                            },
                        },
                    }}
                >
                    <ScrollBlockerProvider>
                        <AppNavigator/>
                    </ScrollBlockerProvider>
                </NavigationContainer>
            </View>
        </ImageBackground>
    );
}

export default function App() {
    const [ fontsLoaded ] = useFonts({
        "SF Pro Display": require("../../assets/fonts/SF-Pro-Display-Regular.otf"),
        "SF Pro Display SemiBold": require("../../assets/fonts/SF-Pro-Display-Semibold.otf"),
        "SF Pro Display Bold": require("../../assets/fonts/SF-Pro-Display-Bold.otf"),
        "PP Editorial New": require("../../assets/fonts/PPEditorialNew-Regular.otf"),
        "Tilt Wrap": require("../../assets/fonts/TiltWarp-Regular-VariableFont_XROT,YROT.ttf"),
        Inter: require("../../assets/fonts/Inter_18pt-Regular.ttf"),
        InterMedium: require("../../assets/fonts/Inter_18pt-Medium.ttf"),
        InterSemibold: require("../../assets/fonts/Inter_18pt-SemiBold.ttf"),
    });

    // Amplitude Analytics будет инициализирован в AuthProvider после логина

    // Инициализация AppsFlyer
    useEffect(() => {
        appsFlyerService.initialize((deepLink, data) => {
            console.log('[App] AppsFlyer deep link received:', deepLink, data);
            // AppsFlyer уже обработал ссылку и откроет её через Linking
            // React Navigation автоматически обработает deep link
        });
    }, []);

    // Инициализация Google Sign In
    useEffect(() => {
        configureGoogleSignIn().catch((error) => {
            console.error('[App] Failed to configure Google Sign In:', error);
        });
    }, []);

    // Инициализация RevenueCat - временно отключено
    // useEffect(() => {
    //     try {
    //         const apiKey = getRevenueCatApiKey();
    //         // Проверяем, что ключ не дефолтный
    //         if (apiKey && !apiKey.includes('YOUR_') && !apiKey.includes('HERE')) {
    //             revenueCatService.initialize({ apiKey });
    //         } else {
    //             console.warn('RevenueCat API key not configured. Please set REVENUECAT_IOS_API_KEY and REVENUECAT_ANDROID_API_KEY in your environment or update revenuecat.config.ts');
    //         }
    //     } catch (error) {
    //         console.error('Failed to initialize RevenueCat:', error);
    //     }
    // }, []);

    if ( !fontsLoaded ) return null;

    return (
        <QueryProvider>
            <ProfileProvider>
                <AuthProvider>
                    <ThemeProvider>
                        <ToastProvider>
                            <SubscriptionOfferingProvider>
                                <MainApp/>
                            </SubscriptionOfferingProvider>
                        </ToastProvider>
                    </ThemeProvider>
                </AuthProvider>
            </ProfileProvider>
        </QueryProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, height: "100%", alignItems: "center", backgroundColor: 'transparent' },
});
