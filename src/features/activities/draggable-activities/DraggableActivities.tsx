import React from 'react';
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

  const handleDragBegin = () => {
    blockScroll();
  };

  const handleDragEnd = ({ data, from, to }: { data: T[]; from: number; to: number }) => {
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
        data={itemsArr}
        onDragBegin={handleDragBegin}
        onDragEnd={handleDragEnd}
        keyExtractor={keyExtractor}
        renderItem={renderDraggableItem}
        activationDistance={10}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
