import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useTranslation } from "react-i18next";

interface ProgressBarProps {}

export const SegmentedProgressBar: React.FC<ProgressBarProps> = () => {
    const totalCells = 18;
    const { t } = useTranslation();

    const interpolateColor = (start: number[], end: number[], factor: number) =>
        start.map((s, i) => Math.round(s + (end[i] - s) * factor));

    const rgbToHex = (rgb: number[]) =>
        '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');

    const firstHalfStart = [221, 88, 61]; // #DD583D
    const firstHalfEnd = [255, 195, 114]; // #FFC372
    const secondHalfStart = [202, 33, 208]; // #CA21D0
    const secondHalfEnd = [129, 0, 133];    // #810085

    const firstHalfColors = Array.from({ length: 9 }, (_, i) =>
        rgbToHex(interpolateColor(firstHalfStart, firstHalfEnd, i / 8))
    );
    const secondHalfColors = Array.from({ length: 9 }, (_, i) =>
        rgbToHex(interpolateColor(secondHalfStart, secondHalfEnd, i / 8))
    );

    const allColors = [...firstHalfColors, ...secondHalfColors];

    const screenWidth = Dimensions.get('window').width - 30 * 2;
    const separatorWidth = 2;

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                {/* Градиент через ячейки */}
                {allColors.map((color, index) => (
                    <View
                        key={index}
                        style={[
                            styles.cell,
                            { backgroundColor: color },
                        ]}
                    />
                ))}

                {/* Сепараторы поверх */}
                {Array.from({ length: totalCells - 1 }).map((_, index) => {
                    const left = ((screenWidth) / totalCells) * (index + 1) - separatorWidth / 2;
                    return (
                        <View
                            key={index}
                            style={[
                                styles.separator,
                                { left }
                            ]}
                        />
                    );
                })}
            </View>

            <View style={styles.labels}>
                <Text style={styles.label}>{t('main.today.weekTotal.satisfaction')}</Text>
                <Text style={styles.label}>{t('main.today.weekTotal.achieveness')}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'column',
    },
    bar: {
        flexDirection: 'row',
        height: 12,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    cell: {
        flex: 1,
    },
    separator: {
        position: 'absolute',
        width: 2,
        backgroundColor: '#ccc',
        height: '50%',
        top: 3,
        bottom: 0,
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    label: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: .6
    },
});
