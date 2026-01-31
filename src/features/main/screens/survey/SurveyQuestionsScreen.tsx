import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from "@app/theme/ThemeContext";
import { ArrowIcon } from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import { SurveyQuestionsScreenNavigationProp, SurveyQuestionsScreenRouteProp } from "@app/navigation/AppNavigator";
import { SectionItem } from "@shared/components/SectionItem/SectionItem";
import CustomButton from "@shared/components/Button/Button";
import { SurveyQuestion, SurveyResponse, SubmitSurveyAnswerRequest } from '@shared/services/api/types';
import { BlackCheckmarkIcon } from '@assets/icons/BlackCheckmarkIcon';
import { GrayCircleIcon } from '@assets/icons/GrayCircleIcon';
import { surveyService } from '@shared/services/api/client';
import { Routes } from '@app/navigation/const';
import { amplitudeAnalyticsService } from '@shared/services/analytics';

export default function SurveyQuestionsScreen({ navigation, route }: { navigation: SurveyQuestionsScreenNavigationProp, route: SurveyQuestionsScreenRouteProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    const { survey } = route.params;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const questions = survey.questions || [];
    const currentQuestion: SurveyQuestion | undefined = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    const onBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            navigation.goBack();
        }
    };

    const handleAnswerSelect = (optionId: string) => {
        if (!currentQuestion) return;

        const questionId = currentQuestion.id;
        let newSelectedAnswers: string[];

        if (currentQuestion.type === 'single') {
            // Для одиночного выбора заменяем весь массив
            newSelectedAnswers = [optionId];
            setSelectedAnswers(prev => ({
                ...prev,
                [questionId]: newSelectedAnswers
            }));

            // Если это не последний вопрос, сразу переходим дальше
            if (!isLastQuestion) {
                setTimeout(() => {
                    setCurrentQuestionIndex(prev => prev + 1);
                }, 300);
            }
            // Если это последний вопрос, кнопка Finish появится автоматически
        } else {
            // Для множественного выбора добавляем/удаляем
            const currentAnswers = selectedAnswers[questionId] || [];
            newSelectedAnswers = currentAnswers.includes(optionId)
                ? currentAnswers.filter(id => id !== optionId)
                : [...currentAnswers, optionId];
            
            setSelectedAnswers(prev => ({
                ...prev,
                [questionId]: newSelectedAnswers
            }));
        }
    };

    const prepareAnswersPayload = (): SubmitSurveyAnswerRequest => {
        const answers = questions.map((question) => {
            const questionAnswers = selectedAnswers[question.id] || [];
            
            // Если это single или multiple - возвращаем массив или строку в зависимости от количества
            if (question.type === 'single') {
                return {
                    questionId: question.id,
                    answer: questionAnswers[0] || ''
                };
            } else if (question.type === 'multiple') {
                return {
                    questionId: question.id,
                    answer: questionAnswers
                };
            } else {
                // Для text типа возвращаем строку
                return {
                    questionId: question.id,
                    answer: questionAnswers[0] || ''
                };
            }
        });

        return { answers };
    };

    const handleNext = async () => {
        if (isLastQuestion) {
            try {
                setIsSubmitting(true);
                const payload = prepareAnswersPayload();
                await surveyService.submitSurveyAnswer(survey.id, payload);
                // Событие: ответ на сюрвей
                amplitudeAnalyticsService.trackEvent('Survey Answer Submitted', {
                    survey_id: survey.id,
                    questions_count: questions.length,
                });
                
                // Переходим на Today страницу после успешной отправки
                navigation.navigate(Routes.TODAY);
            } catch {
                // TODO: Показать ошибку пользователю
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const getCurrentQuestionAnswers = (): string[] => {
        if (!currentQuestion) return [];
        return selectedAnswers[currentQuestion.id] || [];
    };

    if (!currentQuestion) {
        return (
            <PageWithHeader headerContent={
                <>
                    <Pressable
                        onPress={onBack}
                        style={({ pressed }) => [
                            styles.smallBtn,
                            { ...theme.buttons.smallBtn },
                            pressed && { opacity: 0.6 }
                        ]}>
                        <ArrowIcon />
                    </Pressable>
                    <Text style={theme.fonts.subtitle}>
                        {t('main.additionalTasks.survey.title')}
                    </Text>
                </>
            }>
                <View style={styles.center}>
                    <Text style={theme.fonts.subheader}>Вопросы не найдены</Text>
                </View>
            </PageWithHeader>
        );
    }

    const currentAnswers = getCurrentQuestionAnswers();
    const canProceed = currentAnswers.length > 0;

    return (
        <PageWithHeader headerContent={
            <>
                <Pressable
                    onPress={onBack}
                    style={({ pressed }) => [
                        styles.smallBtn,
                        { ...theme.buttons.smallBtn },
                        pressed && { opacity: 0.6 }
                    ]}>
                    <ArrowIcon />
                </Pressable>
                <Text style={theme.fonts.subtitle}>
                    Question {currentQuestionIndex + 1}/{totalQuestions}
                </Text>
            </>
        }>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { flexGrow: 1, paddingBottom: 24 }]}
                showsVerticalScrollIndicator={false}>
                <View style={[{ flexGrow: 1 }]}>
                    <View style={[theme.flexBlocks.vertical16, styles.contentContainer]}>
                        <View style={[theme.flexBlocks.vertical4, styles.questionSection]}>
                            <Text style={styles.questionTitle}>
                                {currentQuestion.text}
                            </Text>

                            {currentQuestion.type === 'multiple' && (
                                <Text style={styles.questionDescription}>
                                    Multiple variants
                                </Text>
                            )}
                        </View>

                        <View style={[theme.flexBlocks.vertical8]}>
                            {currentQuestion.options.map((option) => {
                                const isSelected = currentAnswers.includes(option.id);
                                return (
                                    <SectionItem
                                        key={option.id}
                                        label={option.text}
                                        rightElement={
                                            isSelected
                                                ? <BlackCheckmarkIcon color={theme.buttons.primary.backgroundColor} />
                                                : <GrayCircleIcon />
                                        }
                                        extraStyles={[styles.variantItem]}
                                        onPress={() => handleAnswerSelect(option.id)}
                                    />
                                );
                            })}
                        </View>
                    </View>
                </View>

                {canProceed && (
                    <View style={styles.buttonContainer}>
                        <CustomButton
                            title={isLastQuestion ? 'Finish' : 'Next'}
                            onPress={handleNext}
                            themeName="primary"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        />
                    </View>
                )}
            </ScrollView>
        </PageWithHeader>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    smallBtn: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollViewSingle: {
        marginBottom: 0,
    },
    scrollContent: {
    },
    buttonContainer: {
        paddingBottom: 0,
    },
    variantItem: {
        borderRadius: 16
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    contentContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingVertical: 16,
        paddingHorizontal: 8
    },
    questionSection: {
        paddingHorizontal: 16
    },
    questionTitle: {
        fontFamily: 'InterMedium',
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: -1,
    },
    questionDescription: {
        fontFamily: 'SF Pro Display',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        opacity: 0.6,
    },
});

