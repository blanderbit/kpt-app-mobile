import React from "react";
import { ImageBackground, SafeAreaView, StyleSheet, View } from "react-native";
import { AuthProvider } from "@features/auth/AuthProvider";
import { useFonts } from "expo-font";
import "../locales";
import { ThemeProvider, useCustomTheme } from "@app/theme/ThemeContext";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { AppNavigator } from "@app/navigation/AppNavigator";
import { ToastProvider } from "@shared/components/Toast/ToastProvider";
import { ScrollBlockerProvider } from "@app/scroll-blocker/ScrollBlockerContext";

function MainApp() {
    const { theme } = useCustomTheme();

    const navTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
            card: 'transparent',
            primary: 'transparent',
        },
    };

    return (
        <ImageBackground
            source={ theme.backgroundImage }
            style={ { flex: 1 } }
            resizeMode="cover"
            imageStyle={ { opacity: 1 } }
        >
            <View style={ [ styles.container ] }>
                <NavigationContainer>
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
        "SF Pro Display": require("../assets/fonts/SF-Pro-Display-Regular.otf"),
        "SF Pro Display Bold": require("../assets/fonts/SF-Pro-Display-Bold.otf"),
        "PP Editorial New": require("../assets/fonts/PPEditorialNew-Regular.otf"),
        "Tilt Wrap": require("../assets/fonts/TiltWarp-Regular-VariableFont_XROT,YROT.ttf"),
        Inter: require("../assets/fonts/Inter_18pt-Regular.ttf"),
    });

    if ( !fontsLoaded ) return null;

    return (
        <AuthProvider>
            <ThemeProvider>
                <ToastProvider>
                    <MainApp/>
                </ToastProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, height: "100%", alignItems: "center", backgroundColor: 'transparent' },
});
