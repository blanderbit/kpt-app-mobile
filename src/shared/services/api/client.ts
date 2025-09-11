import { apiClient, ApiResponse, ApiError } from './config';
import {
  // Auth types
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  FirebaseAuthRequest,
  FirebaseAuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  // Profile types
  ProfileResponse,
  UpdateProfileRequest,
  ChangeEmailRequest,
  ConfirmEmailChangeRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  // Activity types
  Activity,
  ActivityResponse,
  CreateActivityRequest,
  UpdateActivityRequest,
  CreateRateActivityRequest,
  // Mood tracker types
  MoodTrackerResponse,
  CreateMoodTrackerRequest,
  UpdateMoodTrackerRequest,
  // Suggested activities types
  SuggestedActivity,
  AddSuggestedActivityRequest,
  RefreshSuggestedActivitiesRequest,
  // Analytics types
  AnalyticsOverview,
  // Admin types
  AdminLoginRequest,
  AdminLoginResponse,
  AdminStats,
  // Language types
  LanguageResponse,
  // Tooltip types
  Tooltip,
  CreateTooltipRequest,
  UpdateTooltipRequest,
  // Common types
  PaginationParams,
  DateRangeParams,
  SearchParams,
  PaginatedResponse,
  QueueStats,
  QueueStatus,
} from './types';

// Базовый класс для API сервисов
export class ApiService {
  protected client = apiClient;

  // Обработка ошибок
  protected handleError(error: any): never {
    if (error.response) {
      // Сервер ответил с кодом ошибки
      throw {
        message: error.response.data?.message || 'Ошибка сервера',
        status: error.response.status,
        data: error.response.data,
      } as ApiError;
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      throw {
        message: 'Нет соединения с сервером',
        status: 0,
        data: null,
      } as ApiError;
    } else {
      // Что-то пошло не так при настройке запроса
      throw {
        message: error.message || 'Неизвестная ошибка',
        status: 0,
        data: null,
      } as ApiError;
    }
  }

  // Базовый метод для GET запросов
  protected async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await this.client.get<T>(url, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Базовый метод для POST запросов
  protected async post<T>(url: string, data?: any): Promise<T> {
    try {
      console.log(`🚀 POST ${url}`, { data });
      const response = await this.client.post<T>(url, data);
      console.log(`✅ POST ${url} успешно`, { response: response.data });
      return response.data;
    } catch (error) {
      console.error(`❌ POST ${url} ошибка:`, error);
      this.handleError(error);
    }
  }

  // Базовый метод для PUT запросов
  protected async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Базовый метод для DELETE запросов
  protected async delete<T>(url: string): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Сервис для аутентификации
export class AuthService extends ApiService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.post<LoginResponse>('/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/register', userData);
  }

  async firebaseAuth(firebaseData: FirebaseAuthRequest): Promise<FirebaseAuthResponse> {
    return this.post<FirebaseAuthResponse>('/auth/firebase', firebaseData);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/forgot-password', data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/reset-password', data);
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/verify-email', data);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.post<RefreshTokenResponse>('/auth/refresh', data);
  }

  async logout(): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>('/users/profile');
  }
}

// Сервис для работы с профилем
export class ProfileService extends ApiService {
  async getProfile(): Promise<ProfileResponse> {
    return this.get<ProfileResponse>('/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
    return this.put<ProfileResponse>('/profile', data);
  }

  async changeEmail(data: ChangeEmailRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/profile/change-email', data);
  }

  async confirmEmailChange(data: ConfirmEmailChangeRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/profile/confirm-email-change', data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/profile/change-password', data);
  }

  async deleteAccount(data: DeleteAccountRequest): Promise<{ message: string }> {
    return this.delete<{ message: string }>('/profile/account', data);
  }
}

// Сервис для трекинга настроения
export class MoodTrackerService extends ApiService {
  async setMoodForDay(data: CreateMoodTrackerRequest): Promise<MoodTrackerResponse> {
    return this.post<MoodTrackerResponse>('/profile/mood-tracker', data);
  }

  async getCurrentMood(): Promise<MoodTrackerResponse> {
    return this.get<MoodTrackerResponse>('/profile/mood-tracker/current');
  }

  async getMoodForLast7Days(): Promise<MoodTrackerResponse[]> {
    return this.get<MoodTrackerResponse[]>('/profile/mood-tracker/last-7-days');
  }

  async getMoodForDate(date: string): Promise<MoodTrackerResponse> {
    return this.get<MoodTrackerResponse>(`/profile/mood-tracker/date/${date}`);
  }

  async updateMoodForDate(date: string, data: UpdateMoodTrackerRequest): Promise<MoodTrackerResponse> {
    return this.put<MoodTrackerResponse>(`/profile/mood-tracker/date/${date}`, data);
  }

