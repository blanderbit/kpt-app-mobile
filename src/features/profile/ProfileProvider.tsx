import React, { useState, ReactNode, useEffect } from 'react';
import { ProfileContext } from '@app/hooks/profile.hook';
import { authService } from '@shared/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_STORAGE_KEY = 'user_profile';

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загружаем профиль из AsyncStorage при инициализации
    useEffect(() => {
        loadProfileFromStorage();
    }, []);

    // Принудительно обновляем профиль с сервера при старте приложения
    useEffect(() => {
        const initializeProfile = async () => {
            try {
                // Проверяем, есть ли токены для запроса профиля
                const { apiUtils } = await import('@shared/services/api');
                const hasTokens = await apiUtils.hasTokens();
                
                if (hasTokens) {
                    await refreshProfile();
                }
            } catch {
                // ignore
            }
        };

        // Запускаем инициализацию через небольшую задержку
        // чтобы убедиться, что AuthProvider уже инициализировался
        const timer = setTimeout(initializeProfile, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    const loadProfileFromStorage = async () => {
        try {
            const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
            if (storedProfile) {
                const parsedProfile = JSON.parse(storedProfile);
                setProfile(parsedProfile);
            }
        } catch {
            // ignore
        } finally {
            setIsLoading(false);
        }
    };

    const saveProfileToStorage = async (profileData: any) => {
        try {
            await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
        } catch {
            // ignore
        }
    };

    const refreshProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const profileData = await authService.getCurrentUser();
            setProfile(profileData);
            await saveProfileToStorage(profileData);
        } catch (error: any) {
            setError(error.message || 'main.profile.settings.loadProfileError');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = (profileData: any) => {
        setProfile(profileData);
        saveProfileToStorage(profileData);
        
        // Устанавливаем ошибку в null при успешном обновлении
        setError(null);
    };

    const clearProfile = async () => {
        try {
            setProfile(null);
            setError(null);
            await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
        } catch {
            // ignore
        }
    };

    return (
        <ProfileContext.Provider value={{ 
            profile, 
            isLoading, 
            error, 
            refreshProfile, 
            updateProfile, 
            clearProfile 
        }}>
            {children}
        </ProfileContext.Provider>
    );
};
