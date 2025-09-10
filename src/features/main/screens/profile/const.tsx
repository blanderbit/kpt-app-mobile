import React from "react";
import { ColorSchemeIcon } from "@assets/icons/ColorSchemeIcon";
import { UserIcon } from "@assets/icons/UserIcon";
import { DocPolicyIcon } from "@assets/icons/DocPolicyIcon";
import { DocTermsIcon } from "@assets/icons/DocTermsIcon";
import { SupportIcon } from "@assets/icons/SupportIcon";
import { SubscriptionIcon } from "@assets/icons/SubscriptionIcon";
import { DeleteIcon } from "@assets/icons/DeleteIcon";
import { LogOutIcon } from "@assets/icons/LogOutIcon";
import { Routes } from "@app/navigation/const";

export const weekDays = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];

export interface SettingsItem {
    label: string,
    icon: any,
    path?: Routes,
}

type SettingsElement = SettingsItem | SettingsItem[];

export const settingsElements: SettingsElement[] = [
    {
        label: 'main.profile.settings.colorScheme',
        icon: <ColorSchemeIcon/>
    },
    [
        {
            label: 'main.profile.settings.personalInfo',
            icon: <UserIcon/>,
            path: Routes.PERSONAL_INFO
        },
        {
            label: 'main.profile.settings.privacyPolicy',
            icon: <DocPolicyIcon/>
        },
        {
            label: 'main.profile.settings.termsConditions',
            icon: <DocTermsIcon/>
        }
    ],
    {
        label: 'main.profile.settings.support',
        icon: <SupportIcon/>
    },
    [
        {
            label: 'main.profile.settings.subscriptionSettings',
            icon: <SubscriptionIcon/>,
            path: Routes.SUBSCRIPTION_SETTINGS
        },
        {
            label: 'main.profile.settings.deleteAccount',
            icon: <DeleteIcon/>
        },
        {
            label: 'main.profile.settings.logOut',
            icon: <LogOutIcon/>
        },
    ]
]
