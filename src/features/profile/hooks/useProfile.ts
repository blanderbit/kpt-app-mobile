import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  profileService, 
  ProfileResponse, 
  UpdateProfileRequest,
  ChangeEmailRequest,
  ConfirmEmailChangeRequest,
  ChangePasswordRequest,
  DeleteAccountRequest
} from '@shared/services/api';

// Query keys для профиля
export const profileQueryKeys = {
  profile: ['profile'] as const,
  profileData: () => [...profileQueryKeys.profile, 'data'] as const,
};

// Хук для получения профиля
export const useProfile = () => {
  const query = useQuery({
    queryKey: profileQueryKeys.profileData(),
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });

  return {
    ...query,
    refreshProfile: query.refetch,
  };
};

// Хук для обновления профиля
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
    onSuccess: (updatedProfile) => {
      // Обновляем кеш профиля
      queryClient.setQueryData(profileQueryKeys.profileData(), updatedProfile);
      
      // Инвалидируем связанные запросы
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
    onError: (error) => {
      console.error('Ошибка обновления профиля:', error);
    },
  });
};

// Хук для смены email
export const useChangeEmail = () => {
  return useMutation({
    mutationFn: (data: ChangeEmailRequest) => profileService.changeEmail(data),
    onError: (error) => {
      console.error('Ошибка смены email:', error);
    },
  });
};

// Хук для подтверждения смены email
export const useConfirmEmailChange = () => {
  return useMutation({
    mutationFn: (data: ConfirmEmailChangeRequest) => profileService.confirmEmailChange(data),
    onError: (error) => {
      console.error('Ошибка подтверждения смены email:', error);
    },
  });
};

// Хук для смены пароля
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
    onError: (error) => {
      console.error('Ошибка смены пароля:', error);
    },
  });
};

// Хук для удаления аккаунта
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DeleteAccountRequest) => profileService.deleteAccount(data),
    onSuccess: () => {
      // Очищаем все данные после удаления аккаунта
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Ошибка удаления аккаунта:', error);
    },
  });
};
