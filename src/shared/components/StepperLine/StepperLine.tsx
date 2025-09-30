import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

export default function StepperLine({step}: { step: number }) {
    const [lineWidth, setLineWidth] = useState(0);

    // Вычисляем ширину белой линии пропорционально
    const filledWidth = lineWidth > 0 ? (lineWidth / 17) * step : 0;

    return (
        <View style={styles.stepperContainer}>
            <View
                style={styles.stepperLine}
                onLayout={(event) => {
                    const {width} = event.nativeEvent.layout;
                    setLineWidth(width);
                }}>
            </View>
            <View
                style={[
                    styles.stepperLineFilled,
                    {width: filledWidth}
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    stepperContainer: {
        width: '100%',
        paddingRight: 80,
        position: 'relative',
    },
    stepperLine: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: 6,
        borderRadius: 64,
        backgroundColor: '#000',
        opacity: .2,
        paddingRight: 200
    },
    stepperLineFilled: {
        backgroundColor: '#fff',
        position: 'absolute',
        left: 0,
        top: 0,
        height: 6,
        borderRadius: 64,
    }
});

