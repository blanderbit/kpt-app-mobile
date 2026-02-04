import { apiClient, ApiResponse, ApiError } from './config';
import {
  // Auth types
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  FirebaseAuthRequest,
  FirebaseAuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailProfileRequest,
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
  ChangePositionRequest,
  CloseActivityRequest,
  ActivityStatisticsResponse,
  // Mood tracker types
  MoodTrackerResponse,
  CreateMoodTrackerRequest,
  UpdateMoodTrackerRequest,
  MoodType,
  MoodSurvey,
  SocialNetwork,
  OnboardingQuestion,
  GenerateActivityRecommendationsRequest,
  ActivityRecommendationsResponse,
  ActivityType,
  Tooltip,
  // Suggested activities types
  SuggestedActivity,
  AddSuggestedActivityRequest,
  RefreshSuggestedActivitiesRequest,
  // Analytics types
  AnalyticsOverview,
  // Language types
  LanguageResponse,
  // Tooltip types
  CreateTooltipRequest,
  UpdateTooltipRequest,
  // Common types
  PaginationParams,
  DateRangeParams,
  SearchParams,
  PaginatedResponse,
  RegisterDeviceTokenRequest,
  RegisterDeviceTokenResponse,
  // Article types
  ArticleResponse,
  // Survey types
  SurveyResponse,
  SubmitSurveyAnswerRequest,
  SubmitSurveyAnswerResponse,
  // Subscription types
  Subscription,
  SubscriptionSummaryDto,
  SubscriptionSummaryResponse,
  CancelSubscriptionRequest,
  CancelSubscriptionResponse,
  // Mood tracker stats types
  MoodTrackerStatsResponse,
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
      const response = await this.client.post<T>(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Базовый метод для PUT запросов
  protected async put<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Базовый метод для DELETE запросов
  protected async delete<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, { data });
      return response.data;
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

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.post<RegisterResponse>('/auth/register', userData);
  }

  async firebaseAuth(firebaseData: FirebaseAuthRequest): Promise<FirebaseAuthResponse> {
    return this.post<FirebaseAuthResponse>('/auth/firebase', firebaseData);
  }

  async generateActivityRecommendations(data: GenerateActivityRecommendationsRequest): Promise<ActivityRecommendationsResponse> {
    return this.post<ActivityRecommendationsResponse>('/auth/generate-activity-recommendations', data);
  }

  async registerDeviceToken(data: RegisterDeviceTokenRequest): Promise<RegisterDeviceTokenResponse> {
    return this.post<RegisterDeviceTokenResponse>('/notifications/devices', data);
  }

  async deleteDeviceToken(token: string): Promise<void> {
    return this.delete<void>(`/notifications/devices/${token}`);
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/forgot-password', data);
  }

  async resetPassword(data: ResetPasswordRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/reset-password', data);
  }

  async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.post<RefreshTokenResponse>('/auth/refresh', data);
  }

  async logout(): Promise<{ message: string }> {
    return this.post<{ message: string }>('/auth/logout');
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>('/profile');
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
    return this.post<{ message: string }>('/profile/request-for-change/email', data);
  }

  async confirmEmailChange(data: ConfirmEmailChangeRequest): Promise<{ message: string }> {
    return this.put<{ message: string }>('/profile/email/confirm-change', data);
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return this.put<{ message: string }>('/profile/password/change', data);
  }

  async deleteAccount(data: DeleteAccountRequest): Promise<{ message: string }> {
    return this.delete<{ message: string }>('/profile/account', data);
  }

  async verifyEmail(data: VerifyEmailProfileRequest): Promise<{ message: string }> {
    return this.post<{ message: string }>('/profile/verification-email/verify-code/complete', data);
  }

  async sendVerificationEmail(): Promise<{ message: string }> {
    return this.post<{ message: string }>('/profile/email-verification/send-code');
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

  async getAllMoodTypes(): Promise<MoodType[]> {
    return this.get<MoodType[]>('/profile/mood-tracker/mood-types');
  }

  async getMoodSurveys(): Promise<MoodSurvey[]> {
    return this.get<MoodSurvey[]>('/mood-surveys');
  }

  async getMoodSurveyById(id: number): Promise<MoodSurvey> {
    return this.get<MoodSurvey>(`/mood-surveys/${id}`);
  }

  async getMoodStatsForPeriod(startDate: string, endDate: string): Promise<MoodTrackerStatsResponse> {
    return this.get<MoodTrackerStatsResponse>('/profile/mood-tracker/stats/period', { startDate, endDate });
  }
}

// Сервис для социальных сетей
export class SocialNetworkService extends ApiService {
  async getSocialNetworks(): Promise<SocialNetwork[]> {
    return this.get<SocialNetwork[]>('/public/social-networks');
  }
}

// Сервис для вопросов онбординга
export class OnboardingService extends ApiService {
  async getOnboardingQuestions(): Promise<OnboardingQuestion[]> {
    return this.get<OnboardingQuestion[]>('/public/onboarding-questions');
  }
}

// Сервис для активностей
export class ActivityService extends ApiService {
  async getActivityTypes(): Promise<ActivityType[]> {
    return this.get<ActivityType[]>('/profile/activities/types');
  }

  async getMyActivities(params?: SearchParams & PaginationParams): Promise<PaginatedResponse<Activity>> {
    return this.get<PaginatedResponse<Activity>>('/profile/activities', params);
  }

