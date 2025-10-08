import React, { useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert, Platform} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@app/hooks/auth.hook';
import { LoginIcon } from '@assets/icons/LoginIcon';
import { Input } from '@shared/components/Input/Input';
import { ErrorMessage } from '@shared/components/ErrorMessage/ErrorMessage';
import { useTranslation } from 'react-i18next';
import CustomButton from "@shared/components/Button/Button";
import { AppleIcon } from "@assets/icons/AppleLogo";
import { COLORS } from "@app/theme";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { LoginScreenNavigationProp } from "@app/navigation/AppNavigator";
import { Routes } from "@app/navigation/const";
import { useFirebaseAuth } from '@app/hooks/use-firebase-auth.hook';

const schema =  (t: any) => yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string()
        .required(t('auth.checkEmailScreen.passwordRequired'))
        .min(8, t('auth.checkEmailScreen.passwordMinLength'))
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, t('auth.checkEmailScreen.passwordComplexity')),
});

type FormData = {
    email: string;
    password: string;
};

export default function LoginScreen({ navigation }: { navigation: LoginScreenNavigationProp }) {
    const { t } = useTranslation();
    const { login, isLoading, error } = useAuth();
    const { signInWithGoogle, signInWithApple, isLoading: firebaseLoading, error: firebaseError } = useFirebaseAuth();
    const { theme, themeName } = useCustomTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema(t)),
        defaultValues: {
            email: 'd.utyuzh@codeska.com',
            password: 'password123',
        },
    });

    const onSubmit = async (data: FormData) => {
        console.log('📝 Форма отправлена:', data);
        try {
            setIsSubmitting(true);
            await login(data.email, data.password);
        } catch (error: any) {
            console.error('❌ Ошибка в onSubmit:', error);
            Alert.alert(
                'Ошибка входа',
                error.message || 'Неверный email или пароль',
                [{ text: 'OK' }]
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = () => {
        // navigation.navigate(Routes.RESET_PASS);
        navigation.navigate(Routes.ONBOARDING);
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error: any) {
            Alert.alert(
                'Ошибка входа через Google',
                error.message || 'Не удалось войти через Google',
                [{ text: 'OK' }]
            );
        }
    };

    const handleAppleSignIn = async () => {
        try {
            await signInWithApple();
        } catch (error: any) {
            Alert.alert(
                'Ошибка входа через Apple',
                error.message || 'Не удалось войти через Apple',
                [{ text: 'OK' }]
            );
        }
    };

    return (
        <SafeAreaView style={ [ styles.safeArea, theme.flexBlocks.justifyCenter, theme.flexBlocks.alignCenter ] }>
            <View style={ styles.mainContainer }>
                <LoginIcon/>

                <View style={ styles.head }>
                    <Text style={ [ styles.title, { ...theme.fonts.title } ] }>{ t('auth.welcome') }</Text>
                    <Text style={ [ styles.info, { ...theme.fonts.regular } ] }>{ t('auth.info') }</Text>
                </View>

                <View style={ styles.container }>
                    <Controller
                        control={ control }
                        name="email"
                        render={ ({ field: { value, onChange } }) => (
                            <Input
                                label={ t('auth.email') }
                                value={ value }
                                onChangeText={ onChange }
                                error={ errors.email?.message }
                                keyboardType="email-address"
                                spellCheck={false}
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect={false}
                                textContentType="none"
                            />
                        ) }
                    />

                    <Controller
                        control={ control }
                        name="password"
                        render={ ({ field: { value, onChange } }) => (
                            <Input
                                label={ t('auth.password') }
                                value={ value }
                                onChangeText={ onChange }
                                secureTextEntry
                                showPasswordToggle
                                error={ errors.password?.message }
                                autoComplete="password"
                            />
                        ) }
                    />

                    <ErrorMessage message={ error || firebaseError || '' } visible={ !!(error || firebaseError) } />

                    <Text style={ styles.forgotPassword } onPress={ handleForgotPassword }>
                        { t('auth.forgotPass') }
                    </Text>
                </View>

                <View style={styles.container}>
                    <CustomButton 
                        title={ t('auth.login') } 
                        onPress={ handleSubmit(onSubmit) }
                        disabled={ isSubmitting || isLoading }
                        loading={ isSubmitting || isLoading }
                    />

                    <CustomButton 
                        title={ t('auth.appleSignIn') } 
                        onPress={ handleAppleSignIn }
                        themeName="white"
                        disabled={ isSubmitting || isLoading || firebaseLoading }
                    >
                        <AppleIcon fill={ themeName === 'Green' ? 'white' : 'black' }/>
                    </CustomButton>

                    <CustomButton
                        title={ t('auth.googleSignIn') }
                        onPress={ handleGoogleSignIn }
                        themeName="white"
                        disabled={ isSubmitting || isLoading || firebaseLoading }>
                    </CustomButton>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    mainContainer: {
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 24,
        paddingHorizontal: 8,
        paddingBottom: 16,
        gap: 16,
        borderRadius: 24,
        backgroundColor: '#fff',
    },
    head: {
        paddingVertical: 16,
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        marginBottom: 10
    },
    title: {
        textAlign: 'center',
    },
    info: {
        opacity: 0.6,
        textAlign: 'center',
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        width: '100%',
    },
    forgotPassword: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'InterSemibold',
        color: COLORS.warning,
        fontWeight: '600',
        paddingBottom: 40,
    }
});

