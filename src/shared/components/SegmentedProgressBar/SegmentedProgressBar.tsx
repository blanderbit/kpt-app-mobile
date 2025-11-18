import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useTranslation } from "react-i18next";

interface ProgressBarProps {
    satisfactionLevel?: number;
    hardnessLevel?: number;
}

export const SegmentedProgressBar: React.FC<ProgressBarProps> = ({ 
    satisfactionLevel = 0, 
    hardnessLevel = 0 
}) => {
    const totalCells = 18;
    const cellsPerHalf = 9;
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

    // Вычисляем пропорциональное распределение ячеек
    // Обе полоски вместе должны занимать всю ширину (18 ячеек)
    const total = satisfactionLevel + hardnessLevel;
    
    let satisfactionCells = 0;
    let hardnessCells = 0;
    
    if (total > 0) {
        // Вычисляем пропорции от общей суммы
        const satisfactionProportion = satisfactionLevel / total;
        const hardnessProportion = hardnessLevel / total;
        
        // Распределяем все 18 ячеек пропорционально
        satisfactionCells = Math.round(satisfactionProportion * totalCells);
        hardnessCells = Math.round(hardnessProportion * totalCells);
        
        // Убеждаемся, что сумма равна totalCells (может быть небольшая погрешность из-за округления)
        const sum = satisfactionCells + hardnessCells;
        if (sum !== totalCells) {
            // Корректируем, чтобы сумма была равна totalCells
            const diff = totalCells - sum;
            if (diff > 0) {
                satisfactionCells += diff;
            } else {
                satisfactionCells += diff; // diff отрицательный
            }
        }
    } else {
        // Если оба значения 0, не заполняем ничего
        satisfactionCells = 0;
        hardnessCells = 0;
    }

    return (
        <View style={styles.container}>
            <View style={styles.bar}>
                {/* Градиент через ячейки */}
                {allColors.map((color, index) => {
                    let cellColor = '#F5F5F5'; // По умолчанию серый
                    
                    if (index < satisfactionCells) {
                        // Оранжевая часть (первые satisfactionCells ячеек)
                        // Используем градиент из первой половины, но растягиваем на satisfactionCells ячеек
                        const gradientIndex = Math.floor((index / satisfactionCells) * cellsPerHalf);
                        cellColor = firstHalfColors[Math.min(gradientIndex, cellsPerHalf - 1)];
                    } else if (index < satisfactionCells + hardnessCells) {
                        // Фиолетовая часть (следующие hardnessCells ячеек)
                        // Используем градиент из второй половины
                        const relativeIndex = index - satisfactionCells;
                        const gradientIndex = Math.floor((relativeIndex / hardnessCells) * cellsPerHalf);
                        cellColor = secondHalfColors[Math.min(gradientIndex, cellsPerHalf - 1)];
                    }
                    
                    return (
                        <View
                            key={index}
                            style={[
                                styles.cell,
                                { 
                                    backgroundColor: cellColor,
                                },
                            ]}
                        />
                    );
                })}

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
