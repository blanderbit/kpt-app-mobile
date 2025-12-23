import React from "react";
import {StyleSheet, View, ScrollView} from "react-native";
import {useTranslation} from 'react-i18next';
import {useCustomTheme} from "@app/theme/ThemeContext";
import CustomButton from "@shared/components/Button/Button";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {REMINDER_SVG} from "@features/auth/screens/Onboarding/OnboardingSteps/icons";
import { isSmallScreen } from "@shared/utils/screenUtils";

export default function FifteenthStep({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();
    const isSmall = isSmallScreen();

    const content = (
        <View style={[styles.content, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter]}>
            <RemoteSvg xml={REMINDER_SVG} />
        </View>
    );

    return (
        <View style={styles.container}>
            {isSmall ? (
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                    {content}
            </ScrollView>
            ) : (
                content
            )}

            <CustomButton
                title={t('onboarding.buttons.seeMyFreeOffer')}
                onPress={onNext}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
});
