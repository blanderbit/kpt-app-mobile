import React from "react";
import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {ActivityRecommendation} from "@shared/services/api/types";

interface NinthStepProps {
    onNext: () => void;
    isLoading: boolean;
    recommendations: ActivityRecommendation[];
    overallReasoning?: string;
    errorMessage?: string;
    onRetry: () => void;
    hasRequiredData: boolean;
}

export default function NinthStep({
    onNext,
    isLoading,
    recommendations,
    overallReasoning,
    errorMessage,
    onRetry,
    hasRequiredData,
}: NinthStepProps) {
    const {theme} = useCustomTheme();

    const hasRecommendations = recommendations.length > 0;
    const showError = Boolean(errorMessage);
    const showMissingData = !hasRequiredData;
    const showEmptyState = !isLoading && !hasRecommendations && hasRequiredData && !showError;

    const renderRecommendations = () => (
        <View style={theme.containers.cardRound}>
            {overallReasoning ? (
                <Text style={[styles.overallReasoning, theme.fonts.body]}>
                    {overallReasoning}
                </Text>
            ) : null}

            <ScrollView
                style={styles.recommendationsList}
                contentContainerStyle={styles.recommendationsContent}
                showsVerticalScrollIndicator={false}
            >
                {recommendations.map((item, index) => {
                    const confidence = Math.round(Math.min(Math.max(item.confidenceScore ?? 0, 0), 1) * 100);
                    return (
                        <View
                            key={`${item.activityName}-${index}`}
                            style={[
                                styles.recommendationCard,
                                index !== recommendations.length - 1 && styles.recommendationDivider
                            ]}
                        >
                            <Text style={[styles.recommendationTitle, theme.fonts.subtitle]}>
                                {item.activityName}
                            </Text>
                            <Text style={[styles.recommendationContent, theme.fonts.body]}>
                                {item.content}
                            </Text>
                            <Text style={[styles.recommendationMeta, theme.fonts.caption]}>
                                {`Confidence: ${confidence}%`}
                            </Text>
                            <Text style={[styles.recommendationReasoning, theme.fonts.caption]}>
                                {item.reasoning}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.suggestingText}>
                    Based on your previous answers we prepared a few first tasks and activities for you.
                </Text>

                {isLoading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.buttons.primary.backgroundColor}/>
                    </View>
                )}

                {!isLoading && showMissingData && (
                    <View style={[styles.messageCard, theme.containers.cardRound]}>
                        <Text style={[styles.messageText, theme.fonts.body]}>
                            Please complete previous steps so we can generate tailored activities for you.
                        </Text>
                    </View>
                )}

                {!isLoading && showError && (
                    <View style={[styles.messageCard, theme.containers.cardRound]}>
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
                    <View style={[styles.messageCard, theme.containers.cardRound]}>
                        <Text style={[styles.messageText, theme.fonts.body]}>
                            We couldn’t prepare recommendations right now. Try again in a moment.
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
                    onPress={onNext}
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
    recommendationsList: {
        maxHeight: 300,
    },
    recommendationsContent: {
        paddingBottom: 8,
    },
    recommendationCard: {
        paddingVertical: 12,
        gap: 8,
    },
    recommendationDivider: {
        borderBottomWidth: 1,
        borderBottomColor: '#E2DDD8',
    },
    recommendationTitle: {
        fontFamily: 'InterSemibold',
    },
    recommendationContent: {
        opacity: 0.9,
    },
    recommendationMeta: {
        fontFamily: 'InterSemibold',
    },
    recommendationReasoning: {
        opacity: 0.7,
    },
});
