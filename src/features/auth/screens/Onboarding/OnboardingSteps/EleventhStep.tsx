import React, {useMemo} from "react";
import {StyleSheet, View, ScrollView} from "react-native";
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCustomTheme} from "@app/theme/ThemeContext";
import {SectionItem} from "@shared/components/SectionItem/SectionItem";
import {ONBOARDING_KEYS} from "@shared/utils/onboardingStorage";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";

export default function EleventhStep({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();

    const answers = useMemo(() => [
        {
            "id": "health_body",
            "text": t('onboarding.texts.taskTrackingOptions.healthBody'),
            "subtitle": t('onboarding.texts.taskTrackingOptions.healthBodySubtitle'),
            "icon": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#E91E63'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/></svg>"
        },
        {
            "id": "productivity_focus",
            "text": t('onboarding.texts.taskTrackingOptions.productivityFocus'),
            "subtitle": t('onboarding.texts.taskTrackingOptions.productivityFocusSubtitle'),
            "icon": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#FF5722'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/></svg>"
        },
        {
            "id": "emotional_wellbeing",
            "text": t('onboarding.texts.taskTrackingOptions.emotionalWellbeing'),
            "subtitle": t('onboarding.texts.taskTrackingOptions.emotionalWellbeingSubtitle'),
            "icon": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#9C27B0'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/></svg>"
        },
        {
            "id": "relationships_social",
            "text": t('onboarding.texts.taskTrackingOptions.relationshipsSocial'),
            "subtitle": t('onboarding.texts.taskTrackingOptions.relationshipsSocialSubtitle'),
            "icon": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#3F51B5'><path d='M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 15.37V22h2v-6h2.5l2.5 7.5h2L8 16h2l2.5 7.5h2L14 16h2l2.5 7.5h2L18 16h2v6h2z'/></svg>"
        }
    ], [t]);

    const saveData = async (method: string) => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEYS.TASK_METHOD, JSON.stringify(method));
        } catch (error) {
            console.error('Error saving task tracking method:', error);
        }
    };

    const handleMethodSelect = (methodLabel: string) => {
        saveData(methodLabel);
        onNext();
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={theme.flexBlocks.vertical8}>
                        {answers?.map((answer) => (
                            <SectionItem
                                key={answer.id}
                                label={answer.text}
                                icon={<RemoteSvg xml={answer.icon} size={32}/>}
                                extraStyles={[styles.variantItem]}
                                onPress={() => handleMethodSelect(answer.text)}
                            />
                        ))}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 8,
    },
    variantItem: {
        borderRadius: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
