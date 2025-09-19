import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCustomTheme } from '@app/theme/ThemeContext';
import { ACTIVITY_TYPES } from './const';

interface ActivityLabelProps {
    id: string;
    textStyle?: any;
    containerStyle?: any;
}

export const ActivityLabel = ({ 
    id,
    textStyle,
    containerStyle
}: ActivityLabelProps) => {
    const { theme } = useCustomTheme();

    const activityConfig = ACTIVITY_TYPES[id];

    if (!activityConfig) {
        console.warn(`ActivityLabel: Type with id "${id}" not found`);
        return (
            <View style={[
                styles.activityLabel,
                { backgroundColor: '#f0f0f0' },
                containerStyle
            ]}>
                <Text style={[theme.fonts.label, { color: '#999' }]}>
                    Unknown: {id}
                </Text>
            </View>
        );
    }

    const { icon, name, color } = activityConfig;
    const backgroundColor = `${color}4D`;

    return (
        <View style={[
            styles.activityLabel,
            { backgroundColor },
            containerStyle
        ]}>
            <Text style={styles.iconEmoji}>{icon}</Text>
            <Text style={[
                theme.fonts.label,
                { color },
                textStyle
            ]}>
                {name}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    activityLabel: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 24,
        flexDirection: 'row',
        gap: 4,
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    iconEmoji: {
        fontSize: 16,
        lineHeight: 16
    }
});
