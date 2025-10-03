import React from "react";
import { useTranslation } from "react-i18next";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS } from "@app/theme";

interface SectionItemProps {
    icon?: React.ReactNode,
    label: string,
    rightElement?: React.ReactNode,
    extraStyles: Record<string, any>[],
    extraLabelStyles?: Record<string, any>[],
    onPress?: () => void
}

export const SectionItem = ({icon, label, rightElement, extraStyles = [], extraLabelStyles = [], onPress = () => {}}: SectionItemProps) => {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    return (
        <Pressable style={ [ styles.sectionItem, theme.flexBlocks.justifySpaceBetween, rightElement ? theme.flexBlocks.alignCenter : {}, ...extraStyles ] }
                   onPress={onPress}>
            <View
                style={ [
                    theme.flexBlocks.horizontal8,
                    { padding: 16, flex: 1 },
                ] }
            >
                { icon }
                <View style={styles.textContainer}>
                    <Text style={ [ theme.fonts.labelSecond, ...extraLabelStyles ] }>{ t(label) }</Text>
                </View>
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
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    subtitle: {
        marginTop: 4,
        opacity: 0.6,
    },
});
