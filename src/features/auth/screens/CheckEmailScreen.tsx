import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Alert, SafeAreaView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import CustomButton from "@shared/components/Button/Button";
import { Input } from '@shared/components/Input/Input';
import { useCustomTheme } from "@app/theme/ThemeContext";
import { CloseIcon } from "@assets/icons/CloseIcon";
import { CheckIcon } from "@assets/icons/CheckIcon";
import { CheckEmailScreenNavigationProp, CheckEmailScreenRouteProp } from "@app/navigation/AppNavigator";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import {Routes} from "@app/navigation/const";
import { authApiService } from '@features/auth/services';

const createSchema = (t: any) => yup.object().shape({
    verificationCode: yup
        .string()
        .required(t('auth.checkEmailScreen.codeRequired'))
        .matches(/^\d{6}$/, t('auth.checkEmailScreen.codeInvalid')),
    newPassword: yup
        .string()
        .required(t('auth.checkEmailScreen.passwordRequired'))
        .min(8, t('auth.checkEmailScreen.passwordMinLength'))
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t('auth.checkEmailScreen.passwordComplexity')),
    confirmPassword: yup
        .string()
        .required(t('auth.checkEmailScreen.confirmPasswordRequired'))
        .min(8, t('auth.checkEmailScreen.passwordMinLength'))
        .oneOf([yup.ref('newPassword')], t('auth.checkEmailScreen.passwordsMatch')),
});

type FormData = {
    verificationCode: string;
    newPassword: string;
    confirmPassword: string;
};

export default function CheckEmailScreen({ navigation, route }: { navigation: CheckEmailScreenNavigationProp; route: CheckEmailScreenRouteProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(createSchema(t)),
    });

    const onBack = () => {
        navigation.navigate(Routes.LOGIN);
    };

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            const email = route.params.email;
            
            if (!email) {
                Alert.alert(
                    t('auth.checkEmailScreen.errorTitle'),
                    t('auth.checkEmailScreen.emailNotFound')
                );
                return;
            }

            await authApiService.resetPassword(email, data.verificationCode, data.newPassword);
            
            Alert.alert(
                t('auth.checkEmailScreen.successTitle'),
                t('auth.checkEmailScreen.successMessage'),
                [
                    {
                        text: t('ok'),
                        onPress: () => {
                            navigation.navigate(Routes.LOGIN);
                        }
                    }
                ]
            );
        } catch (error: any) {
            console.error('Reset password error:', error);
            Alert.alert(
                t('auth.checkEmailScreen.errorTitle'),
                error.message || t('auth.checkEmailScreen.errorMessage')
            );
        } finally {
            setIsLoading(false);
        }
    };

    const onOpenMail = () => {
        const mailAppUrl = 'mailto:';

        Linking.canOpenURL(mailAppUrl)
            .then((supported) => {
                if ( supported ) {
                    Linking.openURL(mailAppUrl);
                } else {
                    Alert.alert(
                        t('auth.checkEmailScreen.errorTitle'),
                        t('auth.checkEmailScreen.mailClientError')
                    );
                }
            })
            .catch((err) => console.error('Ошибка при открытии почты', err));
    };

    return (
        <SafeAreaView style={ { flex: 1 } }>
            <PageWithHeader headerContent={
                <>
                    <Pressable
                        onPress={ onBack }
                        style={ ({ pressed }) => [
                            styles.smallBtn,
                            { ...theme.buttons.smallBtn },
                            pressed && { opacity: 0.6 }
                        ] }
                    >
                        <CloseIcon/>
                    </Pressable>
                    <Text style={ theme.fonts.subtitle }>
                        { t('auth.resetPassScreen.header') }
                    </Text>
                </>
            }>
                <View style={ styles.mainContainer }>
                    <View style={ styles.formTop }>
                        <CheckIcon/>
                        <View style={ styles.head }>
                            <Text style={ [ styles.title, { ...theme.fonts.title } ] }>
                                { t('auth.checkEmailScreen.title') }
                            </Text>
                            <Text style={ [ styles.info, { ...theme.fonts.regular } ] }>
                                { t('auth.checkEmailScreen.info') }
                            </Text>
                        </View>

                        <Controller
                            control={ control }
                            name="verificationCode"
                            render={ ({ field: { value, onChange } }) => (
                                <Input
                                    label={ t('auth.checkEmailScreen.codeLabel') }
                                    value={ value }
                                    onChangeText={ onChange }
                                    error={ errors.verificationCode?.message }
                                    keyboardType="numeric"
                                    maxLength={ 6 }
                                    placeholder="000000"
                                    autoCapitalize="none"
                                    autoComplete="one-time-code"
                                />
                            ) }
                        />

                        <Controller
                            control={ control }
                            name="newPassword"
                            render={ ({ field: { value, onChange } }) => (
                                <Input
                                    label={ t('auth.newPassword') }
                                    value={ value }
                                    onChangeText={ onChange }
                                    error={ errors.newPassword?.message }
                                    secureTextEntry
                                    showPasswordToggle
                                    autoCapitalize="none"
                                    autoComplete="new-password"
                                />
                            ) }
                        />

                        <Controller
                            control={ control }
                            name="confirmPassword"
                            render={ ({ field: { value, onChange } }) => (
                                <Input
                                    label={ t('auth.confirmPassword') }
                                    value={ value }
                                    onChangeText={ onChange }
                                    error={ errors.confirmPassword?.message }
                                    secureTextEntry
                                    showPasswordToggle
                                    autoCapitalize="none"
                                    autoComplete="new-password"
                                />
                            ) }
                        />
                    </View>

                    <View style={ [ styles.formBottom, theme.flexBlocks.vertical8 ] }>
                        <CustomButton
                            title={ t('auth.checkEmailScreen.resetPassword') }
                            onPress={ handleSubmit(onSubmit) }
                            disabled={ isLoading }
                        />
                        {/*<CustomButton*/}
                        {/*    title={ t('auth.checkEmailScreen.open') }*/}
                        {/*    onPress={ onOpenMail }*/}
                        {/*/>*/}
                    </View>
                </View>
            </PageWithHeader>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    smallBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 24,
        paddingHorizontal: 8,
        paddingBottom: 16,
        borderRadius: 24,
        backgroundColor: '#fff',
    },
    formTop: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
    },
    formBottom: {
        width: '100%',
        gap: 12,
    },
    head: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        marginBottom: 10,
    },
    title: {
        textAlign: 'center',
    },
    info: {
        opacity: 0.6,
        textAlign: 'center',
    },
});

