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
        content: (<FirstStep />)
    },
    {
        id: 2,
        content: (<SecondStep />)
    },
    {
        id: 3,
        content: (<ThirdStep />)
    },
    {
        id: 4,
        content: (<FourthStep />)
    },
    {
        id: 5,
        content: (<FifthStep />)
    }
]

export const onboardingSecondSectionSteps: OnboardingStep[] = [
    {
        id: 6,
        content: (<SixthStep />)
    },
    {
        id: 7,
        content: (<SeventhStep />)
    },
    {
        id: 8,
        content: (<EighthStep />)
    },
    {
        id: 9,
        content: (<NinthStep />)
    },
    {
        id: 10,
        content: (<TenthStep />)
    },
]
