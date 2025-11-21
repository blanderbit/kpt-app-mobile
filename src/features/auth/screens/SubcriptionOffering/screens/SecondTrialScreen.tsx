import React from "react";
import {Pressable, StyleSheet, Text, View} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {useTranslation} from "react-i18next";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {COLORS} from "@app/theme";
import {BigNewsIcon} from "@features/auth/screens/SubcriptionOffering/screens/icons";

export default function SecondTrialScreen({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();

    return (
        <View style={[styles.container, theme.flexBlocks.vertical16]}>
            <View style={[styles.content, theme.flexBlocks.vertical16]}>
                <View style={theme.flexBlocks.vertical8}>
                    <Text style={[styles.textCenter, styles.oneTimeOffer, theme.fonts.regular]}>
                        􀆅 One-time offer!
                    </Text>

                    <Text style={[styles.textCenter, theme.fonts.title]}>
                        41% OFF when you start your free trial now
                    </Text>

                    <Text style={[styles.textCenter, styles.description, theme.fonts.regular]}>
                        Biggest discount ever - just for you
                    </Text>
                </View>

                <View style={[theme.flexBlocks.justifyCenter, theme.flexBlocks.alignCenter, { flex: 1}]}>
                    <RemoteSvg xml={BigNewsIcon} />
                </View>
            </View>

            <View style={theme.flexBlocks.vertical16}>
                <View style={styles.subscriptionDescription}>
                    <Text style={[theme.fonts.regular, styles.descriptionText]}>
                        Biggest discount ever - just for you
                    </Text>
                </View>

                <View style={theme.flexBlocks.vertical16}>
                    <CustomButton
                        title="Start my FREE offer"
                        onPress={onNext}
                        variant="primary"
                    />

                    <Pressable>
                        <Text style={styles.skipTitle}>
                            Skip this one-time offer
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
