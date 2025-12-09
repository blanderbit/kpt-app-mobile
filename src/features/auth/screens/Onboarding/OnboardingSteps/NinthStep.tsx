import React from "react";
import {StyleSheet, Text, View, ActivityIndicator, ScrollView} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {ActivityRecommendation} from "@shared/services/api/types";
import { ActivityLabel } from '@shared/components/ActivityLabel';
import { SuggestedActivitiesIcon } from "@assets/icons/SuggestedActivitiesIcon";
import { isSmallScreen, getResponsiveGap } from "@shared/utils/screenUtils";

interface NinthStepProps {
    onNext: () => void;
    isLoading: boolean;
    recommendations: ActivityRecommendation[];
    overallReasoning?: string;
    errorMessage?: string;
    onRetry: () => void;
    hasRequiredData: boolean;
    onAddToMyList?: (recommendations: ActivityRecommendation[]) => void;
}

export default function NinthStep({
    onNext,
    isLoading,
    recommendations,
    overallReasoning,
    errorMessage,
    onRetry,
    hasRequiredData,
    onAddToMyList,
}: NinthStepProps) {
    const {theme} = useCustomTheme();
    const isSmall = isSmallScreen();

    const hasRecommendations = recommendations.length > 0;
    const showError = Boolean(errorMessage);
    const showMissingData = !hasRequiredData;
    const showEmptyState = !isLoading && !hasRecommendations && hasRequiredData && !showError;

    const renderRecommendations = () => (
        <View style={[theme.containers.cardRound, { gap: isSmall ? getResponsiveGap(16) : 16 }]}>
            {overallReasoning ? (
                <Text style={[styles.overallReasoning, theme.fonts.body, { marginBottom: isSmall ? getResponsiveGap(12) : 12 }]}>
                    {overallReasoning}
                </Text>
            ) : null}

            <View
                style={[theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 }]}>
                <SuggestedActivitiesIcon/>

                <Text style={theme.fonts.subtitle}>
                    Suggested activities
                </Text>
            </View>

            <ScrollView
                style={[styles.activitySections, { maxHeight: isSmall ? 180 : 250 }]}
                contentContainerStyle={styles.activitySectionsContent}
                showsVerticalScrollIndicator={false}
            >
                {recommendations.map((item, index) => {
                    // Определяем тип активности по содержимому или используем дефолтный
                    const activityType = determineActivityType(item);
                    
                    return (
                        <View
                            key={`${item.activityName}-${index}`}
                            style={[
                                styles.activitySection,
                                {
                                    padding: isSmall ? 12 : 16,
                                    gap: isSmall ? getResponsiveGap(8) : 8,
                                    minHeight: isSmall ? 80 : 90
                                },
                                index !== recommendations.length - 1 && styles.activityDivider
                            ]}
                        >
                            <ActivityLabel id={activityType} />

                            <View style={[styles.activityContent, { gap: isSmall ? getResponsiveGap(4) : 4 }]}>
                                <Text style={[styles.activityTitle, theme.fonts.activityTitle]}>
                                    {item.activityName}
                                </Text>
                                {item.content && (
                                    <Text style={[styles.activityDescription, theme.fonts.regular]}>
                                        {item.content}
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );

    // Функция для определения типа активности по содержимому
    const determineActivityType = (item: ActivityRecommendation): string => {
        const name = item.activityName.toLowerCase();
        const content = item.content.toLowerCase();
        const text = `${name} ${content}`;

        // Определяем тип по ключевым словам
        if (text.includes('yoga') || text.includes('meditation') || text.includes('mindful')) {
            return 'health';
        }
        if (text.includes('fitness') || text.includes('workout') || text.includes('exercise') || text.includes('gym')) {
            return 'fitness';
        }
        if (text.includes('read') || text.includes('book') || text.includes('learn') || text.includes('study')) {
            return 'education';
        }
        if (text.includes('social') || text.includes('friend') || text.includes('meet')) {
            return 'social';
        }
        if (text.includes('work') || text.includes('career') || text.includes('business')) {
            return 'work';
        }
        if (text.includes('hobby') || text.includes('creative') || text.includes('art')) {
            return 'hobby';
        }
        
        // Дефолтный тип
        return 'health';
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, { gap: isSmall ? getResponsiveGap(16) : 16 }]}>
                <Text style={styles.suggestingText}>
                    Based on your previous answers we prepared a few first tasks and activities for you.
                </Text>

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.buttons.primary.backgroundColor}/>
                    </View>
                )}

                {!isLoading && showMissingData && (
                    <View style={[styles.messageCard, theme.containers.cardRound, { gap: isSmall ? getResponsiveGap(12) : 12 }]}>
                        <Text style={[styles.messageText, theme.fonts.body]}>
                            Please complete previous steps so we can generate tailored activities for you.
                        </Text>
                    </View>
                )}

                {!isLoading && showError && (
                    <View style={[styles.messageCard, theme.containers.cardRound, { gap: isSmall ? getResponsiveGap(12) : 12 }]}>
                        <Text style={[styles.errorText, theme.fonts.body]}>
                            {errorMessage}
                        </Text>

                        <CustomButton
                            title={'Try again'}
                            onPress={onRetry}
                            themeName={'white_no_border'}
                            buttonStyle={styles.retryButton}
                        />
                    </View>
                )}

                {!isLoading && showEmptyState && (
                    <View style={[styles.messageCard, theme.containers.cardRound, { gap: isSmall ? getResponsiveGap(12) : 12 }]}>
                        <Text style={[styles.messageText, theme.fonts.body]}>
                            We couldn't prepare recommendations right now. Try again in a moment.
                        </Text>

                        <CustomButton
                            title={'Try again'}
                            onPress={onRetry}
                            themeName={'white_no_border'}
                            buttonStyle={styles.retryButton}
                        />
                    </View>
                )}

                {!isLoading && hasRecommendations && renderRecommendations()}
            </View>

            <View style={theme.flexBlocks.vertical4}>
                <CustomButton
                    title={'Add to my list'}
                    onPress={() => {
                        if (hasRecommendations && onAddToMyList) {
                            onAddToMyList(recommendations);
                        }
                        onNext();
                    }}
                    disabled={!hasRecommendations || isLoading}
                    themeName={!hasRecommendations || isLoading ? 'primary_disabled' : 'primary'}
                />

                <CustomButton
                    title={'Skip'}
                    onPress={onNext}
                    themeName={'white_no_border'}
                />
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
        gap: 16,
    },
    suggestingText: {
        fontFamily: 'SF Pro Display Bold',
        fontSize: 14,
        lineHeight: 20,
        opacity: 0.6,
        textAlign: 'center',
        letterSpacing: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    messageCard: {
        width: '100%',
        gap: 12,
    },
    messageText: {
        textAlign: 'center',
        opacity: 0.8,
    },
    errorText: {
        textAlign: 'center',
        color: '#FF3B30',
    },
    retryButton: {
        alignSelf: 'center',
        width: '100%',
    },
    overallReasoning: {
        marginBottom: 12,
        textAlign: 'left',
    },
    activitySections: {
        flexDirection: 'column',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        overflow: 'hidden',
    },
    activitySectionsContent: {
        flexGrow: 1,
        paddingTop: 1, // Небольшой отступ сверху, чтобы контент не обрезался
    },
    activitySection: {
        width: '100%',
        minHeight: 90,
        flexDirection: 'column',
        padding: 16,
        gap: 8,
    },
    activityDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#E2DDD8',
    },
    activityContent: {
        flexDirection: 'column',
        gap: 4,
    },
    activityTitle: {
        maxWidth: '100%',
    },
    activityDescription: {
        opacity: 0.7,
        fontSize: 14,
        lineHeight: 20,
    },
});
