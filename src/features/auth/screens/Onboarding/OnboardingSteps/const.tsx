import {OnboardingStep} from "@features/auth/screens/Onboarding/types";
import React from "react";
import FirstStep from "@features/auth/screens/Onboarding/OnboardingSteps/FirstStep";
import SecondStep from "@features/auth/screens/Onboarding/OnboardingSteps/SecondStep";
import ThirdStep from "@features/auth/screens/Onboarding/OnboardingSteps/ThirdStep";
import FourthStep from "@features/auth/screens/Onboarding/OnboardingSteps/FourthStep";
import FifthStep from "@features/auth/screens/Onboarding/OnboardingSteps/FifthStep";
import SeventhStep from "@features/auth/screens/Onboarding/OnboardingSteps/SeventhStep";
import SixthStep from "@features/auth/screens/Onboarding/OnboardingSteps/SixthStep";
import EighthStep from "@features/auth/screens/Onboarding/OnboardingSteps/EighthStep";
import NinthStep from "@features/auth/screens/Onboarding/OnboardingSteps/NinthStep";
import TenthStep from "@features/auth/screens/Onboarding/OnboardingSteps/TenthStep";

export const onboardingFirstSectionSteps: OnboardingStep[] = [
    {
        id: 1,
        title: "Welcome to AppName",
        infoText: "Choose ready-made or create you own tasks, activities and habits. Track achievement and satisfaction. Discover your balance!",
        content: (<FirstStep onNext={() => {}} onBack={() => {}} />)
    },
    {
        id: 2,
        title: "We've helped {count} busy minds feel more balanced",
        hasStyledNumber: true,
        content: (<SecondStep onNext={() => {}} />)
    },
    {
        id: 3,
        title: "That's great!",
        infoText: "93% of users report AppName has seamlessly helped them to stay balanced and live fulfilled life.",
        content: (<ThirdStep onNext={() => {}} />)
    },
    {
        id: 4,
        title: "What's your current mood?",
        content: (<FourthStep onNext={() => {}} />)
    },
    {
        id: 5,
        title: "How did you hear about us?",
        content: (<FifthStep onNext={() => {}} />)
    }
]

export const onboardingSecondSectionSteps: OnboardingStep[] = [
    {
        id: 6,
        title: "Awesome",
        infoText: "With AppName you don't need to put too much time to track your achievement and satisfaction level.",
        content: (<SixthStep onNext={() => {}} />)
    },
    {
        id: 7,
        title: "Let's get started!",
        infoText: "Create your first activity and see how easy it is to stay on track.",
        content: (<SeventhStep onNext={() => {}} />)
    },
    {
        id: 8,
        title: "You're all set!",
        infoText: "Welcome to your personalized dashboard. Start tracking your activities and see your progress.",
        content: (<EighthStep onNext={() => {}} />)
    },
    {
        id: 9,
        title: "Ready to begin?",
        infoText: "Your journey to better balance starts now. Let's make it happen!",
        content: (<NinthStep onNext={() => {}} />)
    },
    {
        id: 10,
        title: "Welcome aboard!",
        infoText: "Everything is ready. Let's start your journey to a more balanced life.",
        content: (<TenthStep onNext={() => {}} />)
    },
]
