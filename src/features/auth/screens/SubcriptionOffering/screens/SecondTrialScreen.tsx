import React, { useEffect, useState } from "react";
import {Pressable, StyleSheet, Text, View, Alert} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {useTranslation} from "react-i18next";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {BigNewsIcon} from "@features/auth/screens/SubcriptionOffering/screens/icons";
import { amplitudeAnalyticsService } from "@shared/services/analytics";
import { revenueCatService } from "@shared/services/revenuecat";
import { REVENUECAT_PRODUCT_IDS, REVENUECAT_PRODUCT_IDENTIFIERS } from "@app/config/revenuecat.config";
import type { PurchasesStoreProduct } from "react-native-purchases";

export default function SecondTrialScreen({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const [savingsPercent, setSavingsPercent] = useState<number | null>(null);
    const [yearlyProduct, setYearlyProduct] = useState<PurchasesStoreProduct | null>(null);

    useEffect(() => {
        const loadPlans = async () => {
            if (!revenueCatService.getInitialized()) {
                setIsLoadingPlans(false);
                return;
            }
            try {
                setIsLoadingPlans(true);
                const products = await revenueCatService.getProducts(REVENUECAT_PRODUCT_IDENTIFIERS);
                const monthly = products?.find(p => p.identifier === REVENUECAT_PRODUCT_IDS.MONTHLY);
                const yearly = products?.find(p => p.identifier === REVENUECAT_PRODUCT_IDS.YEARLY);
                if (yearly) setYearlyProduct(yearly);
                if (monthly && yearly && monthly.price > 0) {
                    const yearlyPerMonth = yearly.price / 12;
                    const percent = Math.round(((monthly.price - yearlyPerMonth) / monthly.price) * 100);
                    setSavingsPercent(Math.max(0, Math.min(100, percent)));
                }
            } catch {
                // fallback: no percent
            } finally {
                setIsLoadingPlans(false);
            }
        };
        loadPlans();
    }, []);

    const purchaseYearly = async () => {
        if (!revenueCatService.getInitialized() || !yearlyProduct) {
            if (!yearlyProduct) {
                console.warn('[RevenueCat] Yearly product not loaded');
            }
            return;
        }
        setIsPurchasing(true);
        try {
            await revenueCatService.purchaseProduct(yearlyProduct);
            onNext();
        } catch (e: any) {
            if (e?.userCancelled) {
                return;
            }
            console.error('[RevenueCat] Purchase failed:', e);
            Alert.alert(
                t('subscriptionOffering.startTrial.purchaseErrorTitle'),
                t('subscriptionOffering.startTrial.purchaseErrorMessage'),
                [{ text: t('ok') }]
            );
        } finally {
            setIsPurchasing(false);
        }
    };

    const titleText = savingsPercent != null
        ? t('subscriptionOffering.secondTrial.title', { percent: savingsPercent })
        : t('subscriptionOffering.secondTrial.titleFallback');

    return (
        <View style={[styles.container, theme.flexBlocks.vertical16]}>
            <View style={[styles.content, theme.flexBlocks.vertical16]}>
                <View style={[theme.flexBlocks.vertical8, styles.headerBlock]}>
                    <Text style={[styles.textCenter, styles.oneTimeOffer, theme.fonts.regular]}>
                        􀆅 {t('subscriptionOffering.secondTrial.oneTimeOffer')}
                    </Text>

                    <Text style={[styles.textCenter, theme.fonts.title, styles.titleText]}>
                        {titleText}
                    </Text>

                    <Text style={[styles.textCenter, styles.description, theme.fonts.regular]}>
                        {t('subscriptionOffering.secondTrial.description')}
                    </Text>
                </View>

                <View style={[theme.flexBlocks.justifyCenter, theme.flexBlocks.alignCenter, { flex: 1}]}>
                    <RemoteSvg xml={BigNewsIcon} />
                </View>
            </View>

            <View style={theme.flexBlocks.vertical16}>
                <View style={styles.subscriptionDescription}>
                    <Text style={[theme.fonts.regular, styles.descriptionText]}>
                        {t('subscriptionOffering.secondTrial.description')}
                    </Text>
                </View>

                <View style={theme.flexBlocks.vertical16}>
                    {isLoadingPlans ? (
                        <Text style={[theme.fonts.regular, styles.textCenter]}>
                            {t('subscriptionOffering.secondTrial.loadingPlans')}
                        </Text>
                    ) : (
                        <>
                            <CustomButton
                                title={t('subscriptionOffering.secondTrial.startFreeOffer')}
                                onPress={() => {
                                    amplitudeAnalyticsService.trackEvent('Onboarding Payment', {
                                        plan: 'second_trial',
                                    });
                                    purchaseYearly().catch(() => {});
                                }}
                                variant="primary"
                                disabled={isPurchasing || !yearlyProduct}
                            />

                            <Pressable
                                onPress={() => {
                                    amplitudeAnalyticsService.trackEvent('Onboarding Skip Payment');
                                    onNext();
                                }}
                            >
                                <Text style={styles.skipTitle}>
                                    {t('subscriptionOffering.secondTrial.skipOffer')}
                                </Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    headerBlock: {
        flexShrink: 0,
    },
    titleText: {
        flexShrink: 0,
        paddingTop: 10,
    },
    textCenter: {
        textAlign: 'center',
    },
    oneTimeOffer: {
        color: '#1E9F79'
    },
    description: {
        opacity: .6
    },
    subscriptionDescription: {
        textAlign: 'center',
    },
    descriptionText: {
        textAlign: 'center',
        fontFamily: 'SF Pro Display Semibold',
        fontSize: 18,
        lineHeight: 24,
        color: '#1E9F79'
    },
    skipTitle: {
        fontFamily: 'InterSemibold',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: -0.02,
        textAlign: 'center'
    },
});
