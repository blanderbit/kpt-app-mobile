import React, {useState} from "react";
import {StyleSheet, Text, View, Image, SafeAreaView, Pressable} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import SatisfactionSlider from "@shared/components/Slider/Slider";
import {useTranslation} from "react-i18next";
import {CloseIcon} from "@assets/icons/CloseIcon";

export default function StartTrialScreen({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={[styles.description, {...theme.fonts.regular}]}>
                    Start your 7-day free trial and get unlimited access to all features.
                </Text>
                
                <View style={styles.featureList}>
                    <Text style={[styles.feature, {...theme.fonts.regular}]}>✓ Track your mood daily</Text>
                    <Text style={[styles.feature, {...theme.fonts.regular}]}>✓ Access personalized insights</Text>
                    <Text style={[styles.feature, {...theme.fonts.regular}]}>✓ Unlock premium activities</Text>
                    <Text style={[styles.feature, {...theme.fonts.regular}]}>✓ Get expert recommendations</Text>
                </View>
            </View>
            
            <View style={theme.flexBlocks.vertical8}>
                <CustomButton title="Start Free Trial" onPress={onNext} variant="primary" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    description: {
        textAlign: 'center',
        marginBottom: 32,
        fontSize: 16,
        lineHeight: 24,
    },
    featureList: {
        gap: 16,
    },
    feature: {
        fontSize: 16,
        lineHeight: 24,
    },
});
