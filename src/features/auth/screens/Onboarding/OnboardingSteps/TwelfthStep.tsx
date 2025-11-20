import React, { useEffect, useRef } from "react";
import {StyleSheet, View} from "react-native";
import {useCustomTheme} from "@app/theme/ThemeContext";
import LottieView from "lottie-react-native";

export default function TwelfthStep({onNext}: { onNext: () => void }) {
    const {theme} = useCustomTheme();
    const hasCalledNext = useRef(false);

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

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <LottieView
                    source={require('../../../../../assets/Slider.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
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
