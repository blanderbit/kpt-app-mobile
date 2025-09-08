import React from "react";
import { useTranslation } from "react-i18next";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@app/theme";

export const SectionItem = ({
                          icon, label, rightElement, extraStyles = [], extraLabelStyles = [], onPress = () => {
    }
                      }: {
    icon?: React.ReactNode,
    label: string,
    rightElement: React.ReactNode,
    extraStyles: Record<string, any>[],
    extraLabelStyles?: Record<string, any>[],
    onPress?: () => void,
}) => {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    return (
        <Pressable style={ [ styles.sectionItem, theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter, ...extraStyles ] }
                   onPress={onPress}>
            <View
                style={ [
                    theme.flexBlocks.horizontal8,
                    theme.flexBlocks.alignCenter,
                    { padding: 16 },
                ] }
            >
                { icon }
                <Text style={ [ theme.fonts.labelSecond, ...extraLabelStyles ] }>{ t(label) }</Text>
            </View>

            <View
                style={ [
                    theme.flexBlocks.alignCenter,
                    { paddingVertical: 8, paddingHorizontal: 16 },
                ] }
            >
                { rightElement }
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    sectionItem: {
        backgroundColor: COLORS.gray_light,
    },
});