  async deleteMoodForDate(date: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/profile/mood-tracker/date/${date}`);
  }

  async getMoodForPeriod(startDate: string, endDate: string): Promise<MoodTrackerResponse[]> {
    return this.get<MoodTrackerResponse[]>('/profile/mood-tracker/period', { startDate, endDate });
  }

  async getAllMoodTrackers(): Promise<MoodTrackerResponse[]> {
    return this.get<MoodTrackerResponse[]>('/profile/mood-tracker/all');
  }
}

// Сервис для активностей
export class ActivityService extends ApiService {
  async getMyActivities(params?: SearchParams & PaginationParams): Promise<PaginatedResponse<Activity>> {
    return this.get<PaginatedResponse<Activity>>('/profile/activities', params);
  }

  async createActivity(data: CreateActivityRequest): Promise<ActivityResponse> {
    return this.post<ActivityResponse>('/profile/activities', data);
  }

  async getActivityById(id: number): Promise<ActivityResponse> {
    return this.get<ActivityResponse>(`/profile/activities/${id}`);
  }

  async updateActivity(id: number, data: UpdateActivityRequest): Promise<ActivityResponse> {
    return this.put<ActivityResponse>(`/profile/activities/${id}`, data);
  }

  async deleteActivity(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/profile/activities/${id}`);
  }

  async closeActivity(id: number, data: CreateRateActivityRequest): Promise<ActivityResponse> {
    return this.post<ActivityResponse>(`/profile/activities/${id}/close`, data);
  }

  async getAllActivityTypes(): Promise<string[]> {
    return this.get<string[]>('/profile/activities/types/all');
  }

  async getRecommendedTypes(name: string, limit?: number): Promise<string[]> {
    return this.get<string[]>('/profile/activities/types/recommended', { name, limit });
  }

  async getActivityTypesByCategory(category: string): Promise<string[]> {
    return this.get<string[]>(`/profile/activities/types/category/${category}`);
  }

  async searchActivityTypes(query: string): Promise<string[]> {
    return this.get<string[]>('/profile/activities/types/search', { q: query });
  }
}

// Сервис для предложенных активностей
export class SuggestedActivityService extends ApiService {
  async getSuggestedActivities(date?: string): Promise<SuggestedActivity[]> {
    return this.get<SuggestedActivity[]>('/profile/suggested-activities', { date });
  }

  async addSuggestedActivityToActivities(data: AddSuggestedActivityRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/profile/suggested-activities/add-to-activities', data);
  }

  async deleteSuggestedActivity(id: number): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/profile/suggested-activities/${id}`);
  }

  async refreshSuggestedActivities(data: RefreshSuggestedActivitiesRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/profile/suggested-activities/refresh', data);
  }
}

// Сервис для аналитики
export class AnalyticsService extends ApiService {
  async getCompletedTasksDays(startDate?: string, endDate?: string): Promise<{ count: number }> {
    return this.get<{ count: number }>('/profile/analytics/completed-tasks-days', { startDate, endDate });
  }

  async getCompletedTasksCount(startDate?: string, endDate?: string): Promise<{ count: number }> {
    return this.get<{ count: number }>('/profile/analytics/completed-tasks-count', { startDate, endDate });
  }

  async getRateActivityAverages(startDate?: string, endDate?: string): Promise<{ satisfactionLevel: number; hardnessLevel: number }> {
    return this.get<{ satisfactionLevel: number; hardnessLevel: number }>('/profile/analytics/rate-activity-averages', { startDate, endDate });
  }

  async getAnalyticsOverview(startDate?: string, endDate?: string): Promise<AnalyticsOverview> {
    return this.get<AnalyticsOverview>('/profile/analytics/overview', { startDate, endDate });
  }
}

// Сервис для администрирования
export class AdminService extends ApiService {
  async adminLogin(data: AdminLoginRequest): Promise<AdminLoginResponse> {
    return this.post<AdminLoginResponse>('/admin/login', data);
  }

  async getUsers(params?: SearchParams & PaginationParams): Promise<PaginatedResponse<User>> {
    return this.get<PaginatedResponse<User>>('/admin/users', params);
  }

  async getStats(): Promise<AdminStats> {
    return this.get<AdminStats>('/admin/stats');
  }
}

// Сервис для языков
export class LanguageService extends ApiService {
  async getAllLanguages(active?: boolean): Promise<LanguageResponse[]> {
    return this.get<LanguageResponse[]>('/admin/languages', { active });
  }

  async getLanguageById(id: string): Promise<LanguageResponse> {
    return this.get<LanguageResponse>(`/admin/languages/${id}`);
  }

  async getLanguageByCode(code: string): Promise<LanguageResponse> {
    return this.get<LanguageResponse>(`/admin/languages/code/${code}`);
  }
}

// Сервис для подсказок
export class TooltipService extends ApiService {
  async getTooltipsByPage(page: string): Promise<Tooltip[]> {
    return this.get<Tooltip[]>(`/tooltips/page/${page}`);
  }

  async getTooltipsByPageAndType(page: string, type: string): Promise<Tooltip[]> {
    return this.get<Tooltip[]>(`/tooltips/page/${page}/type/${type}`);
  }
}

// Сервис для управления очередью (только для админов)
export class QueueService extends ApiService {
  async getQueueStats(): Promise<QueueStats> {
    return this.get<QueueStats>('/admin/queue/stats');
  }

  async getQueueStatus(): Promise<QueueStatus> {
    return this.get<QueueStatus>('/admin/queue/status');
  }

  async clearQueue(): Promise<{ message: string }> {
    return this.delete<{ message: string }>('/admin/queue/clear');
  }

  async pauseQueue(): Promise<{ message: string; status: string }> {
    return this.post<{ message: string; status: string }>('/admin/queue/pause');
  }

  async resumeQueue(): Promise<{ message: string; status: string }> {
    return this.post<{ message: string; status: string }>('/admin/queue/resume');
  }
}

// Экспорт всех сервисов
export const authService = new AuthService();
export const profileService = new ProfileService();
export const moodTrackerService = new MoodTrackerService();
export const activityService = new ActivityService();
export const suggestedActivityService = new SuggestedActivityService();
export const analyticsService = new AnalyticsService();
export const adminService = new AdminService();
export const languageService = new LanguageService();
export const tooltipService = new TooltipService();
export const queueService = new QueueService();


