import React, {useState, useMemo, useEffect, useRef} from 'react';
import {View, StyleSheet, Pressable, SafeAreaView, Text, ActivityIndicator, Animated} from 'react-native';
import {useCustomTheme} from "@app/theme/ThemeContext";
import {COLORS} from "@app/theme";
import {ArrowIcon} from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import StepperLine from "@shared/components/StepperLine/StepperLine";
import {OnboardingTemplateProps} from './types';
import {onboardingFirstSectionSteps, onboardingSecondSectionSteps} from "@features/auth/screens/Onboarding/OnboardingSteps/const";
import OnboardingQuestionStep from "@features/auth/screens/Onboarding/OnboardingSteps/OnboardingQuestionStep";
import SixthStep from "@features/auth/screens/Onboarding/OnboardingSteps/SixthStep";
import SeventhStep from "@features/auth/screens/Onboarding/OnboardingSteps/SeventhStep";
import {useOnboardingQuestions} from "@shared/services/api/hooks";
import {OnboardingQuestion} from "@shared/services/api/types";
import {clearOnboardingData, getOnboardingProgress, saveOnboardingProgress} from "@shared/utils/onboardingStorage";
import EighthStep from "@features/auth/screens/Onboarding/OnboardingSteps/EighthStep";
import NinthStep from "@features/auth/screens/Onboarding/OnboardingSteps/NinthStep";
import TenthStep from "@features/auth/screens/Onboarding/OnboardingSteps/TenthStep";

