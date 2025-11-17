import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from './config';
import {
  authService,
  profileService,
  moodTrackerService,
  socialNetworkService,
  onboardingService,
  activityService,
  suggestedActivityService,
  analyticsService,
  tooltipService,
  articleService,
  surveyService,
} from './client';
import {
  LoginRequest,
  RegisterRequest,
  FirebaseAuthRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  VerifyEmailProfileRequest,
  RefreshTokenRequest,
  UpdateProfileRequest,
  ChangeEmailRequest,
  ConfirmEmailChangeRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  CreateMoodTrackerRequest,
  UpdateMoodTrackerRequest,
  MoodType,
  ActivityType,
  CreateActivityRequest,
  UpdateActivityRequest,
  ChangePositionRequest,
  CreateRateActivityRequest,
  AddSuggestedActivityRequest,
  RefreshSuggestedActivitiesRequest,
  GenerateActivityRecommendationsRequest,
  ActivityRecommendationsResponse,
  RegisterDeviceTokenRequest,
  RegisterDeviceTokenResponse,
  SearchParams,
  PaginationParams,
  DateRangeParams,
} from './types';

// Query keys
export const queryKeys = {
  // Auth
  auth: ['auth'] as const,
  currentUser: () => [...queryKeys.auth, 'currentUser'] as const,
  
  // Profile
  profile: ['profile'] as const,
  profileData: () => [...queryKeys.profile, 'data'] as const,
  
  // Mood Tracker
  moodTracker: ['moodTracker'] as const,
  currentMood: () => [...queryKeys.moodTracker, 'current'] as const,
  moodLast7Days: () => [...queryKeys.moodTracker, 'last7Days'] as const,
  moodForDate: (date: string) => [...queryKeys.moodTracker, 'date', date] as const,
  moodForPeriod: (startDate: string, endDate: string) => [...queryKeys.moodTracker, 'period', startDate, endDate] as const,
  allMoods: () => [...queryKeys.moodTracker, 'all'] as const,
  moodTypes: () => [...queryKeys.moodTracker, 'types'] as const,
  moodSurveys: () => [...queryKeys.moodTracker, 'surveys'] as const,
  
  // Social Networks
  socialNetworks: ['socialNetworks'] as const,
  
  // Onboarding
  onboarding: ['onboarding'] as const,
  onboardingQuestions: () => [...queryKeys.onboarding, 'questions'] as const,
  
  // Activities
  activities: ['activities'] as const,
  activityTypes: () => [...queryKeys.activities, 'types'] as const,
  myActivities: (params?: SearchParams & PaginationParams) => [...queryKeys.activities, 'my', params] as const,
  activityById: (id: number) => [...queryKeys.activities, 'byId', id] as const,
  recommendedTypes: (name: string) => [...queryKeys.activities, 'recommended', name] as const,
  activityTypesByCategory: (category: string) => [...queryKeys.activities, 'byCategory', category] as const,
  
  // Suggested Activities
  suggestedActivities: ['suggestedActivities'] as const,
  suggestedActivitiesForDate: (date?: string) => [...queryKeys.suggestedActivities, 'forDate', date] as const,
  
  // Analytics
  analytics: ['analytics'] as const,
  completedTasksDays: (startDate?: string, endDate?: string) => [...queryKeys.analytics, 'completedTasksDays', startDate, endDate] as const,
  completedTasksCount: (startDate?: string, endDate?: string) => [...queryKeys.analytics, 'completedTasksCount', startDate, endDate] as const,
  rateActivityAverages: (startDate?: string, endDate?: string) => [...queryKeys.analytics, 'rateActivityAverages', startDate, endDate] as const,
  analyticsOverview: (startDate?: string, endDate?: string) => [...queryKeys.analytics, 'overview', startDate, endDate] as const,
  
  // Tooltips
  tooltips: ['tooltips'] as const,
  tooltipsByPage: (page: string) => [...queryKeys.tooltips, 'byPage', page] as const,
  tooltipsByPageAndType: (page: string, type: string) => [...queryKeys.tooltips, 'byPageAndType', page, type] as const,
  
  // Notifications
  notifications: ['notifications'] as const,
  deviceToken: () => [...queryKeys.notifications, 'deviceToken'] as const,
  
  // Articles
  articles: ['articles'] as const,
  randomArticle: () => [...queryKeys.articles, 'random'] as const,
  articleById: (id: number) => [...queryKeys.articles, 'byId', id] as const,
  
  // Surveys
  surveys: ['surveys'] as const,
  randomSurvey: () => [...queryKeys.surveys, 'random'] as const,
  surveyById: (id: number) => [...queryKeys.surveys, 'byId', id] as const,
};

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      // Сохраняем токены
      queryClient.setQueryData(queryKeys.currentUser(), data.user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
  });
};

