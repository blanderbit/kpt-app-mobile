import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { usePageTooltips, useTooltipById } from '@app/hooks/use-page-tooltips.hook';
import { TooltipPage } from '@shared/components/InfoPopup/InfoPopup';
import { InfoPopup } from '@shared/components/InfoPopup/InfoPopup';

interface PageTooltipsProps {
  page: TooltipPage;
  tooltipIds?: string[]; // ID тултипов для отображения
  autoShow?: boolean; // Автоматически показывать тултипы
  delay?: number; // Задержка перед показом (мс)
  enabled?: boolean; // Включить загрузку тултипов (по умолчанию true)
}

export const PageTooltips = ({ 
  page, 
  tooltipIds, 
  autoShow = true, 
  delay = 1000,
  enabled = true
}: PageTooltipsProps) => {
  const { tooltips, isLoading } = usePageTooltips(page, { enabled });
  const [visibleTooltips, setVisibleTooltips] = useState<string[]>([]);
  const [currentTooltipIndex, setCurrentTooltipIndex] = useState(0);

  // Определяем какие тултипы показывать
  const tooltipsToShow = tooltipIds 
    ? tooltipIds.map(id => useTooltipById(tooltips, id)).filter(Boolean)
    : tooltips.filter(tooltip => tooltip.visible !== false);

  // Автоматический показ тултипов
  useEffect(() => {
    if (autoShow && tooltipsToShow.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        setVisibleTooltips([tooltipsToShow[0]?.id].filter(Boolean));
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [autoShow, tooltipsToShow, isLoading, delay]);

  // Переход к следующему тултипу
  const showNextTooltip = () => {
    const nextIndex = currentTooltipIndex + 1;
    if (nextIndex < tooltipsToShow.length) {
      setCurrentTooltipIndex(nextIndex);
      setVisibleTooltips([tooltipsToShow[nextIndex]?.id].filter(Boolean));
    } else {
      setVisibleTooltips([]);
    }
  };

  // Закрытие текущего тултипа
  const closeCurrentTooltip = () => {
    showNextTooltip();
  };

  const currentTooltip = tooltipsToShow[currentTooltipIndex];

  if (!currentTooltip || !visibleTooltips.includes(currentTooltip.id)) {
    return null;
  }

  return (
    <View>
      <InfoPopup
        title={currentTooltip.title}
        desc={currentTooltip.description}
        visible={true}
        onClose={closeCurrentTooltip}
      />
    </View>
  );
};

// Простой компонент для отображения одного тултипа
interface SingleTooltipProps {
  page: TooltipPage;
  tooltipId: string;
  autoShow?: boolean;
  delay?: number;
  enabled?: boolean;
}

export const SingleTooltip = ({ 
  page, 
  tooltipId, 
  autoShow = true, 
  delay = 1000,
  enabled = true
}: SingleTooltipProps) => {
  return (
    <PageTooltips 
      page={page} 
      tooltipIds={[tooltipId]} 
      autoShow={autoShow} 
      delay={delay}
      enabled={enabled}
    />
  );
};
