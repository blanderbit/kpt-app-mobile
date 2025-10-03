import React from "react";
import {StyleSheet, View} from "react-native";
import {useCustomTheme} from "@app/theme/ThemeContext";

export default function TwelfthStep({onNext}: { onNext: () => void }) {
    const {theme} = useCustomTheme();

    setTimeout(() => onNext(), 100);

    return (
        <View style={styles.container}>
            <View style={styles.content}>

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
    },
});