export const useFirebaseAuth = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: FirebaseAuthRequest) => authService.firebaseAuth(data),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.currentUser(), data.user);
    },
  });
};

export const useGenerateActivityRecommendations = () => {
  return useMutation<ActivityRecommendationsResponse, ApiError, GenerateActivityRecommendationsRequest>({
    mutationFn: (data) => authService.generateActivityRecommendations(data),
  });
};

export const useRegisterDeviceToken = () => {
  return useMutation<RegisterDeviceTokenResponse, ApiError, RegisterDeviceTokenRequest>({
    mutationFn: (data) => authService.registerDeviceToken(data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) => authService.forgotPassword(data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
  });
};

export const useRefreshToken = () => {
  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => authService.refreshToken(data),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Profile hooks
export const useProfile = () => {
  return useQuery({
    queryKey: queryKeys.profileData(),
    queryFn: () => profileService.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => profileService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileData() });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser() });
    },
  });
};

export const useChangeEmail = () => {
  return useMutation({
    mutationFn: (data: ChangeEmailRequest) => profileService.changeEmail(data),
  });
};

export const useConfirmEmailChange = () => {
  return useMutation({
    mutationFn: (data: ConfirmEmailChangeRequest) => profileService.confirmEmailChange(data),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => profileService.changePassword(data),
  });
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: VerifyEmailProfileRequest) => profileService.verifyEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profileData() });
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser() });
    },
  });
};

export const useSendVerificationEmail = () => {
  return useMutation({
    mutationFn: () => profileService.sendVerificationEmail(),
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: DeleteAccountRequest) => profileService.deleteAccount(data),
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Mood Tracker hooks
export const useSetMoodForDay = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMoodTrackerRequest) => moodTrackerService.setMoodForDay(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moodTracker });
    },
  });
};

export const useCurrentMood = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.currentMood(),
    queryFn: () => moodTrackerService.getCurrentMood(),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: options?.enabled ?? true, // По умолчанию включен, но можно отключить
  });
};

export const useMoodForLast7Days = () => {
  return useQuery({
    queryKey: queryKeys.moodLast7Days(),
    queryFn: () => moodTrackerService.getMoodForLast7Days(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMoodForDate = (date: string) => {
  return useQuery({
    queryKey: queryKeys.moodForDate(date),
    queryFn: () => moodTrackerService.getMoodForDate(date),
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateMoodForDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ date, data }: { date: string; data: UpdateMoodTrackerRequest }) => 
      moodTrackerService.updateMoodForDate(date, data),
    onSuccess: (_, { date }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moodForDate(date) });
      queryClient.invalidateQueries({ queryKey: queryKeys.moodTracker });
    },
  });
};

export const useDeleteMoodForDate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (date: string) => moodTrackerService.deleteMoodForDate(date),
    onSuccess: (_, date) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.moodForDate(date) });
      queryClient.invalidateQueries({ queryKey: queryKeys.moodTracker });
    },
  });
};

