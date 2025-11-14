import { useNavigationState } from '@react-navigation/native';
import { Routes, TooltipPagesConfig } from '@app/navigation/const';
import { useTooltipsByPage } from '@shared/services/api/hooks';

/**
 * Хук для автоматической загрузки тултипов для текущей страницы
 * Использует TooltipPagesConfig для определения какой page использовать
 * на основе текущего роута
 */
export const useCurrentPageTooltips = () => {
  // Получаем текущий роут из navigation state
  const currentRoute = useNavigationState(state => {
    console.log('🔔 [useCurrentPageTooltips] Navigation state:', {
      routes: state?.routes?.map(r => r.name),
      index: state?.index,
      routeNames: state?.routeNames
    });
    const route = state?.routes?.[state?.index];
    const routeName = route?.name as Routes | undefined;
    console.log('🔔 [useCurrentPageTooltips] Текущий route из state:', routeName);
    return routeName;
  });

  // Находим соответствующий TooltipPage из конфига
  const tooltipPage = currentRoute ? TooltipPagesConfig[currentRoute] : undefined;

  // Загружаем тултипы для этой страницы (конвертируем enum в строку)
  const tooltipPageString = tooltipPage ? String(tooltipPage) : '';
  
  console.log('🔔 [useCurrentPageTooltips] Текущий роут:', currentRoute);
  console.log('🔔 [useCurrentPageTooltips] TooltipPage из конфига:', tooltipPage);
  console.log('🔔 [useCurrentPageTooltips] TooltipPage строка для запроса:', tooltipPageString);
  console.log('🔔 [useCurrentPageTooltips] Будет ли выполнен запрос (enabled):', !!tooltipPageString);
  
  const { data: tooltips, isLoading, error, refetch } = useTooltipsByPage(tooltipPageString);
  
  console.log('🔔 [useCurrentPageTooltips] Статус загрузки:', isLoading);
  console.log('🔔 [useCurrentPageTooltips] Количество тултипов:', tooltips?.length || 0);
  if (error) {
    console.error('🔔 [useCurrentPageTooltips] Ошибка загрузки тултипов:', error);
  }

  return {
    tooltips: tooltips || [],
    isLoading,
    error,
    refetch,
    currentRoute,
    tooltipPage,
  };
};

