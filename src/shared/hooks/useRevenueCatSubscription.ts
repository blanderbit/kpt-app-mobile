import { useQuery } from '@tanstack/react-query';
import { revenueCatService } from '@shared/services/revenuecat';

const REVENUECAT_SUBSCRIPTION_QUERY_KEY = ['revenueCat', 'subscription'] as const;

/**
 * Хук для проверки статуса подписки через RevenueCat.
 * Возвращает hasActiveSubscription: true, если у пользователя есть хотя бы один активный entitlement.
 * Используйте для гейтинга фич (лимиты активностей, suggested activities и т.д.).
 */
export const useRevenueCatSubscription = () => {
  const result = useQuery({
    queryKey: REVENUECAT_SUBSCRIPTION_QUERY_KEY,
    queryFn: () => revenueCatService.isSubscribed(),
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: revenueCatService.getInitialized(),
  });

  return {
    hasActiveSubscription: result.data === true,
    isLoading: result.isLoading,
    isError: result.isError,
    refetch: result.refetch,
  };
};

export { REVENUECAT_SUBSCRIPTION_QUERY_KEY };
