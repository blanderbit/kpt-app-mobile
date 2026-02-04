import React, {useState, useRef, useEffect} from "react";
import {StyleSheet, View, SafeAreaView, Pressable, Animated, Image, Text} from "react-native";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {CloseIcon} from "@assets/icons/CloseIcon";
import {SubscriptionOfferingTemplateProps} from "./types";
import {subscriptionOfferingSteps} from "./screens/const";
import {LinearGradient} from "expo-linear-gradient";
import {revenueCatService} from "@shared/services/revenuecat";
import {COLORS} from "@app/theme";

export default function SubscriptionOfferingTemplate({navigation, onComplete, variant = 'onboarding'}: SubscriptionOfferingTemplateProps) {
    const {theme} = useCustomTheme();
    const [currentStep, setCurrentStep] = useState(1);

    // Анимационные значения для переходов между степами
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const [isTransitioning, setIsTransitioning] = useState(false);

    const totalSteps = subscriptionOfferingSteps.length;
    const [appUserId, setAppUserId] = useState<string | null>(null);

    useEffect(() => {
        revenueCatService.getAppUserID().then(setAppUserId).catch(() => {});
    }, []);

    // Функция для анимированного перехода между степами
    const animateStepTransition = (newStep: number, direction: 'forward' | 'backward', callback?: () => void) => {
        setIsTransitioning(true);

        const exitSlideValue = direction === 'forward' ? -50 : 50;
        const enterSlideValue = direction === 'forward' ? 50 : -50;

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
            setCurrentStep(newStep);

            fadeAnim.setValue(0);
            slideAnim.setValue(enterSlideValue);

            setTimeout(() => {
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
                    setIsTransitioning(false);
                    if (callback) callback();
                });
            }, 50);
        });
    };

    const onNext = () => {
        if (currentStep < totalSteps) {
            const newStep = currentStep + 1;
            animateStepTransition(newStep, 'forward');
        } else {
            // Завершение subscription offering
            if (onComplete) {
                onComplete();
            } else {
                navigation.goBack();
            }
        }
    };

    const onClose = () => {
        if (onComplete) {
            onComplete();
        } else {
            navigation.goBack();
        }
    };

    // Получаем конфигурацию текущего степа
    const getCurrentStepConfig = () => {
        return subscriptionOfferingSteps.find(step => step.id === currentStep);
    };

    // Рендеринг текущего степа
    const renderCurrentStep = () => {
        const currentStepData = subscriptionOfferingSteps.find(step => step.id === currentStep);
        if (!currentStepData) return null;

        return React.cloneElement(currentStepData.content as React.ReactElement, {
            onNext,
            variant,
        });
    };

    return (
        <LinearGradient
            colors={['#d2e2d3', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#edd4d8']}
            locations={[0.02, 0.2, 0.45, 0.6, 0.85, 0.95]}
            style={styles.fullScreenGradient}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
        >
            <View style={styles.fullScreenContainer}>
                <SafeAreaView style={{flex: 1}}>
                    <View style={[styles.header, theme.flexBlocks.justifyCenter, theme.flexBlocks.alignCenter]}>
                        <Image
                            source={require('../../../../../assets/plesury-icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />

                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [
                                styles.smallBtn,
                                { ...theme.buttons.smallBtn },
                                pressed && { opacity: 0.6 },
                                isTransitioning && { opacity: 0.5 }
                            ]}
                            disabled={isTransitioning}
                        >
                            <CloseIcon/>
                        </Pressable>
                    </View>

                    <View style={styles.mainContainer}>
                        <Animated.View
                            style={[
                                styles.stepContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateX: slideAnim }]
                                }
                            ]}
                        >
                            {renderCurrentStep()}
                        </Animated.View>
                    </View>
                    {appUserId != null && (
                        <View style={styles.appUserIdBlock}>
                            <Text style={styles.appUserIdLabel}>RevenueCat app_user_id (для отладки)</Text>
                            <Text style={styles.appUserIdValue} selectable>{appUserId}</Text>
                        </View>
                    )}
                </SafeAreaView>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    fullScreenGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '108%',
        height: '108%',
    },
    fullScreenContainer: {
        flex: 1,
    },
    header: {
        position: 'relative',
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    logo: {
        width: 32,
        height: 32,
    },
    smallBtn: {
        position: 'absolute',
        top: 8,
        right: 16,
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 24,
        paddingHorizontal: 16,
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
    appUserIdBlock: {
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.gray_light,
        borderRadius: 12,
    },
    appUserIdLabel: {
        fontSize: 12,
        opacity: 0.8,
        marginBottom: 4,
        color: COLORS.gray_dark,
    },
    appUserIdValue: {
        fontSize: 11,
        fontFamily: 'monospace',
        color: COLORS.gray_dark,
    },
});
