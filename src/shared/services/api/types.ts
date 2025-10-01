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
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface FirebaseAuthRequest {
  idToken: string;
}

export interface FirebaseAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
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
  lastName: string;
  avatarUrl: string;
  emailVerified: boolean;
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
  lastName: string;
  avatarUrl: string;
  theme: 'light' | 'dark' | 'system';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
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
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityResponse {
  id: number;
  userId: number;
  activityName: string;
  activityType: string;
  content?: string;
  position: number;
  status: 'active' | 'closed';
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
  content?: Record<string, any>;
  isUsed: boolean;
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
    lastName: string;
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
  googleDriveFileId: string;
  googleDriveFileUrl: string;
  googleDriveFolderId: string;
  googleDriveFolderUrl: string;
  totalKeys: number;
  totalTranslations: number;
  completionRate: number;
  notes?: string;
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

// Типы для очереди
export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  total: number;
}

export interface QueueStatus {
  status: 'active' | 'idle' | 'error';
  timestamp: string;
  stats: QueueStats;
  error?: string;
}

// Новые типы из swagger spec

// Тип для изменения позиции активности
export interface ChangePositionRequest {
  position: number;
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

