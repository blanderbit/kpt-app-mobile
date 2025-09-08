import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';
import { BottomSwitcher } from "@shared/components/BottomSwitcher/BottomSwitcher";
import TodayScreen from "@features/main/screens/today/TodayScreen";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { BlurView } from 'expo-blur';
import ProfileScreen from "@features/main/screens/profile/ProfileScreen";
import { HomeScreenNavigationProp } from "@app/navigation/AppNavigator";
import ActivitiesScreen from "@features/activities/ActivitiesScreen";
import { useScrollBlocker } from "@app/scroll-blocker/ScrollBlockerContext";

import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type Tab = 'Today' | 'Activities' | 'Profile';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_BLUR_HEIGHT = SCREEN_HEIGHT * 0.075;

export default function MainScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    const { theme } = useCustomTheme();
    const { scrollEnabled } = useScrollBlocker();

    const [activeTab, setActiveTab] = useState<Tab>('Today');
    const blurOpacity = useRef(new Animated.Value(1)).current;

    const renderContent = () => {
        switch (activeTab) {
            case 'Today':
                return <TodayScreen navigation={navigation} />;
            case 'Activities':
                return <ActivitiesScreen navigation={navigation} />;
            case 'Profile':
                return <ProfileScreen navigation={navigation} />;
            default:
                return null;
        }
    };

    const handleScroll = (e) => {
        const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;
        const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 5;

        Animated.timing(blurOpacity, {
            toValue: isAtBottom ? 0 : 1,
            duration: 10,
            useNativeDriver: true,
        }).start();
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={scrollEnabled}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {renderContent()}
            </ScrollView>

            {/* Плавный блюр с градиентной маской */}
            <Animated.View style={[styles.bottomBlur, { opacity: blurOpacity }]} pointerEvents="none">
                <MaskedView
                    style={{ flex: 1 }}
                    maskElement={
                        <LinearGradient
                            colors={['transparent', 'black']} // Верх = прозрачный, низ = видимый
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
                <BottomSwitcher onChange={setActiveTab} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 80,
        backgroundColor: 'transparent',
    },
    bottomWrapper: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBlur: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: BOTTOM_BLUR_HEIGHT,
        overflow: 'hidden',
    },
});
