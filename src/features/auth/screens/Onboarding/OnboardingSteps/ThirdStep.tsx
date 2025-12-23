import React from "react";
import {StyleSheet, Text, View, Image, ScrollView} from "react-native";
import {useTranslation} from 'react-i18next';
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import { isSmallScreen } from "@shared/utils/screenUtils";

export default function ThirdStep({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();
    const isSmall = isSmallScreen();

    const content = (
                <View style={styles.content}>
                    <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.vertical8, styles.centerBlock]}>
                        <Image
                            source={require('@assets/images/onboarding-img.png')}/>
                        <Text style={styles.centerBlockText}>
                            {t('onboarding.texts.step3QuestionsText')}
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
                    title={t('onboarding.buttons.continue')}
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
        paddingBottom: 40
    },
    centerBlockText: {
        fontFamily: 'SF Pro Display Bold',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        opacity: .6
    }
});
