import React from "react";
import {StyleSheet, Text, View, Pressable} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {COLORS} from "@app/theme";

interface FirstStepProps {
    onNext: () => void;
    onBack: () => void;
}

export default function FirstStep({ onNext, onBack }: FirstStepProps) {

    const {theme} = useCustomTheme();

    return (
        <View style={styles.container}>
            <View style={styles.content} />

            <View style={theme.flexBlocks.vertical8}>
                <CustomButton
                    title={ 'Get started' }
                    onPress={onNext}
                />

                <View style={[theme.flexBlocks.alignCenter, styles.haveAnAccSection]}>
                    <View style={theme.flexBlocks.alignCenter}>
                        <Text style={styles.haveAnAccText}>Already have an account?</Text>
                        <Pressable onPress={onBack}>
                            <Text style={[styles.haveAnAccText, styles.logIn]}>Log in</Text>
                        </Pressable>
                    </View>
                </View>
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
    haveAnAccSection: {
        height: 52,
        margin: 'auto'
    },
    haveAnAccText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter Semibold',
        fontWeight: '600',
        marginRight: 2
    },
    logIn: {
        color: COLORS.warning,
    }
});
