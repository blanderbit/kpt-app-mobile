import React, { useState } from 'react';
import {View, Text, StyleSheet, SafeAreaView, Alert, Platform} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@app/hooks/auth.hook';
import { LoginIcon } from '@assets/icons/LoginIcon';
import { Input } from '@shared/components/Input/Input';
import { useTranslation } from 'react-i18next';
import CustomButton from "@shared/components/Button/Button";
import { COLORS } from "@app/theme";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { SignUpScreenNavigationProp } from "@app/navigation/AppNavigator";
import { Routes } from "@app/navigation/const";

const schema = (t: any) => yup.object().shape({
    name: yup.string()
        .required(t('auth.signUp.nameRequired'))
        .min(2, t('auth.signUp.nameMinLength')),
    email: yup.string()
        .email(t('auth.signUp.invalidEmail'))
        .required(t('auth.signUp.emailRequired')),
    password: yup.string()
        .required(t('auth.signUp.passwordRequired'))
        .min(8, t('auth.signUp.passwordMinLength'))
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, t('auth.signUp.passwordComplexity')),
    repeat_password: yup.string()
        .required(t('auth.signUp.repeatPasswordRequired'))
        .oneOf([yup.ref('password')], t('auth.signUp.passwordsMustMatch')),
});

type FormData = {
    name: string;
    email: string;
    password: string;
    repeat_password: string;
};

export default function SignUpScreen({ navigation }: { navigation: SignUpScreenNavigationProp }) {
    const { t } = useTranslation();
    const { register, isLoading, error } = useAuth();
    const { theme, themeName } = useCustomTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema(t)),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            repeat_password: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        console.log('📝 Форма регистрации отправлена:', data);
        try {
            setIsSubmitting(true);
            // Используем функцию register из useAuth
            await register(data.email, data.password, data.name);
        } catch (error: any) {
            console.error('❌ Ошибка в onSubmit:', error);
            Alert.alert(
                t('auth.signUp.registrationError'),
                error.message || t('auth.signUp.registrationErrorMessage'),
                [{ text: 'OK' }]
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleNavigateToLogin = () => {
        navigation.navigate(Routes.LOGIN);
    };

    return (
        <SafeAreaView style={ [ styles.safeArea, theme.flexBlocks.justifyCenter, theme.flexBlocks.alignCenter ] }>
            <View style={ styles.mainContainer }>
                <LoginIcon/>

                <View style={ styles.head }>
                    <Text style={ [ styles.title, { ...theme.fonts.title } ] }>{ t('auth.signUp.title') }</Text>
                </View>

                <View style={ styles.container }>
                    <Controller
                        control={ control }
                        name="name"
                        render={ ({ field: { value, onChange } }) => (
                            <Input
                                label={ t('auth.signUp.name') }
                                value={ value }
                                onChangeText={ onChange }
                                error={ errors.name?.message }
                                autoCapitalize="words"
                                autoComplete="name"
                                textContentType="name"
                            />
                        ) }
                    />

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

                    <Controller
                        control={ control }
                        name="repeat_password"
                        render={ ({ field: { value, onChange } }) => (
                            <Input
                                label={ t('auth.signUp.repeatPassword') }
                                value={ value }
                                onChangeText={ onChange }
                                secureTextEntry
                                showPasswordToggle
                                error={ errors.repeat_password?.message }
                                autoComplete="password"
                            />
                        ) }
                    />


                    <Text style={ styles.loginLink } onPress={ handleNavigateToLogin }>
                        { t('auth.signUp.alreadyHaveAccount') }
                    </Text>
                </View>

                <View style={styles.container}>
                    <CustomButton 
                        title={ t('auth.signUp.button') } 
                        onPress={ handleSubmit(onSubmit) }
                        disabled={ isSubmitting || isLoading }
                        loading={ isSubmitting || isLoading }
                    />
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
    loginLink: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'InterSemibold',
        color: COLORS.warning,
        fontWeight: '600',
        paddingBottom: 20,
    }
});

