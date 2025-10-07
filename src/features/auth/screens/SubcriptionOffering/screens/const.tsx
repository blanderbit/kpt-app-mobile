import {SubscriptionOfferingStep} from "@features/auth/screens/SubcriptionOffering/types";
import React from "react";
import StartTrialScreen from "@features/auth/screens/SubcriptionOffering/screens/StartTrialScreen";

export const subscriptionOfferingSteps: SubscriptionOfferingStep[] = [
    {
        id: 1,
        title: "Start Your Free Trial",
        infoText: "Get unlimited access to all features for 7 days",
        content: (<StartTrialScreen onNext={() => {}} />)
    },
    // Добавьте больше степов здесь по мере необходимости
];

