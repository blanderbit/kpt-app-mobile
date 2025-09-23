import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { tooltipService } from '@shared/services/api';
import { Tooltip } from '@shared/services/api/types';
import { TooltipPage } from '@shared/components/InfoPopup/InfoPopup';

// Хук для загрузки тултипов при попадании на страницу
export const usePageTooltips = (page: TooltipPage, options?: { enabled?: boolean }) => {
  const {
    data: tooltips,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tooltips', page],
    queryFn: () => tooltipService.getTooltipsByPage(page),
    staleTime: 5 * 60 * 1000, // 5 минут кэша
    enabled: (options?.enabled ?? true) && !!page, // Запускается только если enabled=true и page передан
  });

  // Автоматически загружаем тултипы при изменении страницы
  useEffect(() => {
    if (page) {
      console.log(`Loading tooltips for page: ${page}`);
      refetch();
    }
  }, [page, refetch]);

  return {
    tooltips: tooltips || [],
    isLoading,
    error,
    refetch
  };
};

// Хук для получения конкретного тултипа по ID
export const useTooltipById = (tooltips: Tooltip[], tooltipId: number) => {
  return tooltips.find(tooltip => tooltip.id === tooltipId);
};

// Хук для получения тултипов по типу
export const useTooltipsByType = (tooltips: Tooltip[], type: 'swipe' | 'text') => {
  return tooltips.filter(tooltip => tooltip.type === type);
};
