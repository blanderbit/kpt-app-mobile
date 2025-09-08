import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeName, useCustomTheme } from "@app/theme/ThemeContext";

const ToggleSwitch = () => {
    const { theme, themeName, setThemeByName } = useCustomTheme();

    const handleSelect = (option: ThemeName) => {
        setThemeByName(option);
    };

    return (
        <View style={[styles.container, theme.flexBlocks.horizontal4]}>
            <TouchableOpacity
                style={[
                    theme.flexBlocks.justifyCenter,
                    theme.flexBlocks.alignCenter,
                    styles.option,
                    themeName === "Green" && styles.activeOption,
                ]}
                onPress={() => handleSelect("Green")}
            >
                <Text style={[styles.text, themeName === "Green" && styles.activeText]}>
                    Green
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    theme.flexBlocks.justifyCenter,
                    theme.flexBlocks.alignCenter,
                    styles.option,
                    themeName === "Pink" && styles.activeOption,
                ]}
                onPress={() => handleSelect("Pink")}
            >
                <Text style={[styles.text, themeName === "Pink" && styles.activeText]}>
                    Pink
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E1E1E2",
        padding: 2,
        borderRadius: 24,
    },
    option: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 24,
    },
    activeOption: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
        color: "#888",
    },
    activeText: {
        color: "#000",
    },
});

export default ToggleSwitch;
