import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EyeIcon } from '@assets/icons/EyeIcon';
import { EyeClosedIcon } from '@assets/icons/EyeClosedIcon';
import { COLORS } from '@app/theme'
interface InputProps {
    label?: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
    showPasswordToggle?: boolean;
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                placeholder,
                                                value,
                                                onChangeText,
                                                error,
                                                secureTextEntry,
                                                showPasswordToggle,
                                            }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePassword = () => setIsPasswordVisible(prev => !prev);

    return (
        <View style={[styles.container]}>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
                {label && <Text style={styles.label}>{label}</Text>}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={placeholder}
                        secureTextEntry={secureTextEntry && !isPasswordVisible}
                        placeholderTextColor="#999"
                    />
                    {showPasswordToggle && (
                        <TouchableOpacity onPress={togglePassword} style={styles.icon}>
                            {isPasswordVisible ? <EyeClosedIcon /> : <EyeIcon />}
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    inputWrapper: {
        flexDirection: 'column',
        backgroundColor: COLORS.gray_light,
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 16,
        gap: 4
    },
    label: {
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 20,
        color: '#000',
        opacity: 0.4
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000'
    },
    inputError: {
        borderColor: '#ff4d4f'
    },
    icon: {
    },
    errorText: {
        paddingLeft: 14,
        color: '#ff4d4f',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: 600,
        marginTop: 4
    }
});
