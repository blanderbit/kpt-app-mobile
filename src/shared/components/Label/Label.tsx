import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useCustomTheme } from "@app/theme/ThemeContext";

export enum LabelType {
    DANGER = "DANGER",
}

export const Label = ({ title, status }: { title: string, status: LabelType }) => {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    const colorsByTheme = {
        [LabelType.DANGER]: {
            backgroundColor: '#F524241A',
            color: '#F52424'
        }
    }

    return (
        <View style={ [ styles.label, colorsByTheme[status] ] }>
            <Text style={ [ theme.fonts.label, { color: colorsByTheme[status].color } ] }>{ t(title) }</Text>
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
