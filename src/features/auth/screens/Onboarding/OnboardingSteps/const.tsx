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
import SixteenthStep from "@features/auth/screens/Onboarding/OnboardingSteps/SixteenthStep";
import SeventeenthStep from "@features/auth/screens/Onboarding/OnboardingSteps/SeventeenthStep";

export const onboardingFirstSectionSteps: OnboardingStep[] = [
    {
        id: 1,
        title: "onboarding.step1.title",
        infoText: "onboarding.step1.infoText",
        content: (<FirstStep onNext={() => {}} onBack={() => {}} />)
    },
    {
        id: 2,
        title: "onboarding.step2.title",
        hasStyledNumber: true,
        content: (<SecondStep onNext={() => {}} />)
    },
    {
        id: 3,
        title: "onboarding.step3.title",
        infoText: "onboarding.step3.infoText",
        content: (<ThirdStep onNext={() => {}} />)
    },
    {
        id: 4,
        title: "onboarding.step4.title",
        content: (<FourthStep onNext={() => {}} />)
    },
    {
        id: 5,
        title: "onboarding.step5.title",
        content: (<FifthStep onNext={() => {}} />)
    }
]

export const onboardingSecondSectionSteps: OnboardingStep[] = [
    {
        id: 6,
        title: "onboarding.step6.title",
        infoText: "onboarding.step6.infoText",
        content: (<SixthStep onNext={() => {}} />)
    },
    {
        id: 7,
        title: "onboarding.step7.title",
        infoText: "onboarding.step7.infoText",
        content: (<SeventhStep onNext={() => {}} />)
    },
    {
        id: 8,
        title: "onboarding.step8.title",
        infoText: "onboarding.step8.infoText",
        content: (<EighthStep onNext={() => {}} />)
    },
    {
        id: 9,
        title: "onboarding.step9.title",
        infoText: "onboarding.step9.infoText",
        content: (<NinthStep onNext={() => {}} />)
    },
    {
        id: 10,
        title: "onboarding.step10.title",
        content: (<TenthStep onNext={() => {}} />)
    },
    {
        id: 11,
        title: "onboarding.step11.title",
        content: (<EleventhStep onNext={() => {}} />)
    },
    {
        id: 12,
        title: "onboarding.step12.title",
        content: (<TwelfthStep onNext={() => {}} />)
    },
    {
        id: 13,
        title: "onboarding.step13.title",
        content: (<ThirteenthStep onNext={() => {}} />)
    },
    {
        id: 14,
        title: "onboarding.step14.title",
        infoText: "onboarding.step14.infoText",
        content: (<FourteenthStep onNext={() => {}} />)
    },
    {
        id: 15,
        title: "onboarding.step15.title",
        infoText: "onboarding.step15.infoText",
        content: (<FifteenthStep onNext={() => {}} />)
    },
    {
        id: 16,
        title: "onboarding.step16.title",
        content: (<SixteenthStep onNext={() => {}} />)
    },
    {
        id: 17,
        title: "onboarding.step17.title",
        content: (<SeventeenthStep onNext={() => {}} />)
    },
]
