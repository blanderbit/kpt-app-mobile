import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowIcon } from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { COLORS } from "@app/theme";
import { SubscriptionSettingsScreenNavigationProp } from "@app/navigation/AppNavigator";
import MySubscriptionIcon from "@assets/icons/MySubcriptionIcon";
import { Label, LabelType } from "@shared/components/Label/Label";
import { SectionItem } from "@shared/components/SectionItem/SectionItem";
import { formatDateLong } from "@shared/utils/formatDate";
import { amplitudeAnalyticsService } from "@shared/services/analytics";
import { useProfile } from "@app/hooks/profile.hook";
import { useSubscriptionSummary } from "@shared/services/api/hooks";
import type { SubscriptionStatus } from "@shared/services/api/types";
import { useSubscriptionOffering } from "@features/auth/screens/SubcriptionOffering/SubscriptionOfferingProvider";
import { revenueCatService } from "@shared/services/revenuecat";
import CustomButton from "@shared/components/Button/Button";

const ns = "main.profile.subscriptionSettingsScreen";

function statusToLabelType(s: SubscriptionStatus): LabelType {
    switch (s) {
        case "cancelled":
        case "expired":
        case "past_due":
            return LabelType.DANGER;
        case "active":
            return LabelType.SUCCESS;
        default:
            return LabelType.DEFAULT;
    }
}

