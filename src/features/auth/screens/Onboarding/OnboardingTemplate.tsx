import React, {useState} from 'react';
import {View, StyleSheet, Pressable, SafeAreaView, Text} from 'react-native';
import {useCustomTheme} from "@app/theme/ThemeContext";
import {ArrowIcon} from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import StepperLine from "@shared/components/StepperLine/StepperLine";
import {OnboardingTemplateProps} from './types';
import {onboardingSteps} from "@features/auth/screens/Onboarding/OnboardingSteps/const";

export default function OnboardingTemplate({
                                               navigation,
                                           }: OnboardingTemplateProps) {
    const {theme} = useCustomTheme();
    const [currentStep, setCurrentStep] = useState(1);

    const onBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigation.goBack();
        }
    };

    const onNext = () => {
        if (currentStep < onboardingSteps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            // Завершение онбординга
            navigation.navigate('Main');
        }
    };

    const currentStepData = onboardingSteps.find(step => step.id === currentStep);

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

                    <StepperLine step={currentStep} totalSteps={onboardingSteps.length}/>
                </View>
            }>
                <View style={styles.mainContainer}>
                    {currentStepData && React.cloneElement(currentStepData.content as React.ReactElement, {
                        onNext,
                        onBack,
                        currentStep,
                        totalSteps: onboardingSteps.length
                    })}
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

