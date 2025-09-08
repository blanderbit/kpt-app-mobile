import React from "react";
import { SportActivityIcon } from "@assets/icons/SportActivityIcon";
import { ConcentrationIcon } from "@assets/icons/ConcentrationIcon";
import { HealthCareIcon } from "@assets/icons/HealthCareIcon";
import { MoodIcon } from "@assets/icons/MoodIcon";
import { ArticleIcon } from "@assets/icons/ArticleIcon";
import { SurveyIcon } from "@assets/icons/SurveyIcon";
import { Routes } from "@app/navigation/const";

export enum DailyActivityType {
    MEASURE_ACTIVITY = 'MEASURE_ACTIVITY',
}

export enum AdditionalActivityType {
    MOOD_TRACKER = 'MOOD_TRACKER',
    ARTICLE = 'ARTICLE',
}

export const DailyActivitySections = [
    {
        icon: <SportActivityIcon />,
        label: 'main.today.activity.sportActivity.label',
        info: 'main.today.activity.sportActivity.info',
        backgroundColor: '#245DF51A',
        color: '#245DF5',
        mode: DailyActivityType.MEASURE_ACTIVITY,
        done: false
    },
    {
        icon: <ConcentrationIcon />,
        label: 'main.today.activity.concentration.label',
        info: 'main.today.activity.concentration.info',
        backgroundColor: '#246B561A',
        color: '#246B56',
        done: false
    },
    {
        icon: <HealthCareIcon />,
        label: 'main.today.activity.healthcare.label',
        info: 'main.today.activity.healthcare.info',
        backgroundColor: '#BE77151A',
        color: '#BE7715',
        done: false
    }
]

export const additionalTaskSections = [
    {
        icon: <MoodIcon />,
        label: 'main.today.additionalTasks.mood.title',
        info: 'main.today.additionalTasks.mood.info',
        description: 'main.today.additionalTasks.mood.desc',
        mode: AdditionalActivityType.MOOD_TRACKER
    },
    {
        icon: <ArticleIcon />,
        label: 'main.today.additionalTasks.article.title',
        info: 'main.today.additionalTasks.article.info',
        mode: AdditionalActivityType.ARTICLE,
        path: Routes.ARTICLE
    },
    {
        icon: <SurveyIcon />,
        label: 'main.today.additionalTasks.survey.title',
        info: 'main.today.additionalTasks.survey.info',
        description: 'main.today.additionalTasks.survey.desc',
    }
]
