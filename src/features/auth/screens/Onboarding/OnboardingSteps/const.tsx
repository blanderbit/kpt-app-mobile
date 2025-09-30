import {OnboardingStep} from "@features/auth/screens/Onboarding/types";
import React from "react";
import FirstStep from "@features/auth/screens/Onboarding/OnboardingSteps/FirstStep";
import SecondStep from "@features/auth/screens/Onboarding/OnboardingSteps/SecondStep";

export const onboardingSteps: OnboardingStep[] = [
    {
        id: 1,
        content: (<FirstStep />)
    },
    {
        id: 2,
        content: (<SecondStep />)
    },
]
