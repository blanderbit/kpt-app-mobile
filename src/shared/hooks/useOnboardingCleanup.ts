import {useEffect} from 'react';
import {clearOnboardingData} from '@shared/utils/onboardingStorage';

/**
 * Хук для очистки данных онбординга при определенных событиях
 */
export const useOnboardingCleanup = () => {
    useEffect(() => {
        // Очищаем данные при размонтировании компонента
        return () => {
            // Можно добавить логику для очистки при определенных условиях
        };
    }, []);
};

/**
 * Очищает данные онбординга при логауте
 */
export const clearOnboardingOnLogout = async () => {
    await clearOnboardingData();
};

/**
 * Очищает данные онбординга при смене пользователя
 */
export const clearOnboardingOnUserChange = async () => {
    await clearOnboardingData();
};
