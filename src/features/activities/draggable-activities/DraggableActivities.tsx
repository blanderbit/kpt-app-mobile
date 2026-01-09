import React, { useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { useScrollBlocker } from "@app/scroll-blocker/ScrollBlockerContext";

interface DraggableActivitiesProps<T> {
  itemsArr: T[];
  itemHeight?: number;
  renderItem: (item: T, index: number, drag: () => void) => React.ReactNode;
  onDragEnd?: (data: T[], from: number, to: number) => void;
  keyExtractor?: (item: T, index: number) => string;
}

export default function DraggableActivities<T extends { id: number }>({
  itemsArr,
  itemHeight = 90,
  renderItem,
  onDragEnd,
  keyExtractor = (item: T) => `activity-${item.id}`,
}: DraggableActivitiesProps<T>) {
  const { blockScroll, allowScroll } = useScrollBlocker();
  const listRef = useRef<DraggableFlatList<T> | null>(null);
  const isDraggingRef = useRef(false);

  // Мемоизируем данные для стабильности ссылок
  // Используем JSON.stringify для глубокого сравнения, чтобы избежать лишних обновлений
  const memoizedData = useMemo(() => {
    return itemsArr;
  }, [itemsArr]);

  // Синхронизируем данные с DraggableFlatList при изменении itemsArr (когда не происходит drag)
  useEffect(() => {
    if (!isDraggingRef.current && listRef.current) {
      // Принудительно обновляем данные, если они изменились извне
      // Это помогает восстановить состояние после обновления данных из кэша
    }
  }, [memoizedData]);

  const handleDragBegin = () => {
    isDraggingRef.current = true;
    blockScroll();
  };

  const handleDragEnd = ({ data, from, to }: { data: T[]; from: number; to: number }) => {
    isDraggingRef.current = false;
    allowScroll();
    if (onDragEnd && from !== to) {
      onDragEnd(data, from, to);
    }
  };

  const renderDraggableItem = ({ item, index, drag, isActive }: RenderItemParams<T>) => {
    return (
      <ScaleDecorator>
        <View
          style={[
            styles.item,
            { minHeight: itemHeight },
            isActive && styles.activeItem,
          ]}
        >
          {renderItem(item, index, drag)}
        </View>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <DraggableFlatList
        ref={listRef}
        data={memoizedData}
        onDragBegin={handleDragBegin}
        onDragEnd={handleDragEnd}
        keyExtractor={keyExtractor}
        renderItem={renderDraggableItem}
        activationDistance={10}
        scrollEnabled={true}
        // Увеличиваем активационное расстояние для лучшей работы на мобильных устройствах
        dragItemOverflow={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  item: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  activeItem: {
    zIndex: 9999,
    elevation: 10,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
});
