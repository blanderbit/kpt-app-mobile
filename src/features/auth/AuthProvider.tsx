import React, { useState, ReactNode, useEffect } from 'react';
import { AuthContext } from '@app/hooks/auth.hook';
import { useProfile } from '@app/hooks/profile.hook';
import { authService, apiUtils, setOnAuthRequired } from '@shared/services/api';
import { CurrentMoodProvider } from '@features/mood-tracker/CurrentMoodProvider';
import { useActivityTypesLoader } from '@app/hooks/activity-types-loader.hook';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { refreshProfile, clearProfile } = useProfile();
    
    const { isLoading: isLoadingActivityTypes } = useActivityTypesLoader({ 
        enabled: isAuthenticated 
    });

    // Проверяем наличие токена при загрузке приложения
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const hasTokens = await apiUtils.hasTokens();
                if (hasTokens) {
                    // Проверяем валидность токена, получая данные пользователя
                    try {
                        const userData = await authService.getCurrentUser();
                        setUser(userData);
                        setIsAuthenticated(true);
                        // Обновляем профиль после успешной аутентификации
                        await refreshProfile();
                    } catch (error) {
                        // Токен недействителен, очищаем его
                        await apiUtils.removeAuthTokens();
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

    // Устанавливаем callback для уведомления о необходимости логина
    useEffect(() => {
        const handleAuthRequired = () => {
            console.log('🔔 Получено уведомление о необходимости логина');
            setIsAuthenticated(false);
            setUser(null);
            clearProfile();
        };

        setOnAuthRequired(handleAuthRequired);

        // Очищаем callback при размонтировании
        return () => {
            setOnAuthRequired(null);
        };
    }, [clearProfile]);

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
            console.log('💾 Сохраняем токены...');
            await apiUtils.setAuthTokens(response.accessToken, response.refreshToken);
            console.log('✅ Токены сохранены');
            
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
            await apiUtils.removeAuthTokens();
            
            // Обновляем состояние
            setIsAuthenticated(false);
            setUser(null);
            setError(null);
            // Очищаем профиль при выходе
            await clearProfile();
        } catch (error) {
            console.error('Ошибка выхода:', error);
            // Даже если API вызов не удался, очищаем локальное состояние
            await apiUtils.removeAuthTokens();
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
            <CurrentMoodProvider isAuthenticated={isAuthenticated}>
                {children}
            </CurrentMoodProvider>
        </AuthContext.Provider>
    );
};
