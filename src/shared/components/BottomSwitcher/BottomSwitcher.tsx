// BottomSwitcher.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import ActivitiesIcon from "@assets/icons/ActivitiesIcon";
import ProfileIcon from "@assets/icons/ProfileIcon";
import HomeIcon from "@assets/icons/HomeIcon";

type Tab = 'Today' | 'Activities' | 'Profile';

interface BottomSwitcherProps {
    onChange?: (tab: Tab) => void;
}

const modes = [
    { label: 'Today', icon: <HomeIcon /> },
    { label: 'Activities', icon: <ActivitiesIcon /> },
    { label: 'Profile', icon: <ProfileIcon /> }
]

export const BottomSwitcher: React.FC<BottomSwitcherProps> = ({ onChange }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Today');

    const handlePress = (tab: Tab) => {
        setActiveTab(tab);
        onChange?.(tab);
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                {modes.map((tab, index) => (
                    <Pressable
                        key={tab.label}
                        style={[
                            styles.tab,
                            activeTab === tab.label && styles.activeTab,
                            { width: index === 0 || index === modes.length - 1 ? 82 : 84 },
                        ]}
                        onPress={() => handlePress(tab.label as Tab)}>
                        {tab.icon}
                        <Text
                            style={[styles.tabText, activeTab === tab.label && styles.activeTabText]}
                            numberOfLines={1}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    container: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 44,
        padding: 4,
        height: 56,
    },
    tab: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderRadius: 24,
        gap: 4,
        height: 48,
    },
    activeTab: {
        backgroundColor: '#000000',
        paddingHorizontal: 12,
    },
    tabText: {
        fontFamily: 'Inter',
        color: '#FFFFFFAA',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 14,
        letterSpacing: -0.12,
    },
    activeTabText: {
        color: '#FFFFFF',
    },
});
