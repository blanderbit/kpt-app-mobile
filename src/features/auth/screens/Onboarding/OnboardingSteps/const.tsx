import {OnboardingStep} from "@features/auth/screens/Onboarding/types";
import React from "react";
import FirstStep from "@features/auth/screens/Onboarding/OnboardingSteps/FirstStep";
import SecondStep from "@features/auth/screens/Onboarding/OnboardingSteps/SecondStep";
import ThirdStep from "@features/auth/screens/Onboarding/OnboardingSteps/ThirdStep";
import FourthStep from "@features/auth/screens/Onboarding/OnboardingSteps/FourthStep";
import FifthStep from "@features/auth/screens/Onboarding/OnboardingSteps/FifthStep";

export const onboardingSteps: OnboardingStep[] = [
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
    },
]
