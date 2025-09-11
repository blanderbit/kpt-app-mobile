import React, { useState, ReactNode, useEffect } from 'react';
import { AuthContext } from '@app/hooks/auth.hook';
import { useProfile } from '@app/hooks/profile.hook';
import { authService, apiUtils } from '@shared/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { refreshProfile, clearProfile } = useProfile();

    // Проверяем наличие токена при загрузке приложения
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('auth_token');
                if (token) {
                    // Проверяем валидность токена, получая данные пользователя
                    try {
                        const userData = await authService.getCurrentUser();
                        setUser(userData);
                        setIsAuthenticated(true);
                        // Обновляем профиль после успешной аутентификации
                        await refreshProfile();
                    } catch (error) {
                        // Токен недействителен, очищаем его
                        await apiUtils.removeAuthToken();
                        setIsAuthenticated(false);
                        setUser(null);
                        await clearProfile();
                    }
                }
            } catch (error) {
                console.error('Ошибка проверки аутентификации:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            console.log('🔐 Начинаем процесс входа...', { email });
            setIsLoading(true);
            setError(null);

            // Вызываем API логина
            console.log('📡 Вызываем authService.login...');
            const response = await authService.login({ email, password });
            console.log('✅ Получен ответ от API:', response);
            
            // Сохраняем токены
            console.log('💾 Сохраняем токен...');
            await apiUtils.setAuthToken(response.accessToken);
            console.log('✅ Токен сохранен');
            
            // Обновляем состояние
            console.log('🔄 Обновляем состояние...');
            setUser(response.user);
            setIsAuthenticated(true);
            // Обновляем профиль после успешного входа
            await refreshProfile();
            console.log('✅ Вход выполнен успешно');
        } catch (error: any) {
            console.error('❌ Ошибка входа:', error);
            const errorMessage = error.message || 'Ошибка входа в систему';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            
            // Вызываем API выхода
            await authService.logout();
            
            // Очищаем токены
            await apiUtils.removeAuthToken();
            
            // Обновляем состояние
            setIsAuthenticated(false);
            setUser(null);
            setError(null);
            // Очищаем профиль при выходе
            await clearProfile();
        } catch (error) {
            console.error('Ошибка выхода:', error);
            // Даже если API вызов не удался, очищаем локальное состояние
            await apiUtils.removeAuthToken();
            setIsAuthenticated(false);
            setUser(null);
            await clearProfile();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            isLoading, 
            login, 
            logout, 
            error 
        }}>
            {children}
        </AuthContext.Provider>
    );
};
