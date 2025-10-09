import React, { useState, ReactNode, useEffect } from 'react';
import { AuthContext } from '@app/hooks/auth.hook';
import { useProfile } from '@app/hooks/profile.hook';
import { authService, apiUtils, setOnAuthRequired } from '@shared/services/api';
import { CurrentMoodProvider } from '@features/mood-tracker/CurrentMoodProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActivityTypesLoader } from '@app/hooks/activity-types-loader.hook';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFirebaseUser, setIsFirebaseUser] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const { refreshProfile, clearProfile } = useProfile();
    
    // Функции для работы с флагом Firebase
    const setFirebaseFlag = async (isFirebase: boolean) => {
        try {
            await AsyncStorage.setItem('is_firebase_user', isFirebase.toString());
            setIsFirebaseUser(isFirebase);
        } catch (error) {
            console.error('Ошибка сохранения флага Firebase:', error);
        }
    };

    const getFirebaseFlag = async (): Promise<boolean> => {
        try {
            const flag = await AsyncStorage.getItem('is_firebase_user');
            return flag === 'true';
        } catch (error) {
            console.error('Ошибка получения флага Firebase:', error);
            return false;
        }
    };

    const clearFirebaseFlag = async () => {
        try {
            await AsyncStorage.removeItem('is_firebase_user');
            setIsFirebaseUser(false);
        } catch (error) {
            console.error('Ошибка очистки флага Firebase:', error);
        }
    };

    // Функции для работы с флагом emailVerified
    const setEmailVerifiedFlag = async (isVerified: boolean) => {
        try {
            console.log('setEmailVerifiedFlag: saving to storage:', isVerified);
            await AsyncStorage.setItem('email_verified', isVerified.toString());
            console.log('setEmailVerifiedFlag: saved to storage successfully');
        } catch (error) {
            console.error('Ошибка сохранения флага emailVerified:', error);
        }
    };

    const getEmailVerifiedFlag = async (): Promise<boolean> => {
        try {
            const flag = await AsyncStorage.getItem('email_verified');
            const isVerified = flag === 'true';
            console.log('getEmailVerifiedFlag: retrieved from storage:', flag, 'parsed as:', isVerified);
            return isVerified;
        } catch (error) {
            console.error('Ошибка получения флага emailVerified:', error);
            return false;
        }
    };

    const clearEmailVerifiedFlag = async () => {
        try {
            console.log('clearEmailVerifiedFlag: removing from storage');
            await AsyncStorage.removeItem('email_verified');
            console.log('clearEmailVerifiedFlag: removed from storage successfully');
        } catch (error) {
            console.error('Ошибка очистки флага emailVerified:', error);
        }
    };

    // Функция для обновления состояния emailVerified (используется после подтверждения)
    const updateEmailVerifiedState = (isVerified: boolean) => {
        console.log('updateEmailVerifiedState: updating state to', isVerified);
        setIsEmailVerified(isVerified);
    };
    
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
                        
                        // Загружаем флаг Firebase
                        const firebaseFlag = await getFirebaseFlag();
                        setIsFirebaseUser(firebaseFlag);
                        
                        // Загружаем флаг emailVerified из хранилища
                        const emailVerifiedFlag = await getEmailVerifiedFlag();
                        console.log('AuthProvider: emailVerified from storage:', emailVerifiedFlag);
                        setIsEmailVerified(emailVerifiedFlag);
                        
                        // Обновляем профиль после успешной аутентификации
                        await refreshProfile();
                    } catch (error) {
                        // Токен недействителен, очищаем его
                        await apiUtils.removeAuthTokens();
                        await clearFirebaseFlag();
                        setIsAuthenticated(false);
                        setUser(null);
                        setIsFirebaseUser(false);
                        await clearProfile();
                    }
                } else {
                    // Нет токенов, очищаем флаг Firebase
                    await clearFirebaseFlag();
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
        const handleAuthRequired = async () => {
            setIsAuthenticated(false);
            setUser(null);
            setIsFirebaseUser(false);
            setIsEmailVerified(false);
            await clearFirebaseFlag();
            await clearEmailVerifiedFlag();
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
            setIsLoading(true);
            setError(null);

            // Вызываем API логина
            const response = await authService.login({ email, password });

            // Сохраняем токены
            await apiUtils.setAuthTokens(response.accessToken, response.refreshToken);

            // Сбрасываем флаг Firebase для обычного логина
            await setFirebaseFlag(false);
            
            // Сохраняем флаг emailVerified
            await setEmailVerifiedFlag(response.user.emailVerified);
            
            // Обновляем состояние
            setUser(response.user);
            setIsAuthenticated(true);
            setIsFirebaseUser(false);
            setIsEmailVerified(response.user.emailVerified);
            // Обновляем профиль после успешного входа
            await refreshProfile();
        } catch (error: any) {
            console.error('❌ Ошибка входа:', error);
            const errorMessage = error.message || 'Ошибка входа в систему';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, firstName?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Вызываем API регистрации
            await authService.register({ email, password, firstName });

            // После успешной регистрации автоматически входим
            await login(email, password);
        } catch (error: any) {
            console.error('❌ Ошибка регистрации:', error);
            const errorMessage = error.message || 'Ошибка регистрации';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithFirebase = async (idToken: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Вызываем API Firebase логина
            const response = await authService.firebaseAuth({
                idToken,
                authType: 'login'
                // Поля онбординга пока не используем
            });
            console.log('✅ Получен ответ от Firebase API:', response);
            
            // Сохраняем токены
            console.log('💾 Сохраняем токены...');
            await apiUtils.setAuthTokens(response.accessToken, response.refreshToken);
            console.log('✅ Токены сохранены');
            
            // Устанавливаем флаг Firebase
            await setFirebaseFlag(true);
            
            // Сохраняем флаг emailVerified (для Firebase пользователей всегда true)
            await setEmailVerifiedFlag(true);
            
            // Обновляем состояние
            console.log('🔄 Обновляем состояние...');
            setUser(response.user);
            setIsAuthenticated(true);
            setIsFirebaseUser(true);
            setIsEmailVerified(true);
            // Обновляем профиль после успешного входа
            await refreshProfile();
            console.log('✅ Firebase вход выполнен успешно');
        } catch (error: any) {
            console.error('❌ Ошибка Firebase входа:', error);
            const errorMessage = error.message || 'Ошибка входа через Google';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const registerWithFirebase = async (
        idToken: string, 
        onboardingData: {
            age?: string;
            feelingToday?: string;
            socialNetworks?: string[];
            onboardingQuestionAndAnswers?: Record<string, string>;
            activities?: Array<{ activityName: string; content?: string }>;
            taskTrackingMethod?: string;
        }
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            // Вызываем API Firebase регистрации
            const response = await authService.firebaseAuth({
                idToken,
                authType: 'register',
                ...onboardingData
            });
            console.log('✅ Получен ответ от Firebase API:', response);

            // Сохраняем токены
            await apiUtils.setAuthTokens(response.accessToken, response.refreshToken);

            // Устанавливаем флаг Firebase
            await setFirebaseFlag(true);
            
            // Сохраняем флаг emailVerified (для Firebase пользователей всегда true)
            await setEmailVerifiedFlag(true);
            
            // Обновляем состояние
            setUser(response.user);
            setIsAuthenticated(true);
            setIsFirebaseUser(true);
            setIsEmailVerified(true);
            // Обновляем профиль после успешной регистрации
            await refreshProfile();
        } catch (error: any) {
            console.error('❌ Ошибка Firebase регистрации:', error);
            const errorMessage = error.message || 'Ошибка регистрации через Firebase';
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
            
            // Очищаем флаг Firebase
            await clearFirebaseFlag();
            
            // Очищаем флаг emailVerified
            await clearEmailVerifiedFlag();
            
            // Обновляем состояние
            setIsAuthenticated(false);
            setUser(null);
            setIsFirebaseUser(false);
            setIsEmailVerified(false);
            setError(null);
            // Очищаем профиль при выходе
            await clearProfile();
        } catch (error) {
            console.error('Ошибка выхода:', error);
            // Даже если API вызов не удался, очищаем локальное состояние
            await apiUtils.removeAuthTokens();
            await clearFirebaseFlag();
            await clearEmailVerifiedFlag();
            setIsAuthenticated(false);
            setUser(null);
            setIsFirebaseUser(false);
            setIsEmailVerified(false);
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
            register,
            loginWithFirebase,
            registerWithFirebase,
            logout, 
            error,
            isFirebaseUser,
            isEmailVerified,
            setEmailVerified: setEmailVerifiedFlag,
            getEmailVerified: getEmailVerifiedFlag,
            updateEmailVerifiedState
        }}>
            <CurrentMoodProvider isAuthenticated={isAuthenticated}>
                {children}
            </CurrentMoodProvider>
        </AuthContext.Provider>
    );
};
