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
  email: string;
  code: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
  confirm: boolean;
}

// Типы для активностей
export interface Activity {
  id: number;
  activityName: string;
  activityType: string;
  content?: Record<string, any>;
  isPublic: boolean;
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
  content?: Record<string, any>;
  isPublic: boolean;
  status: 'active' | 'closed';
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  rateActivities: RateActivity[];
}

export interface CreateActivityRequest {
  activityName: string;
  content?: Record<string, any>;
  isPublic?: boolean;
}

export interface UpdateActivityRequest {
  activityName?: string;
  content?: Record<string, any>;
  isPublic?: boolean;
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateMoodTrackerRequest {
  moodType: string;
  notes?: string;
}

export interface UpdateMoodTrackerRequest {
  moodType?: string;
  notes?: string;
}

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
  json: Record<string, any>;
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

