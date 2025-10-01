import AsyncStorage from '@react-native-async-storage/async-storage';

// Ключи для хранения данных онбординга
export const ONBOARDING_KEYS = {
    PROGRESS: 'onboarding_progress',
    MOOD: 'onboarding_mood_selection',
    SOCIAL_NETWORKS: 'onboarding_social_networks',
    QUESTIONS: 'onboarding_questions_answers',
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
