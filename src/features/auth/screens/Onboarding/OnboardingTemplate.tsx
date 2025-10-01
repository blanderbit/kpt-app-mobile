import React, {useState, useMemo, useEffect} from 'react';
import {View, StyleSheet, Pressable, SafeAreaView, Text, ActivityIndicator} from 'react-native';
import {useCustomTheme} from "@app/theme/ThemeContext";
import {ArrowIcon} from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import StepperLine from "@shared/components/StepperLine/StepperLine";
import {OnboardingTemplateProps} from './types';
import {onboardingSteps} from "@features/auth/screens/Onboarding/OnboardingSteps/const";
import OnboardingQuestionStep from "@features/auth/screens/Onboarding/OnboardingSteps/OnboardingQuestionStep";
import {useOnboardingQuestions} from "@shared/services/api/hooks";
import {OnboardingQuestion} from "@shared/services/api/types";
import {clearOnboardingData, getOnboardingProgress, saveOnboardingProgress} from "@shared/utils/onboardingStorage";

export default function OnboardingTemplate({
                                               navigation,
                                           }: OnboardingTemplateProps) {
    const {theme} = useCustomTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const {data: questions, isLoading: questionsLoading} = useOnboardingQuestions();
    
    const [onboardingData, setOnboardingData] = useState<{
        mood: string | null;
        socialNetworks: string[];
        questions: Array<{
            question: OnboardingQuestion;
            selectedAnswers: string[];
        }>;
    }>({
        mood: null,
        socialNetworks: [],
        questions: []
    });

    // Восстанавливаем прогресс при монтировании
    useEffect(() => {
        loadOnboardingProgress();
    }, []);

    const loadOnboardingProgress = async () => {
        try {
            const savedStep = await getOnboardingProgress();
            if (savedStep) {
                setCurrentStep(savedStep);
            }
        } catch (error) {
            console.error('Error loading onboarding progress:', error);
        }
    };

    // Вычисляем общее количество шагов (статические + динамические вопросы)
    const totalSteps = useMemo(() => {
        return onboardingSteps.length + (questions?.length || 0);
    }, [questions]);

    // Показываем stepper только после загрузки вопросов
    const showStepper = !questionsLoading;

    const onBack = async () => {
        if (currentStep > 1) {
            const newStep = currentStep - 1;
            setCurrentStep(newStep);
            await saveOnboardingProgress(newStep);
        } else {
            // Пользователь выходит из онбординга - очищаем данные
            await clearOnboardingData();
            navigation.goBack();
        }
    };

    const onNext = async () => {
        if (currentStep < totalSteps) {
            const newStep = currentStep + 1;
            setCurrentStep(newStep);
            await saveOnboardingProgress(newStep);
        } else {
            // Завершение онбординга
            console.log('Onboarding data:', onboardingData);
            await clearOnboardingData();
            navigation.navigate('Main');
        }
    };

    const handleQuestionAnswer = async (question: OnboardingQuestion, selectedAnswers: string[]) => {
        setOnboardingData(prev => ({
            ...prev,
            questions: [...prev.questions, { question, selectedAnswers }]
        }));
        await onNext();
    };

    const handleMoodSelection = async (mood: string) => {
        setOnboardingData(prev => ({
            ...prev,
            mood: mood
        }));
        await onNext();
    };

    const handleSocialNetworks = async (networks: string[]) => {
        setOnboardingData(prev => ({
            ...prev,
            socialNetworks: networks
        }));
        await onNext();
    };

    // Определяем, какой компонент рендерить
    const renderCurrentStep = () => {
        // Статические шаги (1-5)
        if (currentStep <= onboardingSteps.length) {
            const currentStepData = onboardingSteps.find(step => step.id === currentStep);
            if (currentStepData) {
                let onNextHandler = onNext;
                if (currentStep === 4) {
                    onNextHandler = handleMoodSelection;
                } else if (currentStep === 5) {
                    onNextHandler = handleSocialNetworks;
                }
                
                return React.cloneElement(currentStepData.content as React.ReactElement, {
                    onNext: onNextHandler,
                    onBack,
                });
            }
        }
        
        // Динамические вопросы (начиная с 6-го шага)
        const questionIndex = currentStep - onboardingSteps.length - 1;
        if (questions && questionIndex >= 0 && questionIndex < questions.length) {
            return (
                <OnboardingQuestionStep
                    questionIndex={questionIndex}
                    onNext={handleQuestionAnswer}
                />
            );
        }
        
        return null;
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <PageWithHeader noStylingHeader headerContent={
                <View style={[theme.flexBlocks.horizontal16, theme.flexBlocks.alignCenter]}>
                    <Pressable
                        onPress={onBack}
                        style={({pressed}) => [
                            {...theme.buttons.smallBtn},
                            pressed && {opacity: 0.6}
                        ]}>
                        <ArrowIcon/>
                    </Pressable>

                    {showStepper && (
                        <StepperLine step={currentStep} totalSteps={totalSteps}/>
                    )}
                </View>
            }>
                <View style={styles.mainContainer}>
                    {questionsLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={theme.buttons.primary.backgroundColor} />
                        </View>
                    ) : (
                        renderCurrentStep()
                    )}
                </View>
            </PageWithHeader>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 24,
        paddingHorizontal: 8,
        paddingBottom: 8,
        borderRadius: 24,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepNavigation: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    nextButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

