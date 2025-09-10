import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  authService,
  profileService,
  moodTrackerService,
  activityService,
  suggestedActivityService,
  analyticsService,
  tooltipService,
} from './client';
import {
  LoginRequest,
  RegisterRequest,
  FirebaseAuthRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  VerifyEmailRequest,
  RefreshTokenRequest,
  UpdateProfileRequest,
  ChangeEmailRequest,
  ConfirmEmailChangeRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  CreateMoodTrackerRequest,
  UpdateMoodTrackerRequest,
  CreateActivityRequest,
  UpdateActivityRequest,
  CreateRateActivityRequest,
  AddSuggestedActivityRequest,
  RefreshSuggestedActivitiesRequest,
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
  
  // Activities
  activities: ['activities'] as const,
  myActivities: (params?: SearchParams & PaginationParams) => [...queryKeys.activities, 'my', params] as const,
  activityById: (id: number) => [...queryKeys.activities, 'byId', id] as const,
  activityTypes: () => [...queryKeys.activities, 'types'] as const,
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

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
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

export const useCurrentMood = () => {
  return useQuery({
    queryKey: queryKeys.currentMood(),
    queryFn: () => moodTrackerService.getCurrentMood(),
    staleTime: 1 * 60 * 1000, // 1 minute
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

export const useAllActivityTypes = () => {
  return useQuery({
    queryKey: queryKeys.activityTypes(),
    queryFn: () => activityService.getAllActivityTypes(),
    staleTime: 30 * 60 * 1000, // 30 minutes
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
  return useQuery({
    queryKey: queryKeys.suggestedActivitiesForDate(date),
    queryFn: () => suggestedActivityService.getSuggestedActivities(date),
    staleTime: 5 * 60 * 1000,
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
  return useQuery({
    queryKey: queryKeys.tooltipsByPage(page),
    queryFn: () => tooltipService.getTooltipsByPage(page),
    enabled: !!page,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useTooltipsByPageAndType = (page: string, type: string) => {
  return useQuery({
    queryKey: queryKeys.tooltipsByPageAndType(page, type),
    queryFn: () => tooltipService.getTooltipsByPageAndType(page, type),
    enabled: !!page && !!type,
    staleTime: 30 * 60 * 1000,
  });
};
