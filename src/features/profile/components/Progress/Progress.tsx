import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useCustomTheme } from "@app/theme/ThemeContext";
import { LinearGradient } from 'expo-linear-gradient';

type SemiCircleProgressProps = {
    leftPercent: number;
    rightPercent: number;
};

const Progress: React.FC<SemiCircleProgressProps> = ({ leftPercent, rightPercent }) => {
    const { theme } = useCustomTheme();

    return (
        <View style={theme.flexBlocks.horizontal8}>
            <View style={styles.container}>
                <View style={[styles.circle, styles.leftCircle]}>
                    <LinearGradient
                        colors={['#DD583D', '#FFC372']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            styles.filledCircle,
                            styles.leftCircle,
                            styles.leftFilledCircle,
                            {
                                width: `${leftPercent}%`,
                                height: `${leftPercent}%`,
                                top: `${(100 - leftPercent) / 2}%`,
                            },
                        ]}
                    />
                </View>
            </View>

            <View style={styles.container}>
                <View style={[styles.circle, styles.rightCircle]}>
                    <LinearGradient
                        colors={['#CA21D0', '#810085']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            styles.filledCircle,
                            styles.rightCircle,
                            styles.rightFilledCircle,
                            {
                                width: `${rightPercent}%`,
                                height: `${rightPercent}%`,
                                top: `${(100 - rightPercent) / 2}%`,
                            },
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 95,
        height: 180,
        justifyContent: 'center',
        alignItems: 'flex-start',
        overflow: 'hidden',
    },
    circle: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E0E0E0',
        overflow: 'hidden',
    },
    filledCircle: {
        height: '100%',
        position: 'absolute',
    },
    leftFilledCircle: {
        right: 0,
    },
    rightFilledCircle: {
        left: 0,
    },
    leftCircle: {
        borderTopLeftRadius: 150,
        borderTopRightRadius: 16,
        borderBottomLeftRadius: 150,
        borderBottomRightRadius: 16,
    },
    rightCircle: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 150,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 150,
    },
});

export default Progress;
