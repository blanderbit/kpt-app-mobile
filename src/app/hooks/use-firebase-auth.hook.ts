import { useState } from 'react';
import { useAuth } from '@app/hooks/auth.hook';
import { signInGoogle, signInAppleIos, signInAppleAndroid } from '@features/auth/screens/firebaseAuth';
import { Platform } from 'react-native';
import { loadAllOnboardingData } from '@shared/utils/onboardingStorage';

export const useFirebaseAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithFirebase, registerWithFirebase } = useAuth();

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Получаем Firebase токен от Google
      const firebaseToken = await signInGoogle();
      
      if (!firebaseToken) {
        throw new Error('Не удалось получить токен от Google');
      }
      
      // Логинимся в ваше API с Firebase токеном
      await loginWithFirebase(firebaseToken);
      
      return firebaseToken;
    } catch (error: any) {
      const errorMessage = error.message || 'Не удалось войти через Google';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Получаем Firebase токен от Apple
      const firebaseToken = Platform.OS === "ios" 
        ? await signInAppleIos() 
        : await signInAppleAndroid();
      
      if (!firebaseToken) {
        throw new Error('Не удалось получить токен от Apple');
      }
      
      // Логинимся в ваше API с Firebase токеном
      await loginWithFirebase(firebaseToken);
      
      return firebaseToken;
    } catch (error: any) {
      const errorMessage = error.message || 'Не удалось войти через Apple';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithGoogle = async () => {
    console.log('🔵 [useFirebaseAuth] signUpWithGoogle called');
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔵 [useFirebaseAuth] Getting Firebase token from Google...');
      // Получаем Firebase токен от Google
      const firebaseToken = await signInGoogle();
      
      if (!firebaseToken) {
        throw new Error('Не удалось получить токен от Google');
      }
      
      console.log('🔵 [useFirebaseAuth] Firebase token received, loading onboarding data...');
      // Загружаем данные онбординга
      const onboardingData = await loadAllOnboardingData();
      console.log('🔵 [useFirebaseAuth] Onboarding data loaded:', onboardingData);
      console.log('🔵 [useFirebaseAuth] feelingToday:', onboardingData.feelingToday);
      
      console.log('🔵 [useFirebaseAuth] Calling registerWithFirebase...');
      // Регистрируемся в ваше API с Firebase токеном
      await registerWithFirebase(firebaseToken, onboardingData);
      
      console.log('✅ [useFirebaseAuth] Registration successful');
      return firebaseToken;
    } catch (error: any) {
      console.error('❌ [useFirebaseAuth] signUpWithGoogle error:', error);
      const errorMessage = error.message || 'Не удалось зарегистрироваться через Google';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUpWithApple = async () => {
    console.log('🍎 [useFirebaseAuth] signUpWithApple called');
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🍎 [useFirebaseAuth] Getting Firebase token from Apple...');
      // Получаем Firebase токен от Apple
      const firebaseToken = Platform.OS === "ios" 
        ? await signInAppleIos() 
        : await signInAppleAndroid();
      
      if (!firebaseToken) {
        throw new Error('Не удалось получить токен от Apple');
      }
      
      console.log('🍎 [useFirebaseAuth] Firebase token received, loading onboarding data...');
      // Загружаем данные онбординга
      const onboardingData = await loadAllOnboardingData();
      console.log('🍎 [useFirebaseAuth] Onboarding data loaded:', onboardingData);
      console.log('🍎 [useFirebaseAuth] feelingToday:', onboardingData.feelingToday);
      
      console.log('🍎 [useFirebaseAuth] Calling registerWithFirebase...');
      // Регистрируемся в ваше API с Firebase токеном
      await registerWithFirebase(firebaseToken, onboardingData);
      
      console.log('✅ [useFirebaseAuth] Registration successful');
      return firebaseToken;
    } catch (error: any) {
      console.error('❌ [useFirebaseAuth] signUpWithApple error:', error);
      const errorMessage = error.message || 'Не удалось зарегистрироваться через Apple';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    signInWithApple,
    signUpWithGoogle,
    signUpWithApple,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
