import React, { useEffect, useRef } from "react";
import {StyleSheet, View, ScrollView} from "react-native";
import {useCustomTheme} from "@app/theme/ThemeContext";
import LottieView from "lottie-react-native";
import { isSmallScreen } from "@shared/utils/screenUtils";

export default function TwelfthStep({onNext}: { onNext: () => void }) {
    const {theme} = useCustomTheme();
    const hasCalledNext = useRef(false);
    const isSmall = isSmallScreen();

    useEffect(() => {
        // Предотвращаем множественные вызовы onNext
        if (!hasCalledNext.current) {
            hasCalledNext.current = true;
            const timer = setTimeout(() => {
                onNext();
            }, 1500);

            return () => {
                clearTimeout(timer);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const content = (
        <View style={styles.content}>
            <LottieView
                source={require('../../../../../assets/Slider.json')}
                autoPlay
                loop
                style={styles.lottie}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            {isSmall ? (
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {content}
                </ScrollView>
            ) : (
                content
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
});
