import React, {useState, useEffect} from "react";
import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from "react-native";
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {SectionItem} from "@shared/components/SectionItem/SectionItem";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {useOnboardingQuestions} from "@shared/services/api/hooks";
import {OnboardingQuestion} from "@shared/services/api/types";
import {ONBOARDING_KEYS} from "@shared/utils/onboardingStorage";

interface OnboardingQuestionStepProps {
    questionIndex: number;
    onNext: (questionData: OnboardingQuestion, selectedAnswers: string[]) => void;
}

export default function OnboardingQuestionStep({questionIndex, onNext}: OnboardingQuestionStepProps) {
    const {t} = useTranslation();
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

        let newSelectedAnswers: string[];

        if (currentQuestion.inputType === 'single') {
            // Для одиночного выбора заменяем весь массив и сразу переходим
            newSelectedAnswers = [answerId];
        } else {
            // Для множественного выбора добавляем/удаляем
            newSelectedAnswers = selectedAnswers.includes(answerId)
                ? selectedAnswers.filter(id => id !== answerId)
                : [...selectedAnswers, answerId];
        }

        setSelectedAnswers(newSelectedAnswers);
        saveData(newSelectedAnswers);

        // Если это одиночный выбор, сразу переходим дальше
        if (currentQuestion.inputType === 'single') {
            onNext(currentQuestion, newSelectedAnswers);
        }
    };

    return (
        <View style={styles.container}>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.buttons.primary.backgroundColor} />
                </View>
            ) : (
                <ScrollView
                    style={[
                        styles.scrollView,
                        currentQuestion?.inputType === 'single' && styles.scrollViewSingle
                    ]}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={theme.flexBlocks.vertical8}>
                        {currentQuestion?.answers.map((answer) => (
                            <SectionItem
                                key={answer.id}
                                label={answer.text}
                                subtitle={answer.subtitle}
                                icon={<RemoteSvg xml={answer.icon} size={32}/>}
                                extraStyles={[styles.variantItem]}
                                onPress={() => handleAnswerSelect(answer.id)}
                            />
                        ))}
                    </View>
                </ScrollView>
            )}

            {!!selectedAnswers.length && currentQuestion?.inputType === 'multiple' && (
                <View style={styles.formBottom}>
                    <CustomButton
                        title={t('onboarding.buttons.continue')}
                        onPress={() => onNext(currentQuestion, selectedAnswers)}
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
    scrollView: {
        flex: 1,
    },
    scrollViewSingle: {
        marginBottom: 0,
    },
    scrollContent: {
        paddingBottom: 8,
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
    variantItem: {
        borderRadius: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
