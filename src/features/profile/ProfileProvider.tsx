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
                    console.log('🔄 Принудительно обновляем профиль при старте приложения...');
                    await refreshProfile();
                }
            } catch (error) {
                console.error('❌ Ошибка инициализации профиля:', error);
            }
        };

        // Запускаем инициализацию через небольшую задержку
        // чтобы убедиться, что AuthProvider уже инициализировался
        const timer = setTimeout(initializeProfile, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    const loadProfileFromStorage = async () => {
        try {
            console.log('📱 Загружаем профиль из AsyncStorage...');
            const storedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
            if (storedProfile) {
                const parsedProfile = JSON.parse(storedProfile);
                setProfile(parsedProfile);
                console.log('✅ Профиль загружен из AsyncStorage:', parsedProfile.firstName);
            }
        } catch (error) {
            console.error('❌ Ошибка загрузки профиля из AsyncStorage:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveProfileToStorage = async (profileData: any) => {
        try {
            console.log('💾 Сохраняем профиль в AsyncStorage...');
            await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
            console.log('✅ Профиль сохранен в AsyncStorage');
        } catch (error) {
            console.error('❌ Ошибка сохранения профиля в AsyncStorage:', error);
        }
    };

    const refreshProfile = async () => {
        try {
            console.log('🔄 Обновляем профиль с сервера...');
            setIsLoading(true);
            setError(null);

            const profileData = await authService.getCurrentUser();
            console.log('✅ Профиль получен с сервера:', profileData.firstName);
            
            setProfile(profileData);
            await saveProfileToStorage(profileData);
        } catch (error: any) {
            console.error('❌ Ошибка обновления профиля:', error);
            setError(error.message || 'Ошибка загрузки профиля');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = (profileData: any) => {
        console.log('🔄 Обновляем профиль в контексте...', profileData);
        setProfile(profileData);
        saveProfileToStorage(profileData);
        
        // Устанавливаем ошибку в null при успешном обновлении
        setError(null);
    };

    const clearProfile = async () => {
        try {
            console.log('🗑️ Очищаем профиль...');
            setProfile(null);
            setError(null);
            await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
            console.log('✅ Профиль очищен');
        } catch (error) {
            console.error('❌ Ошибка очистки профиля:', error);
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
