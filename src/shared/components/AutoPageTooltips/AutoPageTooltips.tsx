import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useCurrentPageTooltips } from '@app/hooks/use-current-page-tooltips.hook';
import { useCloseTooltip } from '@shared/services/api';
import { InfoPopup } from '@shared/components/InfoPopup/InfoPopup';

interface AutoPageTooltipsProps {
  tooltipIds?: number[]; // ID тултипов для отображения (опционально, если не указаны - показываем все)
  autoShow?: boolean; // Автоматически показывать тултипы
  enabled?: boolean; // Включить загрузку тултипов (по умолчанию true)
}

/**
 * Компонент для автоматической загрузки и отображения тултипов для текущей страницы
 * Использует TooltipPagesConfig для определения какой page использовать
 * на основе текущего роута из navigation
 */
export const AutoPageTooltips = ({ 
  tooltipIds, 
  autoShow = true, 
  enabled = true
}: AutoPageTooltipsProps) => {
  const { tooltips, isLoading, tooltipPage } = useCurrentPageTooltips();
  const [visibleTooltips, setVisibleTooltips] = useState<number[]>([]);
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);
  const closeTooltipMutation = useCloseTooltip();

  // Если тултипы не включены или нет страницы - не показываем ничего
  if (!enabled || !tooltipPage) {
    return null;
  }

  // Определяем какие тултипы показывать
  const tooltipsToShow = tooltipIds 
    ? tooltips.filter(t => tooltipIds.includes(t.id))
    : tooltips; // Показываем все тултипы, если не указаны конкретные ID
  
  // Сбрасываем видимые тултипы, если список тултипов изменился или стал пустым
  useEffect(() => {
    if (tooltipsToShow.length === 0) {
      console.log('🔔 [AutoPageTooltips] Нет тултипов для отображения, очищаем видимые');
      setVisibleTooltips([]);
      setCurrentTooltipIndex(0);
    }
  }, [tooltipsToShow.length]);

  // Автоматический показ тултипов
  useEffect(() => {
    if (autoShow && tooltipsToShow.length > 0 && !isLoading) {
      const firstTooltipId = tooltipsToShow[0]?.id;
      console.log('🔔 [AutoPageTooltips] Показываем тултип с ID:', firstTooltipId);
      setVisibleTooltips([firstTooltipId].filter(Boolean) as number[]);
      setCurrentTooltipIndex(0); // Сбрасываем индекс при показе первого тултипа
    } else if (tooltipsToShow.length === 0 && !isLoading) {
      console.log('🔔 [AutoPageTooltips] Нет тултипов для показа (массив пустой)');
      setVisibleTooltips([]);
    }
  }, [autoShow, tooltipsToShow, isLoading]);

  // Переход к следующему тултипу
  const showNextTooltip = () => {
    const nextIndex = currentTooltipIndex + 1;
    if (nextIndex < tooltipsToShow.length) {
      setCurrentTooltipIndex(nextIndex);
      setVisibleTooltips([tooltipsToShow[nextIndex]?.id].filter(Boolean) as number[]);
    } else {
      setVisibleTooltips([]);
    }
  };

  // Закрытие текущего тултипа
  const closeCurrentTooltip = async () => {
    const currentTooltip = tooltipsToShow[currentTooltipIndex];
    console.log('🔔 [AutoPageTooltips] Закрытие тултипа, текущий индекс:', currentTooltipIndex);
    if (currentTooltip) {
      console.log('🔔 [AutoPageTooltips] Закрываем тултип с ID:', currentTooltip.id);
      try {
        // Вызываем API для закрытия тултипа
        await closeTooltipMutation.mutateAsync(currentTooltip.id);
        console.log('🔔 [AutoPageTooltips] ✅ Тултип успешно закрыт через API, ID:', currentTooltip.id);
      } catch (error) {
        console.error('🔔 [AutoPageTooltips] ❌ Ошибка при закрытии тултипа:', error);
        // Продолжаем выполнение даже если API вызов не удался
      }
      // Удаляем текущий тултип из видимых
      setVisibleTooltips(prev => prev.filter(id => id !== currentTooltip.id));
    }
    showNextTooltip();
  };

  const currentTooltip = tooltipsToShow[currentTooltipIndex];

  if (!currentTooltip || !visibleTooltips.includes(currentTooltip.id)) {
    return null;
  }

  return (
    <View style={{ width: '100%' }}>
      <InfoPopup
        title={currentTooltip.json.title}
        desc={currentTooltip.json.description}
        visible={true}
        onClose={closeCurrentTooltip}
      />
    </View>
  );
};

