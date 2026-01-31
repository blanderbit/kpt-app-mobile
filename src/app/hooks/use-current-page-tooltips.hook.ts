import React from 'react';
import { useNavigationState } from '@react-navigation/native';
import { Routes, TooltipPagesConfig } from '@app/navigation/const';
import { useTooltipsByPage } from '@shared/services/api/hooks';
import { useAuth } from '@app/hooks/auth.hook';

/**
 * Хук для автоматической загрузки тултипов для текущей страницы.
 * Тултипы загружаются только для авторизованного пользователя и только
 * для страниц из TooltipPagesConfig (экран логина и прочие auth-экраны исключены).
 */
export const useCurrentPageTooltips = () => {
  const { isAuthenticated } = useAuth();

  const currentRoute = useNavigationState(state => {
    const route = state?.routes?.[state?.index];
    return route?.name as Routes | undefined;
  });

  const tooltipPage = currentRoute ? TooltipPagesConfig[currentRoute] : undefined;
  const tooltipPageString = tooltipPage ? String(tooltipPage) : '';
  const enabled = !!tooltipPageString && isAuthenticated;

  const { data: tooltips, isLoading, error, refetch } = useTooltipsByPage(tooltipPageString, { enabled });

  React.useEffect(() => {
    if (tooltipPageString) {
      refetch();
    }
  }, [tooltipPageString, refetch]);

  return {
    tooltips: tooltips || [],
    isLoading,
    error,
    refetch,
    currentRoute,
    tooltipPage,
  };
};

