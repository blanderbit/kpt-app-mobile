import { authService } from '@shared/services/api/client';
import { ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest } from '@shared/services/api/types';

export class AuthService {
  async forgotPassword(email: string): Promise<{ message: string }> {
    const request: ForgotPasswordRequest = { email };
    return authService.forgotPassword(request);
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    const request: ResetPasswordRequest = { email, code, newPassword };
    return authService.resetPassword(request);
  }

  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    const request: VerifyEmailRequest = { email, code };
    return authService.verifyEmail(request);
  }
}

export const authApiService = new AuthService();

