import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, View } from 'react-native';
import { COLORS } from "@app/theme";
import { useCustomTheme } from "@app/theme/ThemeContext";

type ButtonTheme = 'primary' | 'primary_disabled' | 'secondary' | 'danger' | 'white';

interface ButtonProps {
    title?: string;
    onPress: () => void;
    disabled?: boolean;
    themeName?: ButtonTheme;
    buttonStyle?: ViewStyle;
    contentStyle?: ViewStyle;
    textStyle?: TextStyle;
    children?: React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({
                                                 title,
                                                 onPress,
                                                 disabled = false,
                                                 themeName = 'primary',
                                                 buttonStyle,
                                                 contentStyle,
                                                 textStyle,
                                                 children,
                                             }) => {
    const { theme } = useCustomTheme();

    const buttonThemes: Record<ButtonTheme, { backgroundColor: any; textColor: any, borderColor?: string, borderWidth?: number }> = {
        // primary: { backgroundColor: COLORS.primary, textColor: '#fff' },
        primary: { ...theme.buttons.primary},
        primary_disabled: { backgroundColor: COLORS.gray_light, textColor: COLORS.gray_dark },
        secondary: { backgroundColor: '#fff', textColor: '#007AFF' },
        danger: { backgroundColor: '#FF3B30', textColor: '#fff' },
        white: { ...theme.buttons.appleSignBtn },
    };

    const { textColor, ...themeConfig } = buttonThemes[themeName];

    return (
        <TouchableOpacity
            style={ [
                styles.button,
                { ...themeConfig },
                buttonStyle,
            ] }
            onPress={ onPress }
            disabled={ disabled }
            activeOpacity={ 0.7 }
        >
            <View style={[
                styles.content,
                contentStyle
            ]}>
                {children}
                {title && (
                    <Text
                        style={[
                            styles.text,
                            { color: disabled ? '#888' : textColor },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create( {
    button: {
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 52
    },
    text: {
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '600',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
} );

export default CustomButton;
