import React from "react";
import {Pressable, StyleSheet, Text, View, Alert, ScrollView} from "react-native";
import {useCustomTheme} from "@app/theme/ThemeContext";
import CustomButton from "@shared/components/Button/Button";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {COLORS} from "@app/theme";
import {AppleIcon} from "@assets/icons/AppleLogo";
import GoogleIcon from "@assets/icons/GoogleIcon";
import { Routes } from "@app/navigation/const";
import { useNavigation } from "@react-navigation/native";
import { LoginScreenNavigationProp } from "@app/navigation/AppNavigator";
import { useFirebaseAuth } from '@app/hooks/use-firebase-auth.hook';
import { useTranslation } from 'react-i18next';
import { isSmallScreen } from "@shared/utils/screenUtils";

export default function SeventeenthStep({onNext}: { onNext: () => void }) {
    const {theme} = useCustomTheme();
    const { t } = useTranslation();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { signUpWithGoogle, signUpWithApple, isLoading: firebaseLoading } = useFirebaseAuth();

    const handleSignUp = () => {
        navigation.navigate(Routes.SIGN_UP);
    };

    const handleLogin = () => {
        navigation.navigate(Routes.LOGIN);
    };

    const handleGoogleSignIn = async () => {
        try {
            await signUpWithGoogle();
        } catch (error: any) {
            const msg = error?.message && (error.message.startsWith('auth.') || error.message.startsWith('main.')) ? t(error.message) : (error?.message || t('auth.signUp.googleSignInErrorMessage'));
            Alert.alert(
                t('auth.signUp.googleSignInError'),
                msg,
                [{ text: t('ok') }]
            );
        }
    };

    const handleAppleSignIn = async () => {
        try {
            await signUpWithApple();
        } catch (error: any) {
            const msg = error?.message && (error.message.startsWith('auth.') || error.message.startsWith('main.')) ? t(error.message) : (error?.message || t('auth.signUp.appleSignInErrorMessage'));
            Alert.alert(
                t('auth.signUp.appleSignInError'),
                msg,
                [{ text: t('ok') }]
            );
        }
    };

    const isSmall = isSmallScreen();

    const scrollContent = (
                <View style={[styles.content, theme.flexBlocks.vertical32]}>
                    <View style={[theme.flexBlocks.alignCenter, styles.haveAnAccSection]}>
                        <View style={theme.flexBlocks.alignCenter}>
                            <Text style={styles.haveAnAccText}>{t('onboarding.texts.alreadyHaveAccount')}</Text>
                            <Pressable onPress={handleLogin}>
                                <Text style={[styles.haveAnAccText, styles.logIn]}>{t('onboarding.buttons.logIn')}</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={theme.flexBlocks.vertical16}>
                        <View style={theme.flexBlocks.vertical8}>
                            <Pressable
                                style={[theme.flexBlocks.horizontal8, theme.flexBlocks.alignCenter, styles.logInBtn]}
                                onPress={handleAppleSignIn}
                                disabled={firebaseLoading}
                            >
                                <AppleIcon/>

                                <Text style={styles.logInBtnText}>
                                    {t('onboarding.texts.step17ContinueWithApple')}
                                </Text>
                            </Pressable>

                            <Pressable
                                style={[theme.flexBlocks.horizontal8, theme.flexBlocks.alignCenter, styles.logInBtn]}
                                onPress={handleGoogleSignIn}
                                disabled={firebaseLoading}
                            >
                                <GoogleIcon/>

                                <Text style={styles.logInBtnText}>
                                    {t('onboarding.texts.step17ContinueWithGoogle')}
                                </Text>
                            </Pressable>
                        </View>

                        <CustomButton
                            title={t('onboarding.buttons.skip')}
                            onPress={handleSignUp}
                            themeName={'white_no_border'}
                        />
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
                    {scrollContent}
            </ScrollView>
            ) : (
                scrollContent
            )}

            <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.vertical8]}>
                <RemoteSvg xml={`
                    <svg width="15" height="21" viewBox="0 0 15 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path opacity="0.6" d="M2.8418 20.5391C1.31836 20.5391 0.537109 19.7383 0.537109 18.0879V11.0273C0.537109 9.5625 1.16211 8.77148 2.38281 8.61523V6.33008C2.38281 2.77539 4.74609 0.861328 7.5 0.861328C10.2441 0.861328 12.6172 2.77539 12.6172 6.33008V8.61523C13.8281 8.77148 14.4531 9.57227 14.4531 11.0273V18.0879C14.4531 19.7383 13.6719 20.5391 12.1484 20.5391H2.8418ZM4.42383 6.18359V8.5957H10.5859V6.18359C10.5859 4.02539 9.17969 2.81445 7.5 2.81445C5.81055 2.81445 4.42383 4.02539 4.42383 6.18359Z" fill="black"/>
                    </svg>
                `}/>

                <Text style={[theme.fonts.regular, styles.bottomText]}>
                    {t('onboarding.texts.step17SecurityText')}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 8
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        paddingVertical: 20,
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    haveAnAccSection: {
        height: 52,
        margin: 'auto'
    },
    haveAnAccText: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'SF Pro Display Semibold',
        marginRight: 2
    },
    logIn: {
        color: COLORS.warning,
    },
    logInBtn: {
        padding: 16,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ECF1F8'
    },
    logInBtnText: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: 'SF Pro Display Semibold',
        opacity: .54
    },
    bottomText: {
        textAlign: 'center',
        opacity: .6
    }
});
