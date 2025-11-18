import AsyncStorage from '@react-native-async-storage/async-storage';

// Ключи для хранения данных онбординга
export const ONBOARDING_KEYS = {
    PROGRESS: 'onboarding_progress',
    MOOD: 'onboarding_mood_selection',
    SOCIAL_NETWORKS: 'onboarding_social_networks',
    QUESTIONS: 'onboarding_questions_answers',
    AGE: 'onboarding_age',
    TASK_METHOD: 'onboarding_task_method',
    SELECTED_ACTIVITIES: 'onboarding_selected_activities',
    SATISFACTION_LEVEL: 'onboarding_satisfaction_level',
    HARDNESS_LEVEL: 'onboarding_hardness_level',
} as const;

/**
 * Очищает все данные онбординга из AsyncStorage
 */
export const clearOnboardingData = async (): Promise<void> => {
    try {
        await AsyncStorage.multiRemove([
            ONBOARDING_KEYS.PROGRESS,
            ONBOARDING_KEYS.MOOD,
            ONBOARDING_KEYS.SOCIAL_NETWORKS,
            ONBOARDING_KEYS.QUESTIONS,
            ONBOARDING_KEYS.AGE,
            ONBOARDING_KEYS.TASK_METHOD,
            ONBOARDING_KEYS.SELECTED_ACTIVITIES,
            ONBOARDING_KEYS.SATISFACTION_LEVEL,
            ONBOARDING_KEYS.HARDNESS_LEVEL,
        ]);
        console.log('✅ Onboarding data cleared successfully');
    } catch (error) {
        console.error('❌ Error clearing onboarding data:', error);
    }
};

/**
 * Проверяет, есть ли сохраненные данные онбординга
 */
export const hasOnboardingData = async (): Promise<boolean> => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        return keys.some(key => Object.values(ONBOARDING_KEYS).includes(key as any));
    } catch (error) {
        console.error('❌ Error checking onboarding data:', error);
        return false;
    }
};

/**
 * Получает текущий прогресс онбординга
 */
export const getOnboardingProgress = async (): Promise<number | null> => {
    try {
        const progress = await AsyncStorage.getItem(ONBOARDING_KEYS.PROGRESS);
        if (progress) {
            const parsed = JSON.parse(progress);
            return parsed.currentStep || null;
        }
        return null;
    } catch (error) {
        console.error('❌ Error getting onboarding progress:', error);
        return null;
    }
};

/**
 * Сохраняет прогресс онбординга
 */
export const saveOnboardingProgress = async (step: number): Promise<void> => {
    try {
        await AsyncStorage.setItem(ONBOARDING_KEYS.PROGRESS, JSON.stringify({ currentStep: step }));
    } catch (error) {
        console.error('❌ Error saving onboarding progress:', error);
    }
};

/**
 * Загружает все данные онбординга из AsyncStorage
 */
export const loadAllOnboardingData = async (): Promise<{
    age?: string;
    feelingToday?: string;
    socialNetworks?: string[];
    onboardingQuestionAndAnswers?: Record<string, string | string[]>;
    activities?: Array<{ activityName: string; content?: string }>;
    taskTrackingMethod?: string;
    satisfactionLevel?: number;
    hardnessLevel?: number;
}> => {
    try {
        const entries = await AsyncStorage.multiGet([
            ONBOARDING_KEYS.MOOD,
            ONBOARDING_KEYS.SOCIAL_NETWORKS,
            ONBOARDING_KEYS.QUESTIONS,
            ONBOARDING_KEYS.AGE,
            ONBOARDING_KEYS.TASK_METHOD,
            ONBOARDING_KEYS.SELECTED_ACTIVITIES,
            ONBOARDING_KEYS.SATISFACTION_LEVEL,
            ONBOARDING_KEYS.HARDNESS_LEVEL,
        ]);

        const moodValue = entries[0]?.[1];
        const socialNetworksValue = entries[1]?.[1];
        const questionsValue = entries[2]?.[1];
        const ageValue = entries[3]?.[1];
        const taskMethodValue = entries[4]?.[1];
        const selectedActivitiesValue = entries[5]?.[1];
        const satisfactionLevelValue = entries[6]?.[1];
        const hardnessLevelValue = entries[7]?.[1];

        // Преобразуем questions в правильный формат
        let onboardingQuestionAndAnswers: Record<string, string | string[]> | undefined;
        if (questionsValue) {
            const questions = JSON.parse(questionsValue);
            onboardingQuestionAndAnswers = Object.entries(questions).reduce<Record<string, string | string[]>>((acc, [stepName, answers]) => {
                if (!answers || !Array.isArray(answers) || !answers.length) return acc;
                acc[stepName] = answers.length === 1 ? answers[0] : answers;
                return acc;
            }, {});
        }

        // Парсим age и taskTrackingMethod, так как они сохраняются через JSON.stringify
        let parsedAge: string | undefined;
        if (ageValue) {
            try {
                parsedAge = JSON.parse(ageValue);
            } catch {
                parsedAge = ageValue; // Если не JSON, используем как есть
            }
        }

        let parsedTaskMethod: string | undefined;
        if (taskMethodValue) {
            try {
                parsedTaskMethod = JSON.parse(taskMethodValue);
            } catch {
                parsedTaskMethod = taskMethodValue; // Если не JSON, используем как есть
            }
        }

        // Парсим mood (feelingToday), так как он тоже может быть сохранен через JSON.stringify
        let parsedMood: string | undefined;
        if (moodValue) {
            try {
                parsedMood = JSON.parse(moodValue);
            } catch {
                parsedMood = moodValue; // Если не JSON, используем как есть
            }
        }

        // Парсим satisfactionLevel и hardnessLevel
        let parsedSatisfactionLevel: number | undefined;
        if (satisfactionLevelValue) {
            try {
                parsedSatisfactionLevel = JSON.parse(satisfactionLevelValue);
            } catch {
                parsedSatisfactionLevel = undefined;
            }
        }

        let parsedHardnessLevel: number | undefined;
        if (hardnessLevelValue) {
            try {
                parsedHardnessLevel = JSON.parse(hardnessLevelValue);
            } catch {
                parsedHardnessLevel = undefined;
            }
        }

        return {
            age: parsedAge,
            feelingToday: parsedMood,
            socialNetworks: socialNetworksValue ? JSON.parse(socialNetworksValue) : undefined,
            onboardingQuestionAndAnswers: onboardingQuestionAndAnswers && Object.keys(onboardingQuestionAndAnswers).length > 0 ? onboardingQuestionAndAnswers : undefined,
            activities: selectedActivitiesValue ? JSON.parse(selectedActivitiesValue) : undefined,
            taskTrackingMethod: parsedTaskMethod,
            satisfactionLevel: parsedSatisfactionLevel,
            hardnessLevel: parsedHardnessLevel,
        };
    } catch (error) {
        console.error('❌ Error loading onboarding data:', error);
        return {};
    }
};
