import React from "react";
import {Pressable, StyleSheet, Text, View, Alert} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {useTranslation} from "react-i18next";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {COLORS} from "@app/theme";
import {BigNewsIcon} from "@features/auth/screens/SubcriptionOffering/screens/icons";
import { amplitudeAnalyticsService } from "@shared/services/analytics";
import { revenueCatService } from "@shared/services/revenuecat";
import { REVENUECAT_PRODUCT_IDS } from "@app/config/revenuecat.config";

export default function SecondTrialScreen({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();
    const [isPurchasing, setIsPurchasing] = React.useState(false);

    const purchaseYearly = async () => {
        if (!revenueCatService.getInitialized()) {
            console.warn('[RevenueCat] Not initialized yet, cannot purchase');
            return;
        }
        setIsPurchasing(true);
        try {
            const products = await revenueCatService.getProducts([REVENUECAT_PRODUCT_IDS.YEARLY]);
            const product = products?.[0];
            if (!product) {
                console.warn('[RevenueCat] Product not found:', REVENUECAT_PRODUCT_IDS.YEARLY);
                return;
            }
            await revenueCatService.purchaseProduct(product);
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

    return (
        <View style={[styles.container, theme.flexBlocks.vertical16]}>
            <View style={[styles.content, theme.flexBlocks.vertical16]}>
                <View style={theme.flexBlocks.vertical8}>
                    <Text style={[styles.textCenter, styles.oneTimeOffer, theme.fonts.regular]}>
                        􀆅 {t('subscriptionOffering.secondTrial.oneTimeOffer')}
                    </Text>

                    <Text style={[styles.textCenter, theme.fonts.title]}>
                        {t('subscriptionOffering.secondTrial.title')}
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
                    <CustomButton
                        title={t('subscriptionOffering.secondTrial.startFreeOffer')}
                        onPress={() => {
                            // Событие: оплата + план
                            amplitudeAnalyticsService.trackEvent('Onboarding Payment', {
                                plan: 'second_trial',
                            });
                            purchaseYearly().catch(() => {});
                        }}
                        variant="primary"
                        disabled={isPurchasing}
                    />

                    <Pressable
                        onPress={() => {
                            // Событие: скип оплаты
                            amplitudeAnalyticsService.trackEvent('Onboarding Skip Payment');
                            onNext();
                        }}
                    >
                        <Text style={styles.skipTitle}>
                            {t('subscriptionOffering.secondTrial.skipOffer')}
                        </Text>
                    </Pressable>
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
