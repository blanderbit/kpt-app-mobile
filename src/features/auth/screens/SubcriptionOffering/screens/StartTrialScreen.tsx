import React, {useState, useRef, useEffect} from "react";
import {StyleSheet, Text, View, TouchableOpacity, Pressable, Alert} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {useTranslation} from "react-i18next";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {LinearGradient} from "expo-linear-gradient";
import {COLORS} from "@app/theme";
import { amplitudeAnalyticsService } from "@shared/services/analytics";
import { revenueCatService } from "@shared/services/revenuecat";
import { REVENUECAT_PRODUCT_IDS, REVENUECAT_PRODUCT_IDENTIFIERS } from "@app/config/revenuecat.config";
import { PurchasesStoreProduct } from "react-native-purchases";
import type { SubscriptionOfferingVariant } from "@features/auth/screens/SubcriptionOffering/types";

interface SubscriptionPlan {
    id: 'yearly' | 'monthly';
    title: string;
    originalPrice: string | null;
    price: string;
    pricePerMonth: string | null;
    hasFreeTrial: boolean;
    freeTrialText: string | null;
    descriptionText: string;
    descriptionHighlight: string;
    descriptionTextAfter?: string;
    product?: PurchasesStoreProduct;
}

interface StartTrialScreenProps {
    onNext: () => void;
    variant?: SubscriptionOfferingVariant;
}

