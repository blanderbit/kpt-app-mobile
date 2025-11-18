import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path, ClipPath, Rect, G } from "react-native-svg";

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
                                              gap = 4,
                                          }) => {
    const total = Math.max(0, valueA) + Math.max(0, valueB);
    
    // Вычисляем пропорции для обрезки
    const proportionA = total > 0 ? valueA / total : 0;
    const proportionB = total > 0 ? valueB / total : 0;
    
    const radius = (size - strokeWidth) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

    const ids = useMemo(() => {
        const uid = Math.random().toString(36).slice(2, 9);
        return {
            gradA: `gradA-${uid}`,
            gradB: `gradB-${uid}`,
            clipA: `clipA-${uid}`,
            clipB: `clipB-${uid}`,
        };
    }, []);

    // Вычисляем ширину обрезки для каждого полукруга с учетом gap
    // Оранжевый: от 0 до size * proportionA - gap/2
    // Фиолетовый: от size - size * proportionB + gap/2 до size
    const clipWidthA = Math.max(0, size * proportionA - gap / 2);
    const clipWidthB = Math.max(0, size * proportionB - gap / 2);
    const clipStartB = size - clipWidthB;

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
                    
                    {/* ClipPath для оранжевого полукруга (обрезаем слева, с отступом справа, скругление справа сверху и снизу) */}
                    <ClipPath id={ids.clipA}>
                        <Path 
                            d={`M 0 0 L ${clipWidthA - strokeWidth / 2} 0 A ${strokeWidth / 2} ${strokeWidth / 2} 0 0 1 ${clipWidthA} ${strokeWidth / 2} L ${clipWidthA} ${size - strokeWidth / 2} A ${strokeWidth / 2} ${strokeWidth / 2} 0 0 0 ${clipWidthA - strokeWidth / 2} ${size} L 0 ${size} Z`}
                        />
                    </ClipPath>
                    
                    {/* ClipPath для фиолетового полукруга (обрезаем справа, с отступом слева, скругление слева сверху и снизу) */}
                    <ClipPath id={ids.clipB}>
                        <Path 
                            d={`M ${clipStartB + strokeWidth / 2} 0 A ${strokeWidth / 2} ${strokeWidth / 2} 0 0 0 ${clipStartB} ${strokeWidth / 2} L ${clipStartB} ${size - strokeWidth / 2} A ${strokeWidth / 2} ${strokeWidth / 2} 0 0 1 ${clipStartB + strokeWidth / 2} ${size} L ${size} ${size} L ${size} 0 Z`}
                        />
                    </ClipPath>
                </Defs>

                {/* Фон */}
                <Path
                    d={arcPath}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                />

                {/* Оранжевый полукруг (полный, обрезан слева) */}
                {proportionA > 0 && (
                    <G clipPath={`url(#${ids.clipA})`}>
                        <Path
                            d={arcPath}
                            stroke={`url(#${ids.gradA})`}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            fill="none"
                        />
                    </G>
                )}

                {/* Фиолетовый полукруг (полный, обрезан справа) */}
                {proportionB > 0 && (
                    <G clipPath={`url(#${ids.clipB})`}>
                        <Path
                            d={arcPath}
                            stroke={`url(#${ids.gradB})`}
                            strokeWidth={strokeWidth}
                            strokeLinecap="round"
                            fill="none"
                        />
                    </G>
                )}
            </Svg>
        </View>
    );
};


export default React.memo(SemiCircleSplit);