export const useMoodForPeriod = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: queryKeys.moodForPeriod(startDate, endDate),
    queryFn: () => moodTrackerService.getMoodForPeriod(startDate, endDate),
    enabled: !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAllMoods = () => {
  return useQuery({
    queryKey: queryKeys.allMoods(),
    queryFn: () => moodTrackerService.getAllMoodTrackers(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMoodTypes = () => {
  return useQuery({
    queryKey: queryKeys.moodTypes(),
    queryFn: () => moodTrackerService.getAllMoodTypes(),
    staleTime: 30 * 60 * 1000, // 30 минут, так как типы настроения редко изменяются
  });
};

export const useMoodSurveys = () => {
  return useQuery({
    queryKey: queryKeys.moodSurveys(),
    queryFn: () => moodTrackerService.getMoodSurveys(),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

// Social Network hooks
export const useSocialNetworks = () => {
  return useQuery({
    queryKey: queryKeys.socialNetworks,
    queryFn: () => socialNetworkService.getSocialNetworks(),
    staleTime: 30 * 60 * 1000, // 30 минут, так как социальные сети редко изменяются
  });
};

// Onboarding hooks
export const useOnboardingQuestions = () => {
  return useQuery({
    queryKey: queryKeys.onboardingQuestions(),
    queryFn: () => onboardingService.getOnboardingQuestions(),
    staleTime: 30 * 60 * 1000, // 30 минут, так как вопросы онбординга редко изменяются
  });
};

// Activity hooks
export const useMyActivities = (params?: SearchParams & PaginationParams) => {
  return useQuery({
    queryKey: queryKeys.myActivities(params),
    queryFn: () => activityService.getMyActivities(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateActivityRequest) => activityService.createActivity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
};

export const useActivityById = (id: number) => {
  return useQuery({
    queryKey: queryKeys.activityById(id),
    queryFn: () => activityService.getActivityById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useActivityTypes = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.activityTypes(),
    queryFn: () => activityService.getActivityTypes(),
    staleTime: 30 * 60 * 1000, // 30 минут, так как типы активностей редко изменяются
    enabled: options?.enabled ?? true, // По умолчанию включен, но можно отключить
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActivityRequest }) => 
      activityService.updateActivity(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityById(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => activityService.deleteActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
};

export const useChangeActivityPosition = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChangePositionRequest }) => 
      activityService.changeActivityPosition(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityById(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
};

export const useCloseActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateRateActivityRequest }) => 
      activityService.closeActivity(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.activityById(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
};


export const useRecommendedTypes = (name: string, limit?: number) => {
  return useQuery({
    queryKey: queryKeys.recommendedTypes(name),
    queryFn: () => activityService.getRecommendedTypes(name, limit),
    enabled: !!name,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useActivityTypesByCategory = (category: string) => {
  return useQuery({
    queryKey: queryKeys.activityTypesByCategory(category),
    queryFn: () => activityService.getActivityTypesByCategory(category),
    enabled: !!category,
    staleTime: 30 * 60 * 1000,
  });
};

export const useSearchActivityTypes = (query: string) => {
  return useQuery({
    queryKey: [...queryKeys.activityTypes(), 'search', query],
    queryFn: () => activityService.searchActivityTypes(query),
    enabled: !!query && query.length > 2,
    staleTime: 10 * 60 * 1000,
  });
};

// Suggested Activities hooks
export const useSuggestedActivities = (date?: string) => {
  console.log('🎯 [useSuggestedActivities] Запрос suggested activities, date:', date);
  
  return useQuery({
    queryKey: queryKeys.suggestedActivitiesForDate(date),
    queryFn: async () => {
      console.log('🎯 [useSuggestedActivities] Выполнение запроса для date:', date);
      const result = await suggestedActivityService.getSuggestedActivities(date);
      console.log('🎯 [useSuggestedActivities] ✅ Получены suggested activities:', JSON.stringify(result, null, 2));
      console.log('🎯 [useSuggestedActivities] Количество:', result?.length || 0);
      return result;
    },
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      console.log('🎯 [useSuggestedActivities] onSuccess - данные:', data);
    },
    onError: (error) => {
      console.error('🎯 [useSuggestedActivities] ❌ Ошибка:', error);
    },
  });
};

export const useAddSuggestedActivityToActivities = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddSuggestedActivityRequest) => 
      suggestedActivityService.addSuggestedActivityToActivities(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suggestedActivities });
      queryClient.invalidateQueries({ queryKey: queryKeys.activities });
    },
  });
};

export const useDeleteSuggestedActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => suggestedActivityService.deleteSuggestedActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suggestedActivities });
    },
  });
};

export const useRefreshSuggestedActivities = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RefreshSuggestedActivitiesRequest) => 
      suggestedActivityService.refreshSuggestedActivities(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.suggestedActivities });
    },
  });
};

