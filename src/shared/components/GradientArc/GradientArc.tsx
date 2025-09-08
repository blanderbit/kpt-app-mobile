import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path } from "react-native-svg";
import { calculateSemiCircleProportions } from "@shared/utils/calculateCemiCircle";

type Props = {
    valueA: number;
    valueB: number;
    size?: number;
    strokeWidth?: number;
    colorsA?: [string, string];
    colorsB?: [string, string];
    backgroundColor?: string;
    gap?: number;
};

const SemiCircleSplit: React.FC<Props> = ({
                                              valueA,
                                              valueB,
                                              size = 40,
                                              strokeWidth = 8,
                                              colorsA = ["#F08356", "#E38A5A"],
                                              colorsB = ["#7E1EA9", "#6B1A9F"],
                                              backgroundColor = "#F1F1F1",
                                              gap = 6,
                                          }) => {
    const config = calculateSemiCircleProportions({ valueA, valueB });
    valueA = Math.round(config.proportionA * 100);
    valueB = Math.round(config.proportionB * 100) - 1;

    const total = Math.max(0, valueA) + Math.max(0, valueB);
    const radius = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
    const semicircumference = Math.PI * radius;

    const lenAraw = total === 0 ? 0 : (semicircumference * Math.max(0, valueA)) / total;
    const lenBraw = semicircumference - lenAraw;
    const lenA = Math.max(0, lenAraw - gap / 2);
    const lenB = Math.max(0, lenBraw - gap / 2);

    const ids = useMemo(() => {
        const uid = Math.random().toString(36).slice(2, 9);
        return {
            gradA: `gradA-${uid}`,
            gradB: `gradB-${uid}`,
        };
    }, []);

    // если нет хоть одной из дуг
    const showSingleGrey = valueA <= 0 || valueB <= 0;

    return (
        <View style={{ width: size, height: size - 10, overflow: "hidden" }}>
            <Svg width={size} height={size - 10}>
                <Defs>
                    <SvgLinearGradient id={ids.gradA} x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor={colorsA[0]} stopOpacity="1" />
                        <Stop offset="1" stopColor={colorsA[1]} stopOpacity="1" />
                    </SvgLinearGradient>
                    <SvgLinearGradient id={ids.gradB} x1="0" y1="0" x2="1" y2="0">
                        <Stop offset="0" stopColor={colorsB[0]} stopOpacity="1" />
                        <Stop offset="1" stopColor={colorsB[1]} stopOpacity="1" />
                    </SvgLinearGradient>
                </Defs>

                {/* фон */}
                <Path
                    d={arcPath}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                />

                {showSingleGrey ? (
                    // одна серая дуга
                    <Path
                        d={arcPath}
                        stroke="#D6D8DD"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="none"
                    />
                ) : (
                    <>
                        {lenA > 0 && (
                            <Path
                                d={arcPath}
                                stroke={`url(#${ids.gradA})`}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={`${lenA} ${semicircumference - lenA}`}
                                strokeDashoffset={gap / 2}
                                fill="none"
                            />
                        )}
                        {lenB > 0 && (
                            <Path
                                d={arcPath}
                                stroke={`url(#${ids.gradB})`}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={`${lenB} ${semicircumference - lenB}`}
                                strokeDashoffset={-(lenAraw + gap / 2)}
                                fill="none"
                            />
                        )}
                    </>
                )}
            </Svg>
        </View>
    );
};


export default React.memo(SemiCircleSplit);
