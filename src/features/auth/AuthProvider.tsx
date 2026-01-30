import React, { useState, ReactNode, useEffect } from 'react';
import { AuthContext } from '@app/hooks/auth.hook';
import { useProfile } from '@app/hooks/profile.hook';
import { authService, apiUtils, setOnAuthRequired } from '@shared/services/api';
import { CurrentMoodProvider } from '@features/mood-tracker/CurrentMoodProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useActivityTypesLoader } from '@app/hooks/activity-types-loader.hook';
import { notificationService } from '@shared/services/notifications/NotificationService';
import { amplitudeAnalyticsService } from '@shared/services/analytics';
import { revenueCatService } from '@shared/services/revenuecat';
import { queryClient } from '@shared/services/query/QueryProvider';
import { clearOnboardingOnLogout } from '@shared/hooks/useOnboardingCleanup';
import { loadAllOnboardingData } from '@shared/utils/onboardingStorage';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitializing, setIsInitializing] = useState(true);
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

                        // RevenueCat: appUserID должен совпадать с users.id на бэкенде
                        if (userData?.id != null) {
                            await revenueCatService.setUserID(String(userData.id));
                        }

                        // Загружаем флаг Firebase
                        const firebaseFlag = await getFirebaseFlag();
                        setIsFirebaseUser(firebaseFlag);

                        // Загружаем флаг emailVerified из хранилища
                        const emailVerifiedFlag = await getEmailVerifiedFlag();
                        console.log('AuthProvider: emailVerified from storage:', emailVerifiedFlag);
                        setIsEmailVerified(emailVerifiedFlag);

                        // Обновляем профиль после успешной аутентификации
                        await refreshProfile();

                        // Регистрируем нотификации после успешной аутентификации
                        await notificationService.registerDevice();

                        // Инициализируем Amplitude Analytics с email пользователя
                        if (userData?.email) {
                            await amplitudeAnalyticsService.initialize(userData.email);
                            amplitudeAnalyticsService.setUserProperties({
                                email: userData.email || '',
                                email_verified: emailVerifiedFlag,
                                is_firebase_user: firebaseFlag,
                            });
                        }
                    } catch (error) {
                        // Токен недействителен, очищаем его
                        await apiUtils.removeAuthTokens();
                        await clearFirebaseFlag();

                        // Очищаем React Query кеш при недействительном токене
                        queryClient.clear();

                        // Очищаем данные онбординга
                        await clearOnboardingOnLogout();

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
                setIsInitializing(false);
            }
        };

        checkAuthStatus();

        // Устанавливаем слушатель изменений разрешений на нотификации
        notificationService.setupPermissionsListener();

        // Очищаем слушатель при размонтировании
        return () => {
            notificationService.removePermissionsListener();
        };
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

            // Очищаем React Query кеш при необходимости логина
            queryClient.clear();

            // Очищаем данные онбординга
            await clearOnboardingOnLogout();

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

            // RevenueCat: передаём app user ID для привязки подписок к пользователю после логина
            const appUserId = await revenueCatService.getAppUserID().catch(() => null);
            const response = await authService.login({
                email,
                password,
                ...(appUserId ? { appUserId } : {}),
            });

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

            // RevenueCat: appUserID должен совпадать с users.id на бэкенде
            if (response.user?.id != null) {
                await revenueCatService.setUserID(String(response.user.id));
            }
            // Обновляем профиль после успешного входа
            await refreshProfile();
            // Регистрируем нотификации после успешного входа
            await notificationService.registerDevice();

            // Инициализируем Amplitude Analytics с email и отслеживаем событие входа
            if (response.user?.email) {
                await amplitudeAnalyticsService.initialize(response.user.email);
                amplitudeAnalyticsService.setUserProperties({
                    email: response.user.email || '',
                    email_verified: response.user.emailVerified,
                    is_firebase_user: false,
                });
                amplitudeAnalyticsService.trackEvent('Login', {
                    method: 'email',
                    email_verified: response.user.emailVerified,
                });
            }
        } catch (error: any) {
            const errorMessage = error.message || 'auth.loginErrorMessage';
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

            // RevenueCat: передаём app user ID для привязки подписок к пользователю при регистрации
            const appUserId = await revenueCatService.getAppUserID().catch(() => null);
            if (appUserId) {
                console.log('[Auth] Register (email): sending appUserId to backend:', appUserId);
            } else {
                console.warn('[Auth] Register (email): RevenueCat appUserId is null — backend will not link subscriptions');
            }
            // Данные онбординга (если пользователь прошёл онбординг и они есть в AsyncStorage)
            const onboardingData = await loadAllOnboardingData().catch(() => ({}));
            const registerResponse = await authService.register({
                email,
                password,
                firstName: firstName ?? '',
                ...(appUserId ? { appUserId } : {}),
                ...(onboardingData.age ? { age: onboardingData.age } : {}),
                ...(onboardingData.feelingToday ? { feelingToday: onboardingData.feelingToday } : {}),
                ...(onboardingData.socialNetworks?.length ? { socialNetworks: onboardingData.socialNetworks } : {}),
                ...(onboardingData.onboardingQuestionAndAnswers && Object.keys(onboardingData.onboardingQuestionAndAnswers).length ? { onboardingQuestionAndAnswers: onboardingData.onboardingQuestionAndAnswers } : {}),
                ...(onboardingData.activities?.length ? { activities: onboardingData.activities } : {}),
                ...(onboardingData.taskTrackingMethod ? { taskTrackingMethod: onboardingData.taskTrackingMethod } : {}),
                ...(onboardingData.initSatisfactionLevel != null ? { initSatisfactionLevel: onboardingData.initSatisfactionLevel } : {}),
                ...(onboardingData.initHardnessLevel != null ? { initHardnessLevel: onboardingData.initHardnessLevel } : {}),
            });

            // RevenueCat: сразу после регистрации привязываем подписки к новому user.id (из ответа бэкенда)
            if (registerResponse.userId != null) {
                await revenueCatService.setUserID(String(registerResponse.userId));
            }

            // После успешной регистрации автоматически входим
            await login(email, password);
        } catch (error: any) {
            console.error('❌ Ошибка регистрации:', error);
            const errorMessage = error.message || 'auth.signUp.registrationErrorMessage';
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

            // RevenueCat: передаём app user ID для привязки подписок при логине через Firebase
            const appUserId = await revenueCatService.getAppUserID().catch(() => null);
            const response = await authService.firebaseAuth({
                idToken,
                authType: 'login',
                ...(appUserId ? { appUserId } : {}),
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

            // RevenueCat: appUserID должен совпадать с users.id на бэкенде
            if (response.user?.id != null) {
                await revenueCatService.setUserID(String(response.user.id));
            }
            // Обновляем профиль после успешного входа
            await refreshProfile();
            // Регистрируем нотификации после успешного входа
            await notificationService.registerDevice();

            // Инициализируем Amplitude Analytics с email и отслеживаем событие входа
            if (response.user?.email) {
                await amplitudeAnalyticsService.initialize(response.user.email);
                amplitudeAnalyticsService.setUserProperties({
                    email: response.user.email || '',
                    email_verified: true,
                    is_firebase_user: true,
                });
                amplitudeAnalyticsService.trackEvent('Login', {
                    method: 'firebase',
                });
            }
            console.log('✅ Firebase вход выполнен успешно');
        } catch (error: any) {
            console.error('❌ Ошибка Firebase входа:', error);
            const errorMessage = error.message || 'auth.googleSignInErrorMessage';
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
            onboardingQuestionAndAnswers?: Record<string, string | string[]>;
            activities?: Array<{ activityName: string; content?: string }>;
            taskTrackingMethod?: string;
            initSatisfactionLevel?: number;
            initHardnessLevel?: number;
        }
    ) => {
        try {
            setIsLoading(true);
            setError(null);

            // RevenueCat: передаём app user ID для привязки подписок при регистрации через Firebase
            const appUserId = await revenueCatService.getAppUserID().catch(() => null);
            if (appUserId) {
                console.log('[Auth] Register (Firebase): sending appUserId to backend:', appUserId);
            } else {
                console.warn('[Auth] Register (Firebase): RevenueCat appUserId is null — backend will not link subscriptions');
            }
            const response = await authService.firebaseAuth({
                idToken,
                authType: 'register',
                ...(appUserId ? { appUserId } : {}),
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

            // RevenueCat: appUserID должен совпадать с users.id на бэкенде
            if (response.user?.id != null) {
                await revenueCatService.setUserID(String(response.user.id));
            }
            // Обновляем профиль после успешной регистрации
            await refreshProfile();
            // Регистрируем нотификации после успешной регистрации
            await notificationService.registerDevice();

            // Инициализируем Amplitude Analytics с email и отслеживаем событие регистрации
            if (response.user?.email) {
                await amplitudeAnalyticsService.initialize(response.user.email);
                amplitudeAnalyticsService.setUserProperties({
                    email: response.user.email || '',
                    email_verified: true,
                    is_firebase_user: true,
                });
                amplitudeAnalyticsService.trackEvent('Onboarding Registration', {
                    method: 'firebase',
                });
            }
        } catch (error: any) {
            console.error('❌ Ошибка Firebase регистрации:', error);
            const errorMessage = error.message || 'auth.signUp.googleSignInErrorMessage';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        // Сразу сбрасываем авторизацию, чтобы хуки (тултипы, профиль, аналитика и т.д.)
        // перестали делать запросы и не стреляли ошибками после удаления токенов
        setIsAuthenticated(false);
        setUser(null);
        setIsFirebaseUser(false);
        setIsEmailVerified(false);
        setError(null);
        queryClient.cancelQueries(); // отменяем все запросы в полёте
        queryClient.clear();

        try {
            setIsLoading(true);

            // Отслеживаем событие выхода перед очисткой
            amplitudeAnalyticsService.trackEvent('User Logged Out');

            // Удаляем регистрацию нотификаций перед выходом
            await notificationService.unregisterDevice();

            // Вызываем API выхода
            await authService.logout();

            // RevenueCat: сбрасываем пользователя
            try {
                await revenueCatService.logout();
            } catch (e) {
                // не блокируем логаут приложения из-за RevenueCat
                console.warn('RevenueCat logout failed:', e);
            }

            // Очищаем токены
            await apiUtils.removeAuthTokens();

            // Очищаем флаг Firebase
            await clearFirebaseFlag();

            // Очищаем флаг emailVerified
            await clearEmailVerifiedFlag();

            // Очищаем данные пользователя в аналитике
            amplitudeAnalyticsService.clearUser();

            // Очищаем данные онбординга
            await clearOnboardingOnLogout();

            // Очищаем профиль при выходе
            await clearProfile();
        } catch (error: any) {
            // После удаления аккаунта пользователь уже не существует — бэкенд вернёт "User not found".
            // Это ожидаемо, не показываем ошибку и не логируем как ошибку.
            const isUserNotFound = error?.message === 'User not found' || error?.data?.message === 'User not found';
            if (!isUserNotFound) {
                console.error('Ошибка выхода:', error);
            }
            // Даже если API вызов не удался, очищаем локальное состояние
            await notificationService.unregisterDevice();
            try {
                await revenueCatService.logout();
            } catch (e) {
                console.warn('RevenueCat logout failed:', e);
            }
            await apiUtils.removeAuthTokens();
            await clearFirebaseFlag();
            await clearEmailVerifiedFlag();

            // Очищаем данные онбординга даже при ошибке
            await clearOnboardingOnLogout();

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
            isInitializing,
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
