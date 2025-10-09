import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { useCustomTheme } from "@app/theme/ThemeContext";

export interface ToggleSwitchOption {
    label: string;
    value: string;
}

export interface ToggleSwitchProps {
    options: ToggleSwitchOption[];
    value: string;
    onChange: (value: string) => void;
    containerStyle?: ViewStyle;
    optionStyle?: ViewStyle;
    activeOptionStyle?: ViewStyle;
    textStyle?: TextStyle;
    activeTextStyle?: TextStyle;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    options,
    value,
    onChange,
    containerStyle,
    optionStyle,
    activeOptionStyle,
    textStyle,
    activeTextStyle,
}) => {
    const { theme } = useCustomTheme();

    return (
        <View style={[styles.container, theme.flexBlocks.horizontal4, containerStyle]}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                        theme.flexBlocks.justifyCenter,
                        theme.flexBlocks.alignCenter,
                        styles.option,
                        optionStyle,
                        value === option.value && [styles.activeOption, activeOptionStyle],
                    ]}
                    onPress={() => onChange(option.value)}
                >
                    <Text
                        style={[
                            styles.text,
                            textStyle,
                            value === option.value && [styles.activeText, activeTextStyle],
                        ]}
                    >
                        {option.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#E1E1E2",
        padding: 2,
        borderRadius: 24,
        alignSelf: 'flex-start',
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
