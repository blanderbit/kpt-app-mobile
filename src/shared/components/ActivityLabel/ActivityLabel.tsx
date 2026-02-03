import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from '@app/theme/ThemeContext';
import { ACTIVITY_TYPES } from './const';

interface ActivityLabelProps {
    id: string;
    /** Готовый текст лейбла (например с бэкенда) — если передан, показывается вместо перевода по id */
    label?: string;
    textStyle?: any;
    containerStyle?: any;
}

export const ActivityLabel = ({
    id,
    label: labelOverride,
    textStyle,
    containerStyle
}: ActivityLabelProps) => {
    const { theme } = useCustomTheme();
    const { t } = useTranslation();

    const activityConfig = ACTIVITY_TYPES[id];

    if (!activityConfig) {
        return (
            <View style={[
                styles.activityLabel,
                { backgroundColor: '#f0f0f0' },
                containerStyle
            ]}>
                <Text style={[theme.fonts.label, { color: '#999' }]}>
                    Unknown: {id || 'undefined'}
                </Text>
            </View>
        );
    }

    const { icon, name, color } = activityConfig;
    const backgroundColor = `${color}4D`;

    // Готовый лейбл с бэкенда или переведённый текст (бэкенд может отдавать name как ключ перевода)
    const labelByKey = t(`activity_types.${id}.name`);
    const labelFromName = name && name.includes('.') ? t(name) : name;
    const displayName =
        labelOverride != null && labelOverride !== ''
            ? labelOverride
            : labelByKey !== `activity_types.${id}.name`
              ? labelByKey
              : labelFromName !== name
                ? labelFromName
                : name;

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
                {displayName}
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
        fontSize: 14,
        lineHeight: 16
    }
});