  async getArchivedActivities(params?: SearchParams & PaginationParams): Promise<PaginatedResponse<Activity>> {
    return this.get<PaginatedResponse<Activity>>('/profile/activities/archived', params);
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

  async changeActivityPosition(id: number, data: ChangePositionRequest): Promise<ActivityResponse> {
    return this.put<ActivityResponse>(`/profile/activities/${id}/position`, data);
  }

  async closeActivity(id: number, data: CloseActivityRequest): Promise<ActivityResponse> {
    return this.post<ActivityResponse>(`/profile/activities/${id}/close`, data);
  }

  async getActivityStatistics(): Promise<ActivityStatisticsResponse> {
    return this.get<ActivityStatisticsResponse>('/profile/activities/statistics');
  }

  async restoreActivity(id: number): Promise<ActivityResponse> {
    return this.post<ActivityResponse>(`/profile/activities/${id}/restore`);
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

// Сервис для языков
export class LanguageService extends ApiService {
  async getAllLanguages(active?: boolean): Promise<LanguageResponse[]> {
    return this.get<LanguageResponse[]>('/languages', { active });
  }

  async getLanguageById(id: string): Promise<LanguageResponse> {
    return this.get<LanguageResponse>(`/languages/${id}`);
  }

  async getLanguageByCode(code: string): Promise<LanguageResponse> {
    return this.get<LanguageResponse>(`/languages/code/${code}`);
  }

  /**
   * Получает переводы для языка по коду
   * Использует поле translations.translations из LanguageResponse (JSON строка)
   */
  async getTranslationsByCode(code: string): Promise<Record<string, any>> {
    try {
      const languageInfo = await this.getLanguageByCode(code);
      if (!languageInfo.translations?.translations) {
        throw new Error(`No translations found in response for language code: ${code}`);
      }
      try {
        const translations = JSON.parse(languageInfo.translations.translations);
        return translations;
      } catch {
        throw new Error(`Invalid translations JSON format for language code: ${code}`);
      }
    } catch (error: any) {
      throw error;
    }
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

  async closeTooltip(tooltipId: number): Promise<{ message: string }> {
    return this.post<{ message: string }>(`/tooltips/close/${tooltipId}`);
  }
}

// Сервис для статей
export class ArticleService extends ApiService {
  async getArticles(params?: PaginationParams): Promise<PaginatedResponse<ArticleResponse>> {
    return this.get<PaginatedResponse<ArticleResponse>>('/articles', params);
  }

  async getRandomArticle(): Promise<ArticleResponse[]> {
    return this.get<ArticleResponse[]>('/articles/random');
  }

  async getTemporaryArticles(): Promise<ArticleResponse[]> {
    return this.get<ArticleResponse[]>('/articles/temporary');
  }

  async getArticleById(id: number): Promise<ArticleResponse> {
    return this.get<ArticleResponse>(`/articles/${id}`);
  }

  async hideArticle(id: number): Promise<{ message: string }> {
    return this.post<{ message: string }>(`/articles/${id}/hide`);
  }
}

// Сервис для опросов
export class SurveyService extends ApiService {
  async getSurveys(): Promise<SurveyResponse[]> {
    return this.get<SurveyResponse[]>('/surveys');
  }

  async getRandomSurvey(): Promise<SurveyResponse[]> {
    return this.get<SurveyResponse[]>('/surveys/random');
  }

  async getTemporarySurveys(): Promise<SurveyResponse[]> {
    return this.get<SurveyResponse[]>('/surveys/temporary');
  }

  async getSurveyById(id: number): Promise<SurveyResponse> {
    return this.get<SurveyResponse>(`/surveys/${id}`);
  }

  async submitSurveyAnswer(id: number, data: SubmitSurveyAnswerRequest): Promise<SubmitSurveyAnswerResponse> {
    return this.post<SubmitSurveyAnswerResponse>(`/surveys/${id}/submit`, data);
  }
}

// Сервис для подписок
export class SubscriptionService extends ApiService {
  async getLatestSubscription(): Promise<Subscription> {
    return this.get<Subscription>('/subscriptions/latest');
  }

  async getLatestSubscriptionSummary(): Promise<SubscriptionSummaryResponse> {
    return this.get<SubscriptionSummaryResponse>('/subscriptions/latest/summary');
  }

  async cancelSubscription(data: CancelSubscriptionRequest): Promise<CancelSubscriptionResponse> {
    return this.post<CancelSubscriptionResponse>('/subscriptions/revenuecat/cancel', data);
  }

  /**
   * Синхронизация состояния подписки с бэкендом после restore.
   * Бэкенд должен перезапросить данные из RevenueCat для текущего пользователя и обновить кэш.
   */
  async syncSubscriptionWithBackend(): Promise<void> {
    return this.post<void>('/subscriptions/revenuecat/sync', {});
  }
}

// Экспорт всех сервисов
export const authService = new AuthService();
export const profileService = new ProfileService();
export const moodTrackerService = new MoodTrackerService();
export const socialNetworkService = new SocialNetworkService();
export const onboardingService = new OnboardingService();
export const activityService = new ActivityService();
export const suggestedActivityService = new SuggestedActivityService();
export const analyticsService = new AnalyticsService();
export const languageService = new LanguageService();
export const tooltipService = new TooltipService();
export const articleService = new ArticleService();
export const surveyService = new SurveyService();
export const subscriptionService = new SubscriptionService();


