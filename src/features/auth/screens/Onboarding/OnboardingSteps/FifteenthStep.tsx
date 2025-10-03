import React from "react";
import {StyleSheet, View} from "react-native";
import {useCustomTheme} from "@app/theme/ThemeContext";
import CustomButton from "@shared/components/Button/Button";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {REMINDER_SVG} from "@features/auth/screens/Onboarding/OnboardingSteps/icons";

export default function FifteenthStep({onNext}: { onNext: () => void }) {
    const {theme} = useCustomTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.content, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter]}>
                <RemoteSvg xml={REMINDER_SVG} />
            </View>

            <CustomButton
                title={'See my FREE offer'}
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
    content: {
        flex: 1,
    },
});
