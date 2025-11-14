import React, { useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';
import { BottomSwitcher } from "@shared/components/BottomSwitcher/BottomSwitcher";
import { BlurView } from 'expo-blur';
import { Routes } from "@app/navigation/const";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { AppNavigationProp } from "@app/navigation/AppNavigator";
import { useScrollBlocker } from "@app/scroll-blocker/ScrollBlockerContext";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_BLUR_HEIGHT = SCREEN_HEIGHT * 0.075;

type Tab = 'Today' | 'Activities' | 'Profile';

const routeToTab: Record<string, Tab> = {
    [Routes.TODAY]: 'Today',
    [Routes.ACTIVITIES]: 'Activities',
    [Routes.PROFILE]: 'Profile',
};

const tabToRoute: Record<Tab, Routes> = {
    'Today': Routes.TODAY,
    'Activities': Routes.ACTIVITIES,
    'Profile': Routes.PROFILE,
};

interface TabScreenContainerProps {
    children: React.ReactNode;
    blurOpacity?: Animated.Value;
}

export const TabScreenContainer: React.FC<TabScreenContainerProps> = ({ children, blurOpacity }) => {
    const navigation = useNavigation<AppNavigationProp>();
    const { scrollEnabled } = useScrollBlocker();

    // Получаем текущий роут из navigation state
    const currentRoute = useNavigationState(state => {
        const route = state?.routes[state?.index];
        return route?.name;
    });

    // Определяем текущий активный таб на основе текущего роута
    const getCurrentTab = (): Tab => {
        return routeToTab[currentRoute || ''] || 'Today';
    };

    const activeTab = getCurrentTab();

    // Обработчик изменения таба через BottomSwitcher
    const handleTabChange = (tab: Tab) => {
        const targetRoute = tabToRoute[tab];
        if (targetRoute && currentRoute !== targetRoute) {
            navigation.navigate(targetRoute);
        }
    };

    const defaultBlurOpacity = useRef(new Animated.Value(1)).current;
    const blurValue = blurOpacity || defaultBlurOpacity;

    // ProfileScreen имеет свой ScrollView, поэтому не добавляем еще один
    const needsScrollView = currentRoute !== Routes.PROFILE;

    const handleScroll = (e: any) => {
        const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
        const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 5;

        Animated.timing(blurValue, {
            toValue: isAtBottom ? 0 : 1,
            duration: 10,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            {needsScrollView ? (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={scrollEnabled}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {children}
                </ScrollView>
            ) : (
                children
            )}

            {/* Плавный блюр с градиентной маской */}
            <Animated.View style={[styles.bottomBlur, { opacity: blurValue }]} pointerEvents="none">
                <MaskedView
                    style={{ flex: 1 }}
                    maskElement={
                        <LinearGradient
                            colors={['transparent', 'black']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 0.3 }}
                            style={{ flex: 1 }}
                        />
                    }
                >
                    <BlurView intensity={50} tint="light" style={{ flex: 1 }} />
                </MaskedView>
            </Animated.View>

            <View style={styles.bottomWrapper}>
                <BottomSwitcher 
                    activeTab={activeTab}
                    onChange={handleTabChange} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
        backgroundColor: 'transparent',
    },
    bottomWrapper: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    bottomBlur: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: BOTTOM_BLUR_HEIGHT,
        overflow: 'hidden',
        zIndex: 999,
    },
});

