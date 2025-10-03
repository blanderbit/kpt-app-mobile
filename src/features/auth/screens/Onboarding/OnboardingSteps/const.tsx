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
import EleventhStep from "@features/auth/screens/Onboarding/OnboardingSteps/EleventhStep";
import TwelfthStep from "@features/auth/screens/Onboarding/OnboardingSteps/TwelfthStep";
import ThirteenthStep from "@features/auth/screens/Onboarding/OnboardingSteps/ThirteenthStep";
import FourteenthStep from "@features/auth/screens/Onboarding/OnboardingSteps/FourteenthStep";
import FifteenthStep from "@features/auth/screens/Onboarding/OnboardingSteps/FifteenthStep";

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
        title: "Add your first challenge",
        infoText: "It can be any task, activity or habit you want to track. One-time or repetitive - it doesn't matter.",
        content: (<SeventhStep onNext={() => {}} />)
    },
    {
        id: 8,
        title: "Good job! 👏",
        infoText: "Now, rate your activity using these metrics:",
        content: (<EighthStep onNext={() => {}} />)
    },
    {
        id: 9,
        title: "Task completed successfully!",
        infoText: "That was easy, right? 😊",
        content: (<NinthStep onNext={() => {}} />)
    },
    {
        id: 10,
        title: "How old are you?",
        content: (<TenthStep onNext={() => {}} />)
    },
    {
        id: 11,
        title: "How do you usually track your tasks, activities and goals to find balance in your life?",
        content: (<EleventhStep onNext={() => {}} />)
    },
    {
        id: 12,
        title: "Noted! We're setting everything up for you",
        content: (<TwelfthStep onNext={() => {}} />)
    },
    {
        id: 13,
        title: "Balance your life with AppName",
        content: (<ThirteenthStep onNext={() => {}} />)
    },
    {
        id: 14,
        title: "But we'd love for you to try AppName Plus for 7 days free too!",
        infoText: "AppName is free to use",
        content: (<FourteenthStep onNext={() => {}} />)
    },
    {
        id: 15,
        title: "Free to cancel anytime",
        infoText: "We'll remind you 2 days before you're charged",
        content: (<FifteenthStep onNext={() => {}} />)
    },
]
