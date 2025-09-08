import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { CloseIcon } from "@assets/icons/CloseIcon";

export const InfoPopup = ({ title, desc, onClose }: { title: string, desc: string, onClose?: () => void }) => {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    return (
        <View style={ [ styles.container, theme.flexBlocks.vertical4 ] }>
            <View style={ [ theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter ] }>
                <Text style={ [ theme.fonts.subheader ] }>{ t(title) }</Text>

                <Pressable onPress={onClose}>
                    <CloseIcon color="#000"/>
                </Pressable>
            </View>

            <Text style={ [ theme.fonts.regular, { opacity: .6, fontWeight: 400 } ] }>{ desc }</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 24,
        padding: 16,
    }
});
