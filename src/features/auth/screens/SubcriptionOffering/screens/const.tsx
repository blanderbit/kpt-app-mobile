import {SubscriptionOfferingStep} from "@features/auth/screens/SubcriptionOffering/types";
import React from "react";
import StartTrialScreen from "@features/auth/screens/SubcriptionOffering/screens/StartTrialScreen";
import SecondTrialScreen from "@features/auth/screens/SubcriptionOffering/screens/SecondTrialScreen";
import ThirdTrialScreen from "@features/auth/screens/SubcriptionOffering/screens/ThirdTrialScreen";

export const subscriptionOfferingSteps: SubscriptionOfferingStep[] = [
    {
        id: 1,
        // content: (<StartTrialScreen onNext={() => {}} />)
        // content: (<SecondTrialScreen onNext={() => {}} />)
        content: (<ThirdTrialScreen onNext={() => {}} />)
    },
    {
        id: 2,
        content: (<SecondTrialScreen onNext={() => {}} />)
    },
    {
        id: 3,
        content: (<ThirdTrialScreen onNext={() => {}} />)
    },
];

