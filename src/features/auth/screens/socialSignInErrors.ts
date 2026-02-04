import { statusCodes } from '@react-native-google-signin/google-signin';

/**
 * Возвращает true, если ошибка означает отмену входа пользователем (закрыл экран Apple/Google),
 * а не реальную ошибку. В таких случаях не показываем алерт.
 */
export function isSocialSignInCancelError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const e = error as { code?: string | number; message?: string };
  // Apple: пользователь закрыл экран Sign in with Apple (iOS/Android)
  if (e.code === '1001' || e.code === 1001) return true;
  // Google: пользователь отменил выбор аккаунта
  if (statusCodes && e.code === statusCodes.SIGN_IN_CANCELLED) return true;
  if (e.message?.toLowerCase().includes('cancel')) return true;
  return false;
}
