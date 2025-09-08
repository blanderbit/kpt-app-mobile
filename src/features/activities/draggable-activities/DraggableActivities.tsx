import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    LayoutAnimation,
    UIManager,
    Platform,
} from 'react-native';
import { useScrollBlocker } from "@app/scroll-blocker/ScrollBlockerContext";

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function DraggableActivities({
                                                itemsArr,
                                                itemHeight,
                                                renderItem,
                                            }: {
    itemsArr: any[];
    itemHeight: number;
    renderItem: (section, index) => any;
}) {
    const { blockScroll, allowScroll } = useScrollBlocker();

    const [items, setItems] = useState(itemsArr);
    const [isDragging, setIsDragging] = useState(false);

    const positions = useRef(
        items.map((_, i) => new Animated.ValueXY({ x: 0, y: i * (itemHeight) }))
    ).current;
    const [movingIndex, setMovingIndex] = useState<number | null>(null);

    const panResponders = items.map((_, index) =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                blockScroll();
                setMovingIndex(index)
            },
            onPanResponderMove: (_, gesture) => {
                if (movingIndex === null) return;
                positions[index].setValue({
                    x: 0,
                    y: gesture.dy + index * (itemHeight),
                });
            },
            onPanResponderRelease: (_, gesture) => {
                if (movingIndex === null) return;
                setIsDragging(true);

                const newIndex = Math.min(
                    items.length - 1,
                    Math.max(
                        0,
                        Math.round(
                            (gesture.dy + index * (itemHeight)) / (itemHeight)
                        )
                    )
                );

                const newItems = [...items];
                const movedItem = newItems.splice(index, 1)[0];
                newItems.splice(newIndex, 0, movedItem);

                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setIsDragging(false);

                setTimeout(() => {
                    setItems(newItems);
                    newItems.forEach((_, i) => {
                        positions[i].setValue({ x: 0, y: i * (itemHeight) });
                    });
                }, 50);

                setMovingIndex(null);

                allowScroll();
            },
        })
    );

    return (
        <View style={[styles.container, { height: items.length * itemHeight }]}>
            {items.map((item, index) => {
                const isActive = movingIndex === index;

                return (
                    (!isDragging || isActive) && (
                        <Animated.View
                            {...panResponders[index].panHandlers}
                            key={index}
                            style={[
                                styles.item,
                                { height: itemHeight },
                                positions[index].getLayout(),
                                isActive && {
                                    zIndex: 9999,
                                    elevation: 10,
                                    shadowOpacity: 0.3,
                                },
                            ]}
                        >
                            {renderItem(item, index)}
                        </Animated.View>
                    )
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        position: 'absolute',
        left: 0,
        width: '100%',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        zIndex: 1
    },
});
