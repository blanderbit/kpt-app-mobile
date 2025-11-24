import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {useTranslation} from "react-i18next";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {COLORS} from "@app/theme";
import {
    BigNewsIcon,
    discountForeverIcon,
    radialGradientIcon
} from "@features/auth/screens/SubcriptionOffering/screens/icons";
import ToggleSwitch from "@shared/components/ToggleSwitch";
import { amplitudeAnalyticsService } from "@shared/services/analytics";

const STAR_ICON_SVG = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.08203 19.0801C1.97266 19.0801 0.878906 17.9961 0.878906 15.9062V4.02148C0.878906 1.93164 1.97266 0.847656 4.08203 0.847656H15.9082C18.0176 0.847656 19.1113 1.93164 19.1113 4.02148V15.9062C19.1113 17.9863 18.0176 19.0801 15.9082 19.0801H4.08203ZM7.1875 15.1152L10.0195 13.0449L12.8516 15.1152C13.457 15.5742 14.1016 15.1152 13.8574 14.3926L12.7441 11.0527L15.5957 9.01172C16.1426 8.62109 15.9961 7.80078 15.2051 7.81055L11.6992 7.83984L10.6348 4.49023C10.4102 3.78711 9.62891 3.78711 9.4043 4.49023L8.33984 7.83984L4.83398 7.81055C4.05273 7.80078 3.88672 8.61133 4.44336 9.01172L7.29492 11.0625L6.18164 14.3926C5.9375 15.1055 6.58203 15.5742 7.1875 15.1152Z" fill="#BBBBBB"/>
</svg>
`

export default function ThirdTrialScreen({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();
    const [freeTrialEnabled, setFreeTrialEnabled] = React.useState(true);

    return (
        <View style={[styles.container, theme.flexBlocks.vertical64]}>
            <View style={[styles.content, theme.flexBlocks.vertical8]}>
                <View style={theme.flexBlocks.vertical8}>
                    <Text style={[styles.textCenter, theme.fonts.title]}>
                        Your one time offer
                    </Text>

                    <Text style={[styles.textCenter, styles.description, theme.fonts.regular]}>
                        7-Day Free Trial
                    </Text>
                </View>

                <View style={[theme.flexBlocks.justifyCenter, theme.flexBlocks.alignCenter, {flex: 1}]}>
                    <RemoteSvg xml={discountForeverIcon}/>

                    <View style={styles.radialBackground}>
                        <RemoteSvg xml={radialGradientIcon}/>
                    </View>
                </View>

                <View style={theme.flexBlocks.vertical4}>
                    <View style={[theme.flexBlocks.horizontal4, theme.flexBlocks.justifyCenter]}>
                        <Text style={[styles.mainPrice, styles.mainPriceOld]}>
                            7.08
                        </Text>
                        <Text style={styles.mainPrice}>
                            2.91 USD/month
                        </Text>
                    </View>

                    <Text style={styles.mainPriceDesc}>
                        Once you close your one-time offer, it's gone!
                    </Text>
                </View>

                <View style={theme.flexBlocks.vertical8}>
                    <View style={[styles.freeTrialSection, theme.flexBlocks.justifySpaceBetween]}>
                        <View style={[styles.freeTrialSectionEnabled, theme.flexBlocks.horizontal8, theme.flexBlocks.alignCenter]}>
                            <RemoteSvg xml={STAR_ICON_SVG}/>

                            <Text style={styles.freeTrialSectionText}>
                                Free Trial {freeTrialEnabled ? 'Enabled' : 'Disabled'}
                            </Text>
                        </View>

                        <ToggleSwitch
                            options={[
                                {label: 'Off', value: 'off'},
                                {label: 'On', value: 'on'}
                            ]}
                            value={freeTrialEnabled ? 'on' : 'off'}
                            onChange={(value) => setFreeTrialEnabled(value === 'on')}
                        />
                    </View>

                    <View style={[styles.sevenDayFreeTrialSection, theme.flexBlocks.vertical8]}>
                        <View>
                            <Text style={styles.sevenDayFreeTrialSectionText}>
                                7-DAY FREE TRIAL
                            </Text>
                        </View>

                        <View style={[styles.subscriptionBlock, theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter]}>
                            <View>
                                <Text style={styles.subscriptionBlockTitle}>
                                    Yearly
                                </Text>

                                <Text style={styles.subscriptionBlockDescription}>
                                    12mo - 34.99 USD
                                </Text>
                            </View>

                            <View>
                                <Text style={styles.subscriptionBlockPrice}>
                                    2.91 USD/mo
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View style={theme.flexBlocks.vertical16}>
                <View style={[styles.subscriptionDescription, theme.flexBlocks.justifyCenter]}>
                    <Text style={[theme.fonts.regular, styles.descriptionText, styles.checkmark]}>
                        􀆅
                    </Text>
                    <Text style={[theme.fonts.regular, styles.descriptionText]}>
                        No Payment Now
                    </Text>
                </View>

                <View style={theme.flexBlocks.vertical16}>
                    <CustomButton
                        title="Start Your FREE Week"
                        onPress={() => {
                            // Событие: оплата + план
                            amplitudeAnalyticsService.trackEvent('Onboarding Payment', {
                                plan: 'yearly',
                                free_trial_enabled: freeTrialEnabled,
                            });
                            onNext();
                        }}
                    />
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
    description: {
        opacity: .6
    },
    subscriptionDescription: {
        textAlign: 'center',
        flexDirection: 'row',
        gap: 2
    },
    descriptionText: {
        textAlign: 'center',
        fontFamily: 'SF Pro Display Semibold',
        fontSize: 18,
        lineHeight: 24,
    },
    radialBackground: {
        position: 'absolute',
        zIndex: -1
    },
    checkmark: {
        color: '#1E9F79',
        marginRight: 2
    },
    mainPrice: {
        fontFamily: 'SF Pro Display Semibold',
        fontSize: 32,
        lineHeight: 44,
        letterSpacing: 0,
    },
    mainPriceOld: {
        textDecorationLine: 'line-through',
    },
    mainPriceDesc: {
        fontFamily: 'SF Pro Display Semibold',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: 'center',
        opacity: .6
    },
    freeTrialSection: {
        borderRadius: 16,
        backgroundColor: '#F5F5F5',
        padding: 12,
        paddingHorizontal: 8
    },
    freeTrialSectionEnabled: {
        paddingHorizontal: 8,
    },
    freeTrialSectionText: {
        fontFamily: 'InterSemibold',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.02
    },
    sevenDayFreeTrialSection: {
        backgroundColor: '#F2CFD6',
        borderRadius: 20,
        padding: 4
    },
    sevenDayFreeTrialSectionText: {
        fontFamily: 'SF Pro Display Semibold',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: 'center',
    },
    subscriptionBlock: {
        borderRadius: 16,
        padding: 12,
        backgroundColor: '#FFF'
    },
    subscriptionBlockTitle: {
        fontFamily: 'SF Pro Display Semibold',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0
    },
    subscriptionBlockDescription: {
        fontFamily: 'SF Pro Display',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        opacity: .6
    },
    subscriptionBlockPrice: {
        fontFamily: 'SF Pro Display Semibold',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        color: '#246B56'
    }
});
