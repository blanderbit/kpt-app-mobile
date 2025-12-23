// BottomSwitcher.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import ActivitiesIcon from "@assets/icons/ActivitiesIcon";
import ProfileIcon from "@assets/icons/ProfileIcon";
import HomeIcon from "@assets/icons/HomeIcon";

type Tab = 'Today' | 'Activities' | 'Profile';

interface BottomSwitcherProps {
    activeTab?: Tab;
    onChange?: (tab: Tab) => void;
}

export const BottomSwitcher: React.FC<BottomSwitcherProps> = ({ activeTab = 'Today', onChange }) => {
    const { t } = useTranslation();

    const modes = [
        { label: 'Today', translationKey: 'tabs.today', icon: <HomeIcon /> },
        { label: 'Activities', translationKey: 'tabs.activities', icon: <ActivitiesIcon /> },
        { label: 'Profile', translationKey: 'tabs.profile', icon: <ProfileIcon /> }
    ];

    const handlePress = (tab: Tab) => {
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
                            {t(tab.translationKey)}
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
        fontFamily: 'InterSemibold',
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
