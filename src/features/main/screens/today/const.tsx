import React from "react";
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
        info: 'main.today.activity.sportActivity.info',
        activityType: 'general',
        mode: DailyActivityType.MEASURE_ACTIVITY,
        done: false
    },
    {
        info: 'main.today.activity.concentration.info',
        activityType: 'fitness',
        done: false
    },
    {
        info: 'main.today.activity.healthcare.info',
        activityType: 'social',
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