export default function OnboardingTemplate({
                                               navigation,
                                           }: OnboardingTemplateProps) {
    const {theme} = useCustomTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const {data: questions, isLoading: questionsLoading} = useOnboardingQuestions();
    
    // Анимационные значения для переходов между степами
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
    
    // Анимация для загрузки
    const loadingAnim = useRef(new Animated.Value(0)).current;
    
    // Анимация для степпера
    const stepperAnim = useRef(new Animated.Value(0)).current;
    
    // Анимация для кнопки "Назад"
    const backButtonAnim = useRef(new Animated.Value(1)).current;
    
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

    // Анимация загрузки
    useEffect(() => {
        if (questionsLoading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(loadingAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(loadingAnim, {
                        toValue: 0,
                        duration: 1000,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            loadingAnim.stopAnimation();
            loadingAnim.setValue(0);
        }
    }, [questionsLoading, loadingAnim]);

    // Анимация появления степпера
    useEffect(() => {
        if (showStepper) {
            Animated.timing(stepperAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [showStepper, stepperAnim]);

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

    const count = 17000;

    // Вычисляем общее количество шагов (5 статических + динамические вопросы + финальные степпы)
    const totalSteps = useMemo(() => {
        return onboardingFirstSectionSteps.length + (questions?.length || 0) + onboardingSecondSectionSteps.length; // 5 статических + вопросы + 6-й, 7-й, 8-й и далее
    }, [questions]);

    // Показываем stepper только после загрузки вопросов
    const showStepper = !questionsLoading;

    // Получаем конфигурацию текущего степа
    const getCurrentStepConfig = () => {
        // Статические шаги (1-5)
        if (currentStep <= onboardingFirstSectionSteps.length) {
            const stepConfig = onboardingFirstSectionSteps.find(step => step.id === currentStep);
            if (stepConfig && currentStep === 2) {
                return {
                    ...stepConfig,
                    title: stepConfig.title?.replace('{count}', count.toString()),
                };
            }
            return stepConfig;
        }
        
        // Динамические вопросы - используем вопрос из API
        const questionIndex = currentStep - 6;
        if (questions && questionIndex >= 0 && questionIndex < questions.length) {
            const question = questions[questionIndex];
            return {
                id: currentStep,
                title: question.stepQuestion,
                infoText: undefined
            };
        }
        
        // Финальные степпы - после всех динамических вопросов
        const questionsCount = questions?.length || 0;
        const sixthStepNumber = 6 + questionsCount;
        const seventhStepNumber = 6 + questionsCount + 1;
        const eighthStepNumber = 6 + questionsCount + 2;
        const ninthStepNumber = 6 + questionsCount + 3;
        const tenthStepNumber = 6 + questionsCount + 4;

        if (currentStep === sixthStepNumber) {
            return onboardingSecondSectionSteps.find(step => step.id === 6);
        }
        if (currentStep === seventhStepNumber) {
            return onboardingSecondSectionSteps.find(step => step.id === 7);
        }
        if (currentStep === eighthStepNumber) {
            return onboardingSecondSectionSteps.find(step => step.id === 8);
        }
        if (currentStep === ninthStepNumber) {
            return onboardingSecondSectionSteps.find(step => step.id === 9);
        }
        if (currentStep === tenthStepNumber) {
            return onboardingSecondSectionSteps.find(step => step.id === 10);
        }
        
        return null;
    };

    // Функция для анимированного перехода между степами
    const animateStepTransition = (newStep: number, direction: 'forward' | 'backward', callback?: () => void) => {
        setIsTransitioning(true);
        setTransitionDirection(direction);
        
        // Определяем направление анимации
        const exitSlideValue = direction === 'forward' ? -50 : 50; // вперед - влево, назад - вправо
        const enterSlideValue = direction === 'forward' ? 50 : -50; // новый контент приходит с противоположной стороны
        
        // Анимация кнопки "Назад" в зависимости от направления
        Animated.timing(backButtonAnim, {
            toValue: direction === 'backward' ? 1.1 : 0.8,
            duration: 200,
            useNativeDriver: true,
        }).start();
        
        // Анимация исчезновения текущего степа
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: exitSlideValue,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            // Обновляем степ
            setCurrentStep(newStep);
            
            // Сбрасываем анимационные значения для следующего степа
            fadeAnim.setValue(0);
            slideAnim.setValue(enterSlideValue);
            
            // Небольшая задержка для более плавного перехода
            setTimeout(() => {
                // Анимация появления нового степа
                Animated.parallel([
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    // Возвращаем кнопку "Назад" в исходное состояние
                    Animated.timing(backButtonAnim, {
                        toValue: 1,
                        duration: 200,
                        useNativeDriver: true,
                    }).start();
                    
                    setIsTransitioning(false);
                    if (callback) callback();
                });
            }, 50); // 50ms задержка
        });
    };

    const onBack = async () => {
        if (currentStep > 1) {
            const newStep = currentStep - 1;
            animateStepTransition(newStep, 'backward', async () => {
                await saveOnboardingProgress(newStep);
            });
        } else {
            // Пользователь выходит из онбординга - очищаем данные
            await clearOnboardingData();
            navigation.goBack();
        }
    };

    const onNext = async () => {
        if (currentStep < totalSteps) {
            const newStep = currentStep + 1;
            animateStepTransition(newStep, 'forward', async () => {
                await saveOnboardingProgress(newStep);
            });
        } else {
            // Завершение онбординга
            await clearOnboardingData();
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
        if (currentStep <= onboardingFirstSectionSteps.length) {
            const currentStepData = onboardingFirstSectionSteps.find(step => step.id === currentStep);
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
        
        // Динамические вопросы (всегда после 5-го шага)
        const questionIndex = currentStep - 6; // 6-й шаг = первый вопрос (индекс 0)
        if (questions && questionIndex >= 0 && questionIndex < questions.length) {
            return (
                <OnboardingQuestionStep
                    questionIndex={questionIndex}
                    onNext={handleQuestionAnswer}
                />
            );
        }
        
        // Финальные степпы - после всех динамических вопросов
        const questionsCount = questions?.length || 0;
        const sixthStepNumber = 6 + questionsCount; // 6 + количество вопросов
        const seventhStepNumber = 6 + questionsCount + 1; // следующий после 6-го
        const eighthStepNumber = 6 + questionsCount + 2; // следующий после 7-го
        const ninthStepNumber = 6 + questionsCount + 3; // следующий после 8-го
        const tenthStepNumber = 6 + questionsCount + 4; // следующий после 9-го

        if (currentStep === sixthStepNumber) {
            return (
                <SixthStep
                    onNext={onNext}
                />
            );
        }
        
        if (currentStep === seventhStepNumber) {
            return (
                <SeventhStep
                    onNext={onNext}
                />
            );
        }

        if (currentStep === eighthStepNumber) {
            return (
                <EighthStep
                    onNext={onNext}
                />
            );
        }

        if (currentStep === ninthStepNumber) {
            return (
                <NinthStep
                    onNext={onNext}
                />
            );
        }

        if (currentStep === tenthStepNumber) {
            return (
                <TenthStep
                    onNext={onNext}
                />
            );
        }
        
        return null;
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <PageWithHeader noStylingHeader headerContent={
                <View style={[theme.flexBlocks.horizontal16, theme.flexBlocks.alignCenter]}>
                    <Animated.View
                        style={{
                            transform: [{ scale: backButtonAnim }]
                        }}
                    >
                        <Pressable
                            onPress={onBack}
                            style={({pressed}) => [
                                {...theme.buttons.smallBtn},
                                pressed && {opacity: 0.6},
                                isTransitioning && {opacity: 0.5}
                            ]}
                            disabled={isTransitioning}>
                            <ArrowIcon/>
                        </Pressable>
                    </Animated.View>

                    {showStepper && (
                        <Animated.View
                            style={{
                                width: '100%',
                                opacity: stepperAnim,
                                transform: [{
                                    scale: stepperAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.8, 1],
                                    })
                                }]
                            }}
                        >
                            <StepperLine step={currentStep} totalSteps={totalSteps}/>
                        </Animated.View>
                    )}
                </View>
            }>
                <View style={styles.mainContainer}>
                    {questionsLoading ? (
                        <Animated.View 
                            style={[
                                styles.loadingContainer,
                                {
                                    opacity: loadingAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.5, 1],
                                    })
                                }
                            ]}
                        >
                            <ActivityIndicator size="large" color={theme.buttons.primary.backgroundColor} />
                        </Animated.View>
                    ) : (
                        <Animated.View 
                            style={[
                                styles.stepContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateX: slideAnim }]
                                }
                            ]}
                        >
                            {/* Общие элементы: тайтл и инфо текст */}
                            {(() => {
                                const stepConfig = getCurrentStepConfig();
                                if (!stepConfig) return null;
                                
                                return (
                                    <View style={styles.commonHeader}>
                                        <View style={styles.head}>
                                            {stepConfig.title && (
                                                <Text style={[styles.title, {...theme.fonts.title}]}>
                                                    {stepConfig.hasStyledNumber ? (
                                                        <>
                                                            We've helped <Text style={{color: COLORS.warning}}>17,000</Text> busy minds feel more balanced
                                                        </>
                                                    ) : (
                                                        stepConfig.title
                                                    )}
                                                </Text>
                                            )}
                                            {stepConfig.infoText && (
                                                <Text style={[styles.info, {...theme.fonts.regular}]}>
                                                    {stepConfig.infoText}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                );
                            })()}
                            
                            {renderCurrentStep()}
                        </Animated.View>
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
    stepContainer: {
        flex: 1,
    },
    commonHeader: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        paddingTop: 10,
        marginBottom: 8,
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

