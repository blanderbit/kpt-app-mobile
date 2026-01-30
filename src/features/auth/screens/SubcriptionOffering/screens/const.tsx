import {SubscriptionOfferingStep} from "@features/auth/screens/SubcriptionOffering/types";
import React from "react";
import StartTrialScreen from "@features/auth/screens/SubcriptionOffering/screens/StartTrialScreen";
// Второй и третий экраны оплаты временно отключены для тестирования связи оплаты с регистрацией
// import SecondTrialScreen from "@features/auth/screens/SubcriptionOffering/screens/SecondTrialScreen";
// import ThirdTrialScreen from "@features/auth/screens/SubcriptionOffering/screens/ThirdTrialScreen";

export const subscriptionOfferingSteps: SubscriptionOfferingStep[] = [
    {
        id: 1,
        content: (<StartTrialScreen onNext={() => {}} />)
    },
    // {
    //     id: 2,
    //     content: (<SecondTrialScreen onNext={() => {}} />)
    // },
    // {
    //     id: 3,
    //     content: (<ThirdTrialScreen onNext={() => {}} />)
    // },
];

