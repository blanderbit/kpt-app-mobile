import { useState } from 'react';
import { useAuth } from '@app/hooks/auth.hook';
import { signInGoogle, signInAppleIos, signInAppleAndroid } from '@features/auth/screens/firebaseAuth';
import { Platform } from 'react-native';

export const useFirebaseAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithFirebase } = useAuth();

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Получаем Firebase токен от Google
      const firebaseToken = await signInGoogle();
      
      if (!firebaseToken) {
        throw new Error('Не удалось получить токен от Google');
      }
      
      console.log('✅ Firebase токен получен:', firebaseToken.substring(0, 50) + '...');
      
      // Логинимся в ваше API с Firebase токеном
      await loginWithFirebase(firebaseToken);
      
      return firebaseToken;
    } catch (error: any) {
      console.error('❌ Ошибка Google Sign-In:', error);
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

      console.log('🍎 Начинаем Apple Sign-In...');
      
      // Получаем Firebase токен от Apple
      const firebaseToken = Platform.OS === "ios" 
        ? await signInAppleIos() 
        : await signInAppleAndroid();
      
      if (!firebaseToken) {
        throw new Error('Не удалось получить токен от Apple');
      }
      
      console.log('✅ Firebase токен получен:', firebaseToken.substring(0, 50) + '...');
      
      // Логинимся в ваше API с Firebase токеном
      await loginWithFirebase(firebaseToken);
      
      console.log('✅ Apple Sign-In завершен успешно');
      
      return firebaseToken;
    } catch (error: any) {
      console.error('❌ Ошибка Apple Sign-In:', error);
      const errorMessage = error.message || 'Не удалось войти через Apple';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    signInWithApple,
    isLoading,
    error,
    clearError: () => setError(null)
  };
};
