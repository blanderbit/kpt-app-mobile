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
} from "@features/auth/screens/SubcriptionOffering/screens/const";

export default function ThirdTrialScreen({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();

    return (
        <View style={[styles.container, theme.flexBlocks.vertical16]}>
            <View style={[styles.content, theme.flexBlocks.vertical16]}>
                <View style={theme.flexBlocks.vertical8}>
                    <Text style={[styles.textCenter, theme.fonts.title]}>
                        Your one time offer
                    </Text>

                    <Text style={[styles.textCenter, styles.description, theme.fonts.regular]}>
                        7-Day Free Trial
                    </Text>
                </View>

                <View style={[theme.flexBlocks.justifyCenter, theme.flexBlocks.alignCenter, { flex: 1}]}>
                    <RemoteSvg xml={discountForeverIcon} />

                    <View style={styles.radialBackground}>
                        <RemoteSvg xml={radialGradientIcon} />
                    </View>
                </View>

                <View>
                    <Text>
                        7.08 2.91 USD/month
                    </Text>

                    <Text>
                        Once you close your one-time offer, it's gone!
                    </Text>
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
                        onPress={onNext}
                        variant="primary"
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
});
