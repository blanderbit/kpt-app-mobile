import React, {useState, useEffect} from "react";
import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {SectionItem} from "@shared/components/SectionItem/SectionItem";
import {BlackCheckmarkIcon} from "@assets/icons/BlackCheckmarkIcon";
import {GrayCircleIcon} from "@assets/icons/GrayCircleIcon";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {useOnboardingQuestions} from "@shared/services/api/hooks";
import {OnboardingQuestion} from "@shared/services/api/types";
import {ONBOARDING_KEYS} from "@shared/utils/onboardingStorage";

interface OnboardingQuestionStepProps {
    questionIndex: number;
    onNext: (questionData: OnboardingQuestion, selectedAnswers: string[]) => void;
}

export default function OnboardingQuestionStep({questionIndex, onNext}: OnboardingQuestionStepProps) {

    const {theme} = useCustomTheme();
    const {data: questions, isLoading} = useOnboardingQuestions();

    const [ selectedAnswers, setSelectedAnswers ] = useState<string[]>([]);

    // Берем вопрос по индексу
    const currentQuestion = questions?.[questionIndex];

    // Загружаем сохраненные данные при монтировании
    useEffect(() => {
        if (currentQuestion) {
            loadSavedData();
        }
    }, [currentQuestion]);

    // Сохраняем данные при изменении
    useEffect(() => {
        if (selectedAnswers.length > 0 && currentQuestion) {
            saveData(selectedAnswers);
        }
    }, [selectedAnswers, currentQuestion]);

    const loadSavedData = async () => {
        if (!currentQuestion) return;
        
        try {
            const savedData = await AsyncStorage.getItem(ONBOARDING_KEYS.QUESTIONS);
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                const questionAnswers = parsedData[currentQuestion.stepName];
                if (questionAnswers) {
                    setSelectedAnswers(questionAnswers);
                }
            }
        } catch (error) {
            console.error('Error loading saved question answers:', error);
        }
    };

    const saveData = async (answers: string[]) => {
        if (!currentQuestion) return;
        
        try {
            const savedData = await AsyncStorage.getItem(ONBOARDING_KEYS.QUESTIONS);
            const parsedData = savedData ? JSON.parse(savedData) : {};
            parsedData[currentQuestion.stepName] = answers;
            await AsyncStorage.setItem(ONBOARDING_KEYS.QUESTIONS, JSON.stringify(parsedData));
        } catch (error) {
            console.error('Error saving question answers:', error);
        }
    };

    const handleAnswerSelect = (answerId: string) => {
        if (!currentQuestion) return;

        if (currentQuestion.inputType === 'single') {
            // Для одиночного выбора заменяем весь массив
            setSelectedAnswers([answerId]);
        } else {
            // Для множественного выбора добавляем/удаляем
            setSelectedAnswers(prev => {
                if (prev.includes(answerId)) {
                    return prev.filter(id => id !== answerId);
                } else {
                    return [...prev, answerId];
                }
            });
        }
    };

    const handleContinue = () => {
        if (currentQuestion && selectedAnswers.length > 0) {
            onNext(currentQuestion, selectedAnswers);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formTop}>
                <View style={styles.head}>
                    <Text style={[styles.title, {...theme.fonts.title}]}>
                        {currentQuestion?.stepQuestion || 'Loading...'}
                    </Text>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.buttons.primary.backgroundColor} />
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={theme.flexBlocks.vertical8}>
                        {currentQuestion?.answers.map((answer) => (
                            <SectionItem
                                key={answer.id}
                                label={answer.text}
                                subtitle={answer.subtitle}
                                icon={<RemoteSvg xml={answer.icon}/>}
                                rightElement={
                                    selectedAnswers.includes(answer.id)
                                        ? <BlackCheckmarkIcon color={theme.buttons.primary.backgroundColor}/>
                                        : <GrayCircleIcon/>
                                }
                                extraStyles={[styles.variantItem]}
                                onPress={() => handleAnswerSelect(answer.id)}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}

            {!!selectedAnswers.length && (
                <View style={styles.formBottom}>
                    <CustomButton
                        title={'Continue'}
                        onPress={handleContinue}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    formTop: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        paddingTop: 10,
        marginBottom: 8,
    },
    scrollView: {
        flex: 1,
        marginBottom: 50,
    },
    scrollContent: {
        paddingVertical: 8,
    },
    formBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        flexDirection: 'column',
        gap: 10,
        paddingTop: 10,
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
    variantItem: {
        borderRadius: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
