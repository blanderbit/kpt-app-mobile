import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useCustomTheme } from "@app/theme/ThemeContext";

export enum LabelType {
    DANGER = "DANGER",
    SUCCESS = "SUCCESS",
    DEFAULT = "DEFAULT",
}

type LabelProps = {
    status: LabelType;
    title?: string;
    /** Raw text (e.g. from API). When set, used instead of t(title). */
    text?: string;
};

export const Label = ({ title, text, status }: LabelProps) => {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    const colorsByTheme: Record<LabelType, { backgroundColor: string; color: string }> = {
        [LabelType.DANGER]: { backgroundColor: '#F524241A', color: '#F52424' },
        [LabelType.SUCCESS]: { backgroundColor: '#22C55E1A', color: '#22C55E' },
        [LabelType.DEFAULT]: { backgroundColor: '#6B72801A', color: '#6B7280' },
    };

    const content = text != null ? text : (title ? t(title) : '');

    return (
        <View style={[styles.label, colorsByTheme[status]]}>
            <Text style={[theme.fonts.label, { color: colorsByTheme[status].color }]}>{content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    label: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 24,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 4,
    }
});
