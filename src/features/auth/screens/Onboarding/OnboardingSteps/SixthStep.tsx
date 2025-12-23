import React from "react";
import {StyleSheet, Text, View, Image, ScrollView} from "react-native";
import {useTranslation} from 'react-i18next';
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import { isSmallScreen } from "@shared/utils/screenUtils";

export default function SixthStep({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();
    const isSmall = isSmallScreen();

    const content = (
                <View style={styles.content}>
                    <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.vertical16, styles.centerBlock]}>
                        <Image
                            source={require('@assets/images/onboarding-awesome.png')}/>
                        <Text style={styles.centerBlockText}>
                            {t('onboarding.texts.step6Text')}
                        </Text>
                    </View>
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

            <View style={theme.flexBlocks.vertical8}>
                <CustomButton
                    title={t('onboarding.buttons.showMeHow')}
                    onPress={onNext}
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
    },
    centerBlock: {
        paddingVertical: 20,
        gap: 16
    },
    centerBlockText: {
        fontFamily: 'SF Pro Display Bold',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        opacity: .6
    }
});