export default function SubscriptionSettingsScreen({ navigation }: {
    navigation: SubscriptionSettingsScreenNavigationProp
}) {
    const { t, i18n } = useTranslation();
    const { theme } = useCustomTheme();
    const { profile } = useProfile();
    const lang = (i18n.language || "en").split("-")[0];
    const { data: summary, isLoading, isError, refetch: refetchSummary } = useSubscriptionSummary(lang);
    const { showSubscriptionOffering } = useSubscriptionOffering();
    const [isOpeningManagement, setIsOpeningManagement] = useState(false);

    const onBack = () => navigation.goBack();

    const onChangePlan = () => {
        amplitudeAnalyticsService.trackEvent("Profile Subscription Change Plan Open");
        showSubscriptionOffering(() => {
            refetchSummary();
        }, { variant: "settings" });
    };

    const onManageSubscription = async () => {
        setIsOpeningManagement(true);
        try {
            const url = await revenueCatService.getManagementURL();
            if (url) {
                amplitudeAnalyticsService.trackEvent("Profile Subscription Manage Open");
                const canOpen = await Linking.canOpenURL(url);
                if (canOpen) {
                    await Linking.openURL(url);
                } else {
                    Alert.alert(t(`${ns}.manageUnavailableTitle`), t(`${ns}.manageUnavailableMessage`));
                }
            } else {
                Alert.alert(t(`${ns}.manageUnavailableTitle`), t(`${ns}.manageUnavailableMessage`));
            }
        } catch {
            Alert.alert(t(`${ns}.manageUnavailableTitle`), t(`${ns}.manageUnavailableMessage`));
        } finally {
            setIsOpeningManagement(false);
        }
    };

    useEffect(() => {
        if (summary?.status === "cancelled") {
            amplitudeAnalyticsService.trackEvent("Profile Subscription Cancelled");
        }
    }, [summary?.status]);

    const planTitle = summary?.name ?? summary?.planIntervalLabel ?? t(`${ns}.oneMonth`);
    const planSubtitle = summary?.description ?? null;
    const showCancelledMessage = summary?.status === "cancelled";

    return (
        <PageWithHeader headerContent={
            <>
                <Pressable
                    onPress={onBack}
                    style={({ pressed }) => [
                        styles.smallBtn,
                        { ...theme.buttons.smallBtn },
                        pressed && { opacity: 0.6 }
                    ]}>
                    <ArrowIcon />
                </Pressable>
                <Text style={theme.fonts.subtitle}>
                    {t(`${ns}.title`)}
                </Text>
            </>
        }>
            <View style={theme.flexBlocks.vertical8}>
                {(isLoading || summary) && (
                    <View style={[theme.containers.cardRound, { paddingHorizontal: 16 }]}>
                        <View style={theme.flexBlocks.horizontal4}>
                            <MySubscriptionIcon />
                            <Text style={[theme.fonts.subtitle, { textAlign: "left" }]}>
                                {t(`${ns}.mySubscription`)}
                            </Text>
                        </View>
                        <View style={theme.flexBlocks.vertical4}>
                            <Text style={theme.fonts.titleSecond}>
                                {profile?.email ?? "—"}
                            </Text>
                            {(planSubtitle != null && planSubtitle !== "") && (
                                <Text style={[theme.fonts.regular, { opacity: 0.6 }]}>
                                    {planSubtitle}
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                <View style={[theme.containers.cardRound]}>
                    {isLoading ? (
                        <View style={styles.loadingRow}>
                            <ActivityIndicator size="small" color={COLORS.gray_dark} />
                            <Text style={[theme.fonts.regular, { opacity: 0.6 }]}>{t(`${ns}.loading`)}</Text>
                        </View>
                    ) : isError ? (
                        <View style={styles.stubRow}>
                            <MySubscriptionIcon />
                            <Text style={[theme.fonts.regular, { opacity: 0.6 }]}>{t(`${ns}.loadError`)}</Text>
                        </View>
                    ) : summary ? (
                        <>
                            <Text style={[theme.fonts.titleSecond, { paddingHorizontal: 16 }]}>
                                {planTitle}
                            </Text>
                            <View>
                                <SectionItem
                                    label={`${ns}.subscription`}
                                    rightElement={
                                        <Label status={statusToLabelType(summary.status)} text={summary.statusLabel} />
                                    }
                                    extraStyles={[styles.settingsElementsBorderTop, styles.settingsElementsBorder]}
                                    extraLabelStyles={[theme.fonts.subtitle, { textAlign: "left" }]}
                                />
                                <SectionItem
                                    label={`${ns}.lastDay`}
                                    rightElement={
                                        <Text style={theme.fonts.label}>
                                            {summary.periodEnd != null
                                                ? formatDateLong(summary.periodEnd)
                                                : "—"}
                                        </Text>
                                    }
                                    extraStyles={[styles.settingsElementsBorderBottom]}
                                    extraLabelStyles={[theme.fonts.subtitle, { textAlign: "left" }]}
                                />
                            </View>
                            {showCancelledMessage && (
                                <Text style={[theme.fonts.regular, { opacity: 0.6, paddingHorizontal: 16 }]}>
                                    {t(`${ns}.cancelledMessage`)}
                                </Text>
                            )}
                            <View style={[styles.actionsBlock, theme.flexBlocks.vertical8]}>
                                <CustomButton
                                    title={t(`${ns}.changePlan`)}
                                    onPress={onChangePlan}
                                    themeName="primary"
                                    buttonStyle={styles.changePlanButton}
                                />
                                <Pressable
                                    onPress={onManageSubscription}
                                    disabled={isOpeningManagement}
                                    style={({ pressed }) => [styles.actionButton, (pressed || isOpeningManagement) && { opacity: 0.7 }]}
                                >
                                    {isOpeningManagement ? (
                                        <ActivityIndicator size="small" color={COLORS.gray_dark} />
                                    ) : (
                                        <Text style={[theme.fonts.subtitle, styles.actionButtonText]}>
                                            {t(`${ns}.manageSubscription`)}
                                        </Text>
                                    )}
                                </Pressable>
                            </View>
                        </>
                    ) : (
                        <View style={styles.stubRow}>
                            <MySubscriptionIcon />
                            <Text style={[theme.fonts.titleSecond, { textAlign: "center" }]}>
                                {t(`${ns}.noSubscription`)}
                            </Text>
                            <Text style={[theme.fonts.regular, { opacity: 0.6, textAlign: "center" }]}>
                                {t(`${ns}.noSubscriptionDescription`)}
                            </Text>
                            <CustomButton
                                title={t(`${ns}.changePlan`)}
                                onPress={onChangePlan}
                                themeName="primary"
                                buttonStyle={styles.changePlanButtonStub}
                            />
                        </View>
                    )}
                </View>
            </View>
        </PageWithHeader>
    );
};


const styles = StyleSheet.create({
    smallBtn: {
        position: "absolute",
        top: 0,
        left: 0,
    },
    loadingRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    stubRow: {
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 32,
        paddingHorizontal: 24,
    },
    changePassBtn: {
        alignSelf: 'flex-start',
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 'auto'
    },
    dots: {
        fontSize: 60,
        fontWeight: 600,
        letterSpacing: 5,
        lineHeight: 35,
        color: COLORS.gray_dark
    },
    settingsElementsBorder: {
        borderBottomWidth: 1,
        borderColor: '#E2DDD8',
    },
    settingsElementsBorderTop: {
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16
    },
    settingsElementsBorderBottom: {
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16
    },
    actionsBlock: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 16,
    },
    changePlanButton: {
        marginBottom: 8,
    },
    changePlanButtonStub: {
        marginTop: 16,
    },
    actionButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 44,
    },
    actionButtonText: {
        color: COLORS.warning,
    },
});
