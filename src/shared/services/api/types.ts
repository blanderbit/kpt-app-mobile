// Базовые типы для API

// Общие типы ответов
export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy?: string[][];
    searchBy?: string[];
    search?: string;
    select?: string[];
    filter?: Record<string, any>;
  };
  links: {
    first?: string;
    previous?: string;
    current?: string;
    next?: string;
    last?: string;
  };
}

// Типы для аутентификации
export interface LoginRequest {
  email: string;
  password: string;
  /** RevenueCat app user ID (e.g. $RCAnonymousID:xxx) to link existing subscriptions to this user after login */
  appUserId?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Ответ POST /auth/register (201) */
export interface RegisterResponse {
  message: string;
  userId: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  /** RevenueCat app user ID to link existing subscriptions to this user after register */
  appUserId?: string;
  age?: string;
  feelingToday?: string;
  socialNetworks?: string[];
  onboardingQuestionAndAnswers?: Record<string, string | string[]>;
  activities?: Array<{
    activityName: string;
    content?: string;
  }>;
  taskTrackingMethod?: string;
  initSatisfactionLevel?: number;
  initHardnessLevel?: number;
}

export interface FirebaseAuthRequest {
  idToken: string;
  authType?: 'login' | 'register';
  /** RevenueCat app user ID to link existing subscriptions to this user */
  appUserId?: string;
  age?: string;
  feelingToday?: string;
  socialNetworks?: string[];
  onboardingQuestionAndAnswers?: Record<string, string>;
  activities?: Array<{
    activityName: string;
    content?: string;
  }>;
  taskTrackingMethod?: string;
  initSatisfactionLevel?: number;
  initHardnessLevel?: number;
}

export interface FirebaseAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    firstName?: string;
    avatarUrl?: string;
    firebaseUid: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailProfileRequest {
  code: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  accessToken?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: number;
  email: string;
  passwordHash: string;
  firstName: string;
  avatarUrl: string;
  emailVerified: boolean;
  hasPaidSubscription?: boolean;
  googleId?: string;
  firebaseUid?: string;
  appleId?: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}

// Типы для профиля
export interface ProfileResponse {
  id: number;
  email: string;
  firstName: string;
  avatarUrl: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  avatarUrl?: string;
  theme?: 'light' | 'dark' | 'system';
}

export interface ChangeEmailRequest {
  newEmail: string;
  password: string;
}

export interface ConfirmEmailChangeRequest {
  code: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  confirm: boolean;
}

// Типы для активностей
export interface Activity {
  id: number;
  activityName: string;
  activityType: string;
  content?: string;
  position: number;
  status: 'active' | 'closed';
  /** Whether this activity was created from a suggested activity */
  fromSuggestedActivity?: boolean;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  rateActivities?: RateActivity[];
}

export interface ActivityResponse {
  id: number;
  userId: number;
  activityName: string;
  activityType: string;
  content?: string;
  position: number;
  status: 'active' | 'closed';
  /** Whether this activity was created from a suggested activity */
  fromSuggestedActivity?: boolean;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  rateActivities: RateActivity[];
}

export interface CreateActivityRequest {
  activityName: string;
  content?: string;
  position?: number;
}

export interface UpdateActivityRequest {
  activityName?: string;
  content?: string;
  position?: number;
}

export interface RateActivity {
  id: number;
  activityId: number;
  satisfactionLevel: number;
  hardnessLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRateActivityRequest {
  activityId: number;
  satisfactionLevel: number;
  hardnessLevel: number;
}

export interface CloseActivityRequest {
  satisfactionLevel: number;
  hardnessLevel: number;
}

export interface ActivityStatisticsResponse {
  averageSatisfactionLevel: number;
  averageHardnessLevel: number;
  totalRatedActivities: number;
  relationship: string;
  satisfactionPercentage: number;
  hardnessPercentage: number;
}

// Типы для трекинга настроения
export interface MoodTrackerResponse {
  id: number;
  moodType: string;
  moodTypeDetails?: {
    id: string;
    name: string;
    description: string;
    emoji: string;
    color: string;
    score: number;
    category: string;
  };
  notes?: string;
  moodDate: string;
  moodSurveys?: Array<{
    id: number;
    title: string;
    isArchived: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMoodTrackerRequest {
  moodType: string;
  notes?: string;
  moodSurveyIds?: number[];
}

export interface UpdateMoodTrackerRequest {
  moodType?: string;
  notes?: string;
  moodSurveyIds?: number[];
}

// Тип для настроения
export interface MoodType {
  id: string;
  name: string;
  description: string;
  emoji: string;
  color: string;
  score: number;
  category: string;
}

// Типы для опросников настроения
export interface MoodSurvey {
  id: number;
  title: string;
  isArchived: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  archivedBy: string | null;
}

// Типы для социальных сетей
export interface SocialNetwork {
  id: string;
  name: string;
  description: string;
  svg: string;
  color: string;
  category: string;
}

// Типы для вопросов онбординга
export interface OnboardingAnswer {
  id: string;
  text: string;
  subtitle: string;
  icon: string;
}

export interface OnboardingQuestion {
  stepName: string;
  stepQuestion: string;
  answers: OnboardingAnswer[];
  inputType: 'single' | 'multiple';
  required: boolean;
}

export interface GenerateActivityRecommendationsRequest {
  socialNetworks: string[];
  onboardingQuestionAndAnswers: Record<string, string | string[]>;
  feelingToday: string;
  satisfactionLevel: number;
  hardnessLevel: number;
  count?: string;
}

export interface RegisterDeviceTokenRequest {
  token: string;
  platform: string;
  deviceId?: string;
}

export interface RegisterDeviceTokenResponse {
  message: string;
  success: boolean;
}

export interface ActivityRecommendation {
  activityName: string;
  content: string;
  confidenceScore: number;
  reasoning: string;
  /** Код типа (например fitness, health) — для подстановки в ActivityLabel */
  activityType?: string;
  /** Уже переведённое название типа с бэкенда (например «Фитнес и спорт») */
  activityTypeLabel?: string;
}

export interface ActivityRecommendationsResponse {
  recommendations: ActivityRecommendation[];
  overallReasoning: string;
  totalCount: number;
}

// Тип для активности
export interface ActivityType {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  category: string;
  icon: string; // Эмодзи или название иконки
  color: string;
}

// Тип для тултипа (удален старый формат)

// Типы для предложенных активностей
export interface SuggestedActivity {
  id: number;
  activityName: string;
  activityType: string;
  content?: string | Record<string, any>;
  isUsed: boolean;
  confidenceScore?: string;
  reasoning?: string;
  suggestedDate?: string;
  usedAt?: string | null;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddSuggestedActivityRequest {
  id: number;
  notes?: string;
}

export interface RefreshSuggestedActivitiesRequest {
  date?: string;
}

// Типы для аналитики
export interface AnalyticsOverview {
  completedTasksDays: number;
  completedTasksCount: number;
  rateActivityAverages: {
    satisfactionLevel: number;
    hardnessLevel: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
}

// Типы для администрирования
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  admin: {
    id: number;
    email: string;
    firstName: string;
    roles: string[];
  };
}

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  usersThisMonth: number;
  usersLastMonth: number;
}

// Типы для языков
export interface LanguageResponse {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  isActive: boolean;
  isDefault: boolean;
  version: string;
  googleDriveFileId?: string;
  googleDriveFileUrl?: string;
  googleDriveFolderId?: string;
  googleDriveFolderUrl?: string;
  totalKeys: number;
  totalTranslations: number;
  completionRate: number;
  notes?: string;
  translations?: {
    translations: string; // JSON строка с переводами
    language?: {
      code: string;
      name: string;
      svgLogo?: string;
      nativeName: string;
      direction: string;
      isActive: string;
      isDefault: string;
      version: string;
    };
  };
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  lastSyncAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  archivedBy?: string;
}

// Типы для подсказок
export interface Tooltip {
  id: number;
  type: 'swipe' | 'text';
  page: string;
  json: {
    title: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTooltipRequest {
  type: 'swipe' | 'text';
  page: string;
  json: Record<string, any>;
}

export interface UpdateTooltipRequest {
  type?: 'swipe' | 'text';
  page?: string;
  json?: Record<string, any>;
}

// Типы для фильтров и поиска
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
}

export interface SearchParams {
  search?: string;
  searchBy?: string[];
  sortBy?: string[];
  select?: string;
  filter?: Record<string, any>;
}

// Новые типы из swagger spec

// Тип для изменения позиции активности
export interface ChangePositionRequest {
  position: number;
}

// Типы для статей (Articles)
export interface FileDto {
  id: number;
  fileUrl: string;
  fileKey: string;
  fileName: string;
  mimeType: string;
  size: number;
}

export interface ArticleResponse {
  id: number;
  title: string;
  text: string;
  status: 'active' | 'archived' | 'available';
  files?: FileDto[];
  createdAt: string;
  updatedBy?: string | null;
  updatedAt: string;
  archivedAt?: string | null;
  archivedBy?: string | null;
  isHidden?: boolean;
}

// Типы для опросов (Surveys)
export interface SurveyQuestionOption {
  id: string;
  text: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options: SurveyQuestionOption[];
}

export interface SurveyResponse {
  id: number;
  title: string;
  description?: string | null;
  questions?: SurveyQuestion[];
  status: 'active' | 'archived' | 'available';
  language?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
  archivedBy?: string | null;
  isCompleted?: boolean;
  file?: FileDto | null;
}

export interface UpdateSurveyDto {
  title?: string;
  description?: string;
  questions?: SurveyQuestion[];
  language?: string;
  removeFileId?: number;
}

export interface SurveyAnswer {
  questionId: string;
  answer: string | string[];
}

export interface SubmitSurveyAnswerRequest {
  answers: SurveyAnswer[];
}

export interface SubmitSurveyAnswerResponse {
  success: boolean;
  message: string;
}

// Типы для подписок (Subscriptions)
export interface Subscription {
  id?: string;
  userId?: number;
  subscriptionId?: string;
  status?: string;
  productId?: string;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type SubscriptionPlanInterval = 'monthly' | 'yearly' | 'unknown';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'pending' | 'unknown';

export interface SubscriptionSummaryDto {
  productId?: string;
  planInterval: SubscriptionPlanInterval;
  planIntervalLabel: string;
  name?: string;
  description?: string;
  status: SubscriptionStatus;
  statusLabel: string;
  periodEnd?: string;
}

/** Ответ GET /subscriptions/latest/summary — подписка или null */
export interface SubscriptionSummaryResponse {
  subscription: SubscriptionSummaryDto | null;
}

export interface CancelSubscriptionRequest {
  subscriptionId: string;
  reason?: string;
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message: string;
}

// Типы для статистики настроения
export interface MoodTrackerStatsResponse {
  period: {
    startDate: string;
    endDate: string;
  };
  totalEntries: number;
  averageMoodScore: number;
  moodDistribution: Array<{
    moodType: string;
    count: number;
    percentage: number;
  }>;
  moodByDate: Array<{
    date: string;
    moodType: string;
    moodScore: number;
  }>;
}

// Типы для бэкапов
export interface BackupResponse {
  success: boolean;
  backupPath?: string;
  fileId?: string;
  message: string;
}

export interface BackupFile {
  id: string;
  name: string;
  size: number;
  createdTime: string;
  modifiedTime: string;
}

export interface BackupListResponse {
  success: boolean;
  backups: BackupFile[];
  message: string;
}

export interface BackupHealthResponse {
  mysqldumpAvailable: boolean;
  googleDriveAvailable: boolean;
  message: string;
}

