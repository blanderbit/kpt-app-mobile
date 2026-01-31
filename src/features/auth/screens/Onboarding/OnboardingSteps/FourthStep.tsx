import React, {useState, useEffect} from "react";
import {StyleSheet, Text, View, Pressable, Image, ScrollView, Dimensions} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {COLORS} from "@app/theme";
import {ONBOARDING_KEYS} from "@shared/utils/onboardingStorage";

const GAP = 8;
const NUM_COLUMNS = 5;

interface FourthStepProps {
    onNext: (selectedMood: string) => void;
}

export default function FourthStep({onNext}: FourthStepProps) {

    const {theme} = useCustomTheme();

    const [ selectedMoodType, setSelectedMoodType ] = useState<string | null>(null);

    // Загружаем сохраненные данные при монтировании
    useEffect(() => {
        loadSavedData();
    }, []);

    // Сохраняем данные при изменении
    useEffect(() => {
        if (selectedMoodType) {
            saveData(selectedMoodType);
        }
    }, [selectedMoodType]);

    const loadSavedData = async () => {
        try {
            const savedData = await AsyncStorage.getItem(ONBOARDING_KEYS.MOOD);
            if (savedData) {
                setSelectedMoodType(savedData);
            }
        } catch (error) {
        }
    };

    const saveData = async (mood: string) => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEYS.MOOD, mood);
        } catch (error) {
        }
    };

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
                                            flex: 1,
                                            minWidth: 0, // Позволяет flex элементам сжиматься
                                            borderColor: selectedMoodType === moodType.id ? moodType.color : '#F2F1F6',
                                            backgroundColor: selectedMoodType === moodType.id ? `${moodType.color}20` : COLORS.gray_light
                                        }
                                    ]}
                                    onPress={async () => {
                                        // Сохраняем mood сразу при клике
                                        await saveData(moodType.id);
                                        setSelectedMoodType(moodType.id);
                                        onNext(moodType.id);
                                    }}>
                                    <Text style={{fontSize: 32}}>{moodType.emoji}</Text>
                                </Pressable>
                            ))}
                    </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: "row",
        gap: GAP,
        paddingHorizontal: 8,
        width: '100%',
    },
    gridItem: {
        height: 80,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
});
