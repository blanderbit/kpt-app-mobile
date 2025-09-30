import React, {useState} from "react";
import {StyleSheet, Text, View, Pressable, Image, ScrollView, Dimensions} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {COLORS} from "@app/theme";

const { width: screenWidth } = Dimensions.get('window');
const GAP = 8;
const NUM_COLUMNS = 5;
const ITEM_WIDTH = (screenWidth - 60 - (GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

export default function FourthStep({onNext}: { onNext: () => void }) {

    const {theme} = useCustomTheme();

    const [ selectedMoodType, setSelectedMoodType ] = useState<string | null>(null);

    const moodTypes = [
        {
            "id": "excellent",
            "name": "Отлично",
            "description": "Превосходное настроение, полный восторг",
            "emoji": "😍",
            "color": "#4CAF50",
            "score": 10,
            "category": "positive"
        },
        {
            "id": "great",
            "name": "Отлично",
            "description": "Очень хорошее настроение",
            "emoji": "😊",
            "color": "#8BC34A",
            "score": 9,
            "category": "positive"
        },
        {
            "id": "good",
            "name": "Хорошо",
            "description": "Хорошее настроение",
            "emoji": "🙂",
            "color": "#CDDC39",
            "score": 8,
            "category": "positive"
        },
        {
            "id": "fine",
            "name": "Нормально",
            "description": "Нормальное, спокойное настроение",
            "emoji": "😐",
            "color": "#FFEB3B",
            "score": 7,
            "category": "neutral"
        },
        {
            "id": "okay",
            "name": "Так себе",
            "description": "Нейтральное настроение",
            "emoji": "😕",
            "color": "#FFC107",
            "score": 6,
            "category": "neutral"
        }
        ]

    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
            <View style={styles.formTop}>
                <View style={styles.head}>
                    <Text style={[styles.title, {...theme.fonts.title}]}>
                        How does your day feel so far?
                    </Text>
                    <Text style={[styles.info, {...theme.fonts.regular}]}>
                        Pick your emotion
                    </Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={ false }>
                    <View style={ styles.gridContainer }>
                        { moodTypes
                            .sort((a, b) => b.score - a.score)
                            .map((moodType) => (
                                <Pressable
                                    key={ moodType.id }
                                    style={ [
                                        styles.gridItem,
                                        {
                                            width: ITEM_WIDTH,
                                            borderColor: selectedMoodType === moodType.id ? moodType.color : '#F2F1F6',
                                            backgroundColor: selectedMoodType === moodType.id ? `${moodType.color}20` : COLORS.gray_light
                                        }
                                    ]}
                                    onPress={() => setSelectedMoodType(moodType.id)}
                                >
                                    <Text style={{fontSize: 32}}>{moodType.emoji}</Text>
                                </Pressable>
                            ))}
                    </View>
            </ScrollView>

            <View style={styles.formBottom}>
                {selectedMoodType &&
                    <CustomButton
                        title={'Continue'}
                        onPress={onNext}
                    />
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formTop: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        paddingTop: 10
    },
    formBottom: {
        width: '100%',
        flexDirection: 'column',
        gap: 10
    },
    head: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        marginBottom: 10,
    },
    title: {
        textAlign: 'center',
    },
    info: {
        opacity: 0.6,
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        paddingHorizontal: 8
    },
    gridItem: {
        marginBottom: 8,
        height: 80,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
});
