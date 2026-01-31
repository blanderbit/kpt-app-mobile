import React, { useState, ReactNode, useEffect } from 'react';
import { CurrentMoodContext } from '@app/hooks/current-mood.hook';
import { useCurrentMood } from '@shared/services/api';
import { MoodTrackerResponse } from '@shared/services/api/types';

interface CurrentMoodProviderProps {
    children: ReactNode;
    isAuthenticated: boolean;
}

export const CurrentMoodProvider = ({ children, isAuthenticated }: CurrentMoodProviderProps) => {
    const [currentMood, setCurrentMood] = useState<MoodTrackerResponse | null>(null);
    const [hasMoodForToday, setHasMoodForToday] = useState(false);

    // Используем React Query для получения текущего настроения только если авторизованы
    const { data: currentMoodData, isLoading, refetch } = useCurrentMood({ 
        enabled: isAuthenticated 
    });

    // Проверяем, есть ли настроение за сегодня
    useEffect(() => {
        if (currentMoodData && isAuthenticated) {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const moodDate = new Date(currentMoodData.moodDate).toISOString().split('T')[0];
            
            setCurrentMood(currentMoodData);
            setHasMoodForToday(moodDate === today);
        } else if (!isAuthenticated) {
            setCurrentMood(null);
            setHasMoodForToday(false);
        }
    }, [currentMoodData, isAuthenticated]);

    const refreshCurrentMood = async () => {
        try {
            await refetch();
        } catch {
            // ignore
        }
    };

    const clearCurrentMood = () => {
        setCurrentMood(null);
        setHasMoodForToday(false);
    };

    return (
        <CurrentMoodContext.Provider value={{
            currentMood,
            isLoading,
            hasMoodForToday,
            refreshCurrentMood,
            clearCurrentMood
        }}>
            {children}
        </CurrentMoodContext.Provider>
    );
};
