import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';

export default function StepperLine({step, totalSteps = 17}: { step: number; totalSteps?: number }) {
    const [lineWidth, setLineWidth] = useState(0);
    const animatedWidth = useRef(new Animated.Value(0)).current;

    // Вычисляем целевую ширину белой линии пропорционально
    const targetWidth = lineWidth > 0 ? (lineWidth / totalSteps) * step : 0;

    useEffect(() => {
        if (lineWidth > 0) {
            Animated.timing(animatedWidth, {
                toValue: targetWidth,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    }, [step, lineWidth, targetWidth, animatedWidth]);

    return (
        <View style={styles.stepperContainer}>
            <View
                style={styles.stepperLine}
                onLayout={(event) => {
                    const {width} = event.nativeEvent.layout;
                    setLineWidth(width);
                }}>
            </View>
            <Animated.View
                style={[
                    styles.stepperLineFilled,
                    {width: animatedWidth}
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