export default function StartTrialScreen({ onNext, variant = 'onboarding' }: StartTrialScreenProps) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();
    const [stepHeights, setStepHeights] = useState<number[]>([]);
    const [selectedSubscription, setSelectedSubscription] = useState<string>('yearly');
    const [isPurchasing, setIsPurchasing] = useState(false);
    const [isLoadingPlans, setIsLoadingPlans] = useState(true);
    const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
    const stepRefs = useRef<(View | null)[]>([]);

    const measureStepHeight = (index: number) => {
        if (stepRefs.current[index]) {
            stepRefs.current[index]?.measure((x, y, width, height) => {
                setStepHeights(prev => {
                    const newHeights = [...prev];
                    newHeights[index] = height;
                    return newHeights;
                });
            });
        }
    };

    const getMarginBottom = (index: number) => {
        if (index >= stepHeights.length - 1) return 0;

        const currentHeight = stepHeights[index] || 0;
        return Math.max(70 - currentHeight, 20);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            subscriptionSteps.forEach((_, index) => {
                measureStepHeight(index);
            });
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Загружаем планы подписки из RevenueCat
    useEffect(() => {
        const loadSubscriptionPlans = async () => {
            if (!revenueCatService.getInitialized()) {
                console.warn('[RevenueCat] Not initialized yet, cannot load plans');
                setIsLoadingPlans(false);
                return;
            }

            try {
                setIsLoadingPlans(true);
                const products = await revenueCatService.getProducts(REVENUECAT_PRODUCT_IDENTIFIERS);

                if (!products || products.length === 0) {
                    console.warn('[RevenueCat] No products found. This might be because:');
                    console.warn('1. Products are not approved in App Store Connect yet');
                    console.warn('2. Products are not configured correctly in RevenueCat Dashboard');
                    console.warn('3. Using StoreKit Configuration file in development');
                    console.warn('Products will be available once approved in App Store Connect.');
                    setIsLoadingPlans(false);
                    return;
                }

                // Находим monthly и yearly продукты
                const monthlyProduct = products.find(p => p.identifier === REVENUECAT_PRODUCT_IDS.MONTHLY);
                const yearlyProduct = products.find(p => p.identifier === REVENUECAT_PRODUCT_IDS.YEARLY);

                const plans: SubscriptionPlan[] = [];

                // Процент выгоды годового vs месячного: (цена_месяц − цена_год/12) / цена_месяц
                let savingsPercent: number | null = null;
                if (yearlyProduct && monthlyProduct && monthlyProduct.price > 0) {
                    const yearlyPerMonth = yearlyProduct.price / 12;
                    savingsPercent = Math.round(
                        ((monthlyProduct.price - yearlyPerMonth) / monthlyProduct.price) * 100
                    );
                    savingsPercent = Math.max(0, Math.min(100, savingsPercent));
                }

                // Годовой план
                if (yearlyProduct) {
                    const yearlyPriceNumber = yearlyProduct.price;
                    const currencyCode = yearlyProduct.currencyCode || 'USD';

                    // Проверяем наличие вводной цены (intro price) для free trial
                    const hasIntroPrice = yearlyProduct.introPrice !== null && yearlyProduct.introPrice !== undefined;
                    // Проверяем, является ли intro price free trial (цена = 0 означает free trial)
                    const isFreeTrial = hasIntroPrice && yearlyProduct.introPrice?.price === 0;

                    // Форматируем цену
                    const yearlyPrice = yearlyProduct.priceString || `${yearlyPriceNumber.toFixed(2)} ${currencyCode}`;

                    // Если есть free trial, не показываем originalPrice (цена не меняется, просто бесплатный период)
                    const originalPrice = null;

                    // Вычисляем цену за месяц для годового плана
                    const pricePerMonth = yearlyPriceNumber / 12;
                    const pricePerMonthString = `${pricePerMonth.toFixed(2)} ${currencyCode}/mo.`;

                    const descriptionHighlight =
                        savingsPercent !== null
                            ? t('subscriptionOffering.startTrial.savePercent', { percent: savingsPercent })
                            : t('subscriptionOffering.startTrial.save58');

                    plans.push({
                        id: 'yearly',
                        title: t('subscriptionOffering.startTrial.yearly'),
                        originalPrice: originalPrice,
                        price: yearlyPrice,
                        pricePerMonth: pricePerMonthString,
                        hasFreeTrial: isFreeTrial,
                        freeTrialText: isFreeTrial ? t('subscriptionOffering.startTrial.freeTrial') : null,
                        descriptionText: t('subscriptionOffering.startTrial.unlimitedAccess'),
                        descriptionHighlight,
                        product: yearlyProduct
                    });
                }

                // Месячный план
                if (monthlyProduct) {
                    const monthlyPrice = monthlyProduct.priceString || `${monthlyProduct.price}`;
                    const monthlyPriceString = `${monthlyPrice}/mo.`;

                    plans.push({
                        id: 'monthly',
                        title: t('subscriptionOffering.startTrial.monthly'),
                        originalPrice: null,
                        price: monthlyPriceString,
                        pricePerMonth: null,
                        hasFreeTrial: false,
                        freeTrialText: null,
                        descriptionText: '',
                        descriptionHighlight: monthlyPriceString.replace('/mo.', '/month'),
                        descriptionTextAfter: t('subscriptionOffering.startTrial.cancelAnytime'),
                        product: monthlyProduct
                    });
                }

                if (plans.length === 0) {
                    console.warn('[RevenueCat] No valid subscription plans found. Products might not be available yet.');
                    console.warn('Please ensure products are approved in App Store Connect.');
                } else {
                    console.log(`[RevenueCat] Successfully loaded ${plans.length} subscription plan(s)`);
                }
                
                setSubscriptionPlans(plans);
            } catch (error: any) {
                console.error('[RevenueCat] Error loading subscription plans:', error);
                // Не показываем критическую ошибку пользователю, просто логируем
                // Это нормально для development, когда продукты еще не одобрены
                if (error?.message?.includes('configuration') || error?.message?.includes('App Store Connect')) {
                    console.warn('[RevenueCat] Configuration issue detected. This is expected if products are not yet approved in App Store Connect.');
                }
            } finally {
                setIsLoadingPlans(false);
            }
        };

        loadSubscriptionPlans();
    }, [t]);

    const subscriptionSteps = [
        {
            icon: `
                <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.08691 13.3535C1.6582 13.3535 0.94043 12.6494 0.94043 11.2412V4.63086C0.94043 3.22266 1.6582 2.51855 3.08691 2.51855H4.03711V1.60254C4.03711 1.08301 4.33105 0.768555 4.85742 0.768555H6.87402C7.40039 0.768555 7.70117 1.08301 7.70117 1.60254V2.51855H10.3057V1.60254C10.3057 1.08301 10.6064 0.768555 11.126 0.768555H13.1426C13.6689 0.768555 13.9697 1.08301 13.9697 1.60254V2.51855H14.9131C16.3486 2.51855 17.0596 3.22266 17.0596 4.63086V11.2412C17.0596 12.6494 16.3486 13.3535 14.9131 13.3535H3.08691Z" fill="#DD583D"/>
                </svg>
            `,
            title: t('subscriptionOffering.startTrial.today'),
            description: t('subscriptionOffering.startTrial.todayDescription')
        },
        {
            icon: `
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.3633 5.5625C9.05762 5.5625 7.99121 4.49609 7.99121 3.19727C7.99121 1.8916 9.05762 0.825195 10.3633 0.825195C11.6553 0.825195 12.7354 1.8916 12.7354 3.19727C12.7354 4.49609 11.6553 5.5625 10.3633 5.5625ZM1.5791 12.5215C0.929688 12.5215 0.546875 12.1934 0.546875 11.6943C0.546875 11.0107 1.2373 10.3955 1.83203 9.78711C2.2832 9.31543 2.40625 8.34473 2.46094 7.55859C2.50879 4.93359 3.20605 3.12891 5.02441 2.47266C5.27734 1.57715 5.98828 0.873047 6.99316 0.873047C7.30762 0.873047 7.59473 0.941406 7.84082 1.06445C7.35547 1.63867 7.05469 2.38379 7.05469 3.19727C7.05469 5.00879 8.54492 6.49902 10.3564 6.49902C10.7461 6.49902 11.1152 6.42383 11.457 6.28711C11.498 6.69043 11.5254 7.11426 11.5322 7.55859C11.5869 8.34473 11.71 9.31543 12.1611 9.78711C12.749 10.3955 13.4463 11.0107 13.4463 11.6943C13.4463 12.1934 13.0566 12.5215 12.4141 12.5215H1.5791ZM6.99316 15.2627C5.83789 15.2627 4.99023 14.415 4.90137 13.458H9.0918C9.00293 14.415 8.15527 15.2627 6.99316 15.2627Z" fill="#DD583D"/>
                </svg>
            `,
            title: t('subscriptionOffering.startTrial.day5'),
            description: t('subscriptionOffering.startTrial.day5Description')
        },
        {
            icon: `
                <svg width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.92969 10.9492L1.96582 7.0459C1.93164 7.05273 1.89746 7.05273 1.86328 7.05273C0.967773 7.05273 0.229492 6.32129 0.229492 5.41211C0.229492 4.5166 0.960938 3.78516 1.86328 3.78516C2.76562 3.78516 3.49023 4.52344 3.49023 5.41211C3.49023 5.69238 3.42871 5.94531 3.30566 6.1709L5.35645 7.66797C5.58887 7.83203 5.72559 7.77734 5.8418 7.59961L8.2207 4.01074C7.71484 3.7373 7.36621 3.19727 7.36621 2.5752C7.36621 1.67969 8.09082 0.948242 9 0.948242C9.89551 0.948242 10.627 1.68652 10.627 2.5752C10.627 3.19727 10.2783 3.7373 9.77246 4.01074L12.1309 7.5791C12.2607 7.76367 12.418 7.8252 12.6504 7.66113L14.6875 6.17773C14.5713 5.95215 14.5029 5.69238 14.5029 5.41211C14.5029 4.52344 15.2344 3.78516 16.1299 3.78516C17.0322 3.78516 17.7637 4.5166 17.7637 5.41211C17.7637 6.32129 17.0254 7.05273 16.1299 7.05273C16.0957 7.05273 16.0615 7.05273 16.0273 7.0459L15.0771 10.9492H2.92969ZM3.15527 11.8857H14.8447L14.6396 12.7061C14.373 13.7861 13.8125 14.3193 12.6777 14.3193H5.31543C4.1875 14.3193 3.62012 13.7725 3.36035 12.7061L3.15527 11.8857Z" fill="#DD583D"/>
                </svg>
            `,
            title: t('subscriptionOffering.startTrial.day7'),
            description: t('subscriptionOffering.startTrial.day7Description')
        }
    ]

    const purchaseSelectedPlan = async () => {
        const selectedPlan = subscriptionPlans.find(plan => plan.id === selectedSubscription);

        if (!selectedPlan || !selectedPlan.product) {
            console.warn('[RevenueCat] Selected plan or product not found');
            return;
        }

        if (!revenueCatService.getInitialized()) {
            console.warn('[RevenueCat] Not initialized yet, cannot purchase');
            return;
        }

        setIsPurchasing(true);
        try {
            await revenueCatService.purchaseProduct(selectedPlan.product);
            onNext();
        } catch (e: any) {
            // В библиотеке обычно есть e.userCancelled
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

    const isSettingsVariant = variant === 'settings';

    return (
        <View style={[styles.container, theme.flexBlocks.vertical16]}>
            <View style={[styles.content, theme.flexBlocks.vertical16]}>
                <View style={theme.flexBlocks.vertical8}>
                    {!isSettingsVariant && (
                        <Text style={[styles.textCenter, styles.oneTimeOffer, theme.fonts.regular]}>
                            􀆅 {t('subscriptionOffering.startTrial.oneTimeOfferApplied')}
                        </Text>
                    )}

                    <Text style={[styles.textCenter, theme.fonts.title]}>
                        {t('subscriptionOffering.startTrial.title')}
                    </Text>

                    {!isSettingsVariant && (
                        <Text style={[styles.textCenter, styles.description, theme.fonts.regular]}>
                            􀝋 {t('subscriptionOffering.startTrial.usedBy')}
                        </Text>
                    )}
                </View>

                <View style={[styles.periodContainer]}>
                    {subscriptionSteps.map((step, index) => (
                        <View
                            key={index}
                            style={[theme.flexBlocks.horizontal16, {marginBottom: getMarginBottom(index), flexShrink: 1, minWidth: 0}]}
                            onLayout={() => measureStepHeight(index)}
                        >
                            <View
                                style={[styles.iconBlock, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter]}>
                                <RemoteSvg xml={step.icon}/>
                            </View>

                            <View
                                ref={(ref) => {
                                    stepRefs.current[index] = ref;
                                }}
                                style={{flex: 1, flexShrink: 1, minWidth: 0}}
                            >
                                <Text style={styles.periodTitle}>
                                    {step.title}
                                </Text>

                                <Text style={[theme.fonts.regular, {flexShrink: 1}]}>
                                    {step.description}
                                </Text>
                            </View>
                        </View>
                    ))}

                    <LinearGradient colors={['#F2CFD64D', '#FFFFFF']}
                                    start={{x: 0, y: 0}}
                                    end={{x: 0, y: 1}}
                                    style={[styles.iconBlockContainer]}>
                    </LinearGradient>
                </View>

                <View style={[styles.subscriptionContainer, theme.flexBlocks.vertical8]}>
                    {isLoadingPlans ? (
                        <View style={styles.loadingContainer}>
                            <Text style={theme.fonts.regular}>{t('subscriptionOffering.startTrial.loadingPlans')}</Text>
                        </View>
                    ) : subscriptionPlans.length === 0 ? (
                        <View style={styles.loadingContainer}>
                            <Text style={theme.fonts.regular}>{t('subscriptionOffering.startTrial.noPlansAvailable')}</Text>
                        </View>
                    ) : (
                        subscriptionPlans.map((plan) => {
                        const isSelected = selectedSubscription === plan.id;

                        return (
                            <TouchableOpacity
                                key={plan.id}
                                activeOpacity={0.7}
                                onPress={() => setSelectedSubscription(plan.id)}
                            >
                                <View style={[
                                    styles.subscriptionBlock,
                                    isSelected && styles.subscriptionBlockSelected
                                ]}>
                                    <View style={[theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter]}>
                                        <View>
                                            <Text style={[
                                                styles.subscriptionTitle,
                                                isSelected && styles.subscriptionTitleSelected
                                            ]}>
                                                {plan.title}
                                            </Text>
                                            {plan.originalPrice && (
                                                <View style={theme.flexBlocks.horizontal4}>
                                                    <Text
                                                        style={[styles.subscriptionPrice, styles.subscriptionPriceCrossed]}>
                                                        {plan.originalPrice}
                                                    </Text>
                                                    <Text style={styles.subscriptionPrice}>
                                                        {plan.price}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        <Text style={[
                                            styles.subscriptionPrice,
                                            isSelected && styles.subscriptionPriceSelected
                                        ]}>
                                            {plan.pricePerMonth || plan.price}
                                        </Text>
                                    </View>

                                    {/* Зелёная плашка "7-Day Free Trial" — только в онбординге */}
                                    {!isSettingsVariant && (plan.id === 'yearly' || plan.hasFreeTrial) && (
                                        <View style={styles.subscriptionLabel}>
                                            <Text style={styles.subscriptionLabelText}>
                                                {plan.freeTrialText ?? t('subscriptionOffering.startTrial.freeTrial')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </TouchableOpacity>
                        );
                    }))}
                </View>
            </View>

            <View style={theme.flexBlocks.vertical16}>
                <View style={styles.subscriptionDescription}>
                    {(() => {
                        const selectedPlan = subscriptionPlans.find(plan => plan.id === selectedSubscription);
                        if (!selectedPlan) return null;
                        const { descriptionText, descriptionHighlight, descriptionTextAfter } = selectedPlan;
                        const hasLeading = Boolean(descriptionText?.trim());
                        return (
                            <Text style={[theme.fonts.regular, styles.descriptionText]}>
                                {hasLeading ? descriptionText : null}
                                {hasLeading ? ' ' : null}
                                <Text style={styles.descriptionHighlight}>
                                    {descriptionHighlight}
                                </Text>
                                {descriptionTextAfter ?? ''}
                            </Text>
                        );
                    })()}
                </View>

                <View style={theme.flexBlocks.vertical8}>
                    <CustomButton
                        title={isSettingsVariant ? t('subscriptionOffering.startTrial.subscribe') : (selectedSubscription === 'yearly' ? t('subscriptionOffering.startTrial.startFreeTrial') : t('subscriptionOffering.startTrial.subscribe'))}
                        onPress={() => {
                            if (!isSettingsVariant) {
                                amplitudeAnalyticsService.trackEvent('Onboarding Payment', { plan: selectedSubscription });
                            } else {
                                amplitudeAnalyticsService.trackEvent('Profile Subscription Change Plan', { plan: selectedSubscription });
                            }
                            purchaseSelectedPlan().catch(() => {});
                        }}
                        variant="primary"
                        disabled={isPurchasing || isLoadingPlans || subscriptionPlans.length === 0}
                    />

                    {!isSettingsVariant && (
                        <Pressable
                            onPress={() => {
                                amplitudeAnalyticsService.trackEvent('Onboarding Skip Payment');
                                onNext();
                            }}
                        >
                            <Text style={styles.skipTitle}>
                                {t('subscriptionOffering.startTrial.skipOffer')}
                            </Text>
                            <Text style={styles.skipDescription}>
                                {t('subscriptionOffering.startTrial.offerExpires')}
                            </Text>
                        </Pressable>
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
    textCenter: {
        textAlign: 'center',
    },
    oneTimeOffer: {
        color: '#1E9F79'
    },
    description: {
        opacity: .6
    },
    periodContainer: {},
    iconBlockContainer: {
        borderRadius: 44,
        position: 'absolute',
        width: 40,
        height: '105%',
        top: 0,
        left: 0,
        zIndex: -1
    },
    iconBlock: {
        width: 40,
        height: 40,
        backgroundColor: '#F2CFD6',
        borderRadius: 44
    },
    periodTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'SF Pro Display Semibold',
        letterSpacing: 0
    },
    subscriptionContainer: {
        backgroundColor: '#DADADA4D',
        borderRadius: 20,
        padding: 12
    },
    subscriptionBlock: {
        position: 'relative',
        padding: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D6D8DD',
    },
    subscriptionBlockSelected: {
        borderColor: '#246B56'
    },
    subscriptionTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'SF Pro Display Semibold',
        letterSpacing: 0,
        opacity: .6
    },
    subscriptionTitleSelected: {
        opacity: 1
    },
    subscriptionLabel: {
        position: 'absolute',
        top: -10,
        right: '5%',
        backgroundColor: '#246B56',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 2
    },
    subscriptionLabelText: {
        color: 'white',
        fontFamily: 'SF Pro Display',
        fontSize: 10,
        lineHeight: 12,
    },
    subscriptionPrice: {
        fontFamily: 'SF Pro Display',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        opacity: .6
    },
    subscriptionPriceSelected: {
        color: '#246B56',
        fontFamily: 'SF Pro Display Semibold',
        opacity: 1
    },
    subscriptionPriceCrossed: {
        textDecorationLine: 'line-through'
    },
    subscriptionDescription: {
        textAlign: 'center',
    },
    descriptionText: {
        textAlign: 'center',
        fontFamily: 'SF Pro Display Semibold',
        fontSize: 16,
        lineHeight: 22
    },
    descriptionHighlight: {
        color: COLORS.warning,
    },
    skipTitle: {
        fontFamily: 'InterSemibold',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: -0.02,
        textAlign: 'center'
    },
    skipDescription: {
        fontFamily: 'InterSemibold',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: -0.02,
        color: '#DD583D',
        textAlign: 'center'
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
