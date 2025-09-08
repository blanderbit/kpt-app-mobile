import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    PanResponder,
    Animated,
    Dimensions,
} from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { useCustomTheme } from "@app/theme/ThemeContext";
import HandPointIcon from "@assets/icons/HandPointIcon";

const { width } = Dimensions.get("window");
const SLIDER_WIDTH = width * 0.9;
const SLIDER_HEIGHT = 120;

type SliderProps = {
    label: string;
    startLabel: string;
    endLabel: string;
    initialValue: number;
    onChange?: (value: number) => void;
    colors: Array<string>;
};

const Slider: React.FC<SliderProps> = ({
                                           label,
                                           startLabel,
                                           endLabel,
                                           initialValue,
                                           onChange,
                                           colors
                                       }) => {
    const { theme, themeName } = useCustomTheme();

    const rendered = useRef(false);
    let value = 100;

    const [ percent, setPercent ] = useState(100);
    const translateX = useRef(
        new Animated.Value((SLIDER_WIDTH * value) / 100)
    ).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                let newX = Math.min(
                    SLIDER_WIDTH,
                    Math.max(0, gesture.moveX - (width - SLIDER_WIDTH) / 2)
                );
                translateX.setValue(newX);
                const newPercent = Math.round((newX / SLIDER_WIDTH) * 100);
                setPercent(newPercent);
                onChange && onChange(newPercent);
            },
        })
    ).current;

    useEffect(() => {
        setTimeout(() => {
            value = initialValue;
            setPercent(initialValue)
            translateX.setValue((SLIDER_WIDTH * initialValue) / 100);
            rendered.current = true;
        }, 100)
    }, [])

    const handAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if ( percent === 0 ) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(handAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(handAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            handAnim.stopAnimation();
            handAnim.setValue(0);
        }
    }, [ percent ]);

    return (
        <View style={ theme.flexBlocks.vertical8 }>
            <Text style={ { ...theme.fonts.subtitle, textAlign: 'left' } }>{ label }</Text>

            <View style={ [ styles.sliderContainer, rendered.current && { opacity: 1 } ] }>
                <View style={ styles.percentWrapper }>
                    { percent === 0 &&
                        <Animated.View
                            style={ [
                                styles.icon,
                                {
                                    transform: [
                                        {
                                            translateX: handAnim.interpolate({
                                                inputRange: [ 0, 1 ],
                                                outputRange: [ 0, 20 ], // амплитуда движения вправо
                                            }),
                                        },
                                    ],
                                },
                            ] }
                        >
                            <HandPointIcon/>
                        </Animated.View>
                    }

                    <Text style={ [ theme.fonts.title, { color: "#000" } ] }>{ percent }%</Text>
                </View>

                <Animated.View style={ [ styles.fillWrapper, { width: translateX } ] }>
                    <Svg width="100%" height="100%">
                        <Defs>
                            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                                <Stop offset="0" stopColor={ colors[0] } stopOpacity="1"/>
                                <Stop offset="1" stopColor={ colors[1] } stopOpacity="1"/>
                            </LinearGradient>
                        </Defs>
                        <Rect
                            x="0"
                            y="0"
                            width="100%"
                            height="100%"
                            fill="url(#grad)"
                            rx={ 25 }
                            ry={ 25 }
                        />
                    </Svg>

                    <View style={ [
                        styles.percentWrapperInsideFill,
                        {
                            top: themeName === 'Pink' ? 38 : 48,
                            left: themeName === 'Pink' ? SLIDER_WIDTH / 2.5 - 2 : SLIDER_WIDTH / 2.25,
                        }
                    ] }>
                        <Text style={ [ theme.fonts.title, { color: "#fff" } ] }>{ percent }%</Text>
                    </View>
                </Animated.View>

                <View style={ styles.labels }>
                    <Text style={ styles.label }>{ startLabel }</Text>
                    <Text style={ styles.label }>{ endLabel }</Text>
                </View>

                <View style={ StyleSheet.absoluteFill } { ...panResponder.panHandlers } />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sliderContainer: {
        width: SLIDER_WIDTH,
        height: SLIDER_HEIGHT,
        borderRadius: 25,
        overflow: "hidden",
        position: 'relative',
        opacity: 0
    },
    fillWrapper: {
        height: "100%",
        borderRadius: 24,
        overflow: "hidden",
    },
    percentWrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        flex: 1
    },
    icon: {
        position: "absolute",
        top: 20,
        right: '20%'
    },
    percentWrapperInsideFill: {
        position: "absolute",
        zIndex: 2,
    },
    labels: {
        position: "absolute",
        bottom: 15,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    label: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: .6
    }
});

export default Slider;