// Analytics hooks
export const useCompletedTasksDays = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: queryKeys.completedTasksDays(startDate, endDate),
    queryFn: () => analyticsService.getCompletedTasksDays(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompletedTasksCount = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: queryKeys.completedTasksCount(startDate, endDate),
    queryFn: () => analyticsService.getCompletedTasksCount(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRateActivityAverages = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: queryKeys.rateActivityAverages(startDate, endDate),
    queryFn: () => analyticsService.getRateActivityAverages(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAnalyticsOverview = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: queryKeys.analyticsOverview(startDate, endDate),
    queryFn: () => analyticsService.getAnalyticsOverview(startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

// Tooltip hooks
export const useTooltipsByPage = (page: string) => {
  console.log('🔔 [useTooltipsByPage] Вызов хука с page:', page);
  console.log('🔔 [useTooltipsByPage] Query key:', queryKeys.tooltipsByPage(page));
  console.log('🔔 [useTooltipsByPage] Enabled:', !!page);
  
  const queryResult = useQuery({
    queryKey: queryKeys.tooltipsByPage(page),
    queryFn: () => {
      console.log('🔔 [useTooltipsByPage] Выполнение queryFn для page:', page);
      return tooltipService.getTooltipsByPage(page);
    },
    enabled: !!page,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Логируем результат запроса
  if (queryResult.data) {
    console.log('🔔 [useTooltipsByPage] ✅ Данные получены:');
    console.log('🔔 [useTooltipsByPage] Количество тултипов:', queryResult.data?.length || 0);
    console.log('🔔 [useTooltipsByPage] Полный ответ data:', JSON.stringify(queryResult.data, null, 2));
  }
  if (queryResult.error) {
    console.error('🔔 [useTooltipsByPage] ❌ Ошибка в хуке:', queryResult.error);
  }
  console.log('🔔 [useTooltipsByPage] Статус запроса:', {
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    isSuccess: queryResult.isSuccess,
    isFetching: queryResult.isFetching,
  });

  return queryResult;
};

export const useTooltipsByPageAndType = (page: string, type: string) => {
  return useQuery({
    queryKey: queryKeys.tooltipsByPageAndType(page, type),
    queryFn: () => tooltipService.getTooltipsByPageAndType(page, type),
    enabled: !!page && !!type,
    staleTime: 30 * 60 * 1000,
  });
};

export const useCloseTooltip = () => {
  return useMutation({
    mutationFn: (tooltipId: number) => tooltipService.closeTooltip(tooltipId),
  });
};

// Article hooks
export const useRandomArticle = () => {
  return useQuery({
    queryKey: queryKeys.randomArticle(),
    queryFn: () => articleService.getRandomArticle(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useArticleById = (id: number) => {
  console.log('📰 [useArticleById] Запрос статьи с ID:', id);
  
  const queryResult = useQuery({
    queryKey: queryKeys.articleById(id),
    queryFn: async () => {
      console.log('📰 [useArticleById] Выполнение запроса для ID:', id);
      const result = await articleService.getArticleById(id);
      console.log('📰 [useArticleById] ✅ Получена статья:', JSON.stringify(result, null, 2));
      return result;
    },
    enabled: !!id && !isNaN(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (queryResult.data) {
    console.log('📰 [useArticleById] Данные в кэше:', queryResult.data);
  }
  if (queryResult.error) {
    console.error('📰 [useArticleById] ❌ Ошибка:', queryResult.error);
  }
  console.log('📰 [useArticleById] Статус запроса:', {
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    isSuccess: queryResult.isSuccess,
    isFetching: queryResult.isFetching,
  });

  return queryResult;
};

// Survey hooks
export const useRandomSurvey = () => {
  return useQuery({
    queryKey: queryKeys.randomSurvey(),
    queryFn: () => surveyService.getRandomSurvey(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSurveyById = (id: number) => {
  console.log('📋 [useSurveyById] Запрос опроса с ID:', id);
  
  const queryResult = useQuery({
    queryKey: queryKeys.surveyById(id),
    queryFn: async () => {
      console.log('📋 [useSurveyById] Выполнение запроса для ID:', id);
      const result = await surveyService.getSurveyById(id);
      console.log('📋 [useSurveyById] ✅ Получен опрос:', JSON.stringify(result, null, 2));
      return result;
    },
    enabled: !!id && !isNaN(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (queryResult.data) {
    console.log('📋 [useSurveyById] Данные в кэше:', queryResult.data);
  }
  if (queryResult.error) {
    console.error('📋 [useSurveyById] ❌ Ошибка:', queryResult.error);
  }
  console.log('📋 [useSurveyById] Статус запроса:', {
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    isSuccess: queryResult.isSuccess,
    isFetching: queryResult.isFetching,
  });

  return queryResult;
};

