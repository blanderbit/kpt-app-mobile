import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '@shared/components/Input/Input';
import { useTranslation } from 'react-i18next';
import CustomButton from "@shared/components/Button/Button";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { ArrowIcon } from "@assets/icons/ArrowIcon";
import { ResetPassScreenNavigationProp } from "@app/navigation/AppNavigator";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import { Routes } from "@app/navigation/const";
import { authApiService } from '@features/auth/services';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
});

type FormData = {
    email: string;
};

export default function ResetPassScreen({ navigation }: { navigation: ResetPassScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onBack = () => {
        navigation.goBack()
    };

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            await authApiService.forgotPassword(data.email);
            
            Alert.alert(
                t('auth.resetPassScreen.successTitle'),
                t('auth.resetPassScreen.successMessage'),
                [
                    {
                        text: t('ok'),
                        onPress: () => navigation.navigate(Routes.CHECK_EMAIL, { email: data.email })
                    }
                ]
            );
        } catch (error: any) {
            console.error('Forgot password error:', error);
            Alert.alert(
                t('auth.resetPassScreen.errorTitle'),
                error.message || t('auth.resetPassScreen.errorMessage')
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <PageWithHeader headerContent={
                <>
                    <Pressable
                        onPress={onBack}
                        style={({ pressed }) => [
                            styles.smallBtn,
                            { ...theme.buttons.smallBtn },
                            pressed && { opacity: 0.6 }
                        ]}>
                        <ArrowIcon/>
                    </Pressable>
                    <Text style={ theme.fonts.subtitle }>
                        { t('auth.resetPassScreen.header') }
                    </Text>
                </>
            }>
                <View style={ styles.mainContainer }>
                    <View style={ styles.formTop }>
                        <View style={ styles.head }>
                            <Text style={ [ styles.title, { ...theme.fonts.title } ] }>
                                { t('auth.resetPassScreen.title') }
                            </Text>
                            <Text style={ [ styles.info, { ...theme.fonts.regular } ] }>
                                { t('auth.resetPassScreen.info') }
                            </Text>
                        </View>

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
                                    autoCapitalize="none"
                                    autoComplete="email"
                                />
                            ) }
                        />
                    </View>

                    <View style={ styles.formBottom }>
                        <CustomButton
                            title={ t('send') }
                            onPress={ handleSubmit(onSubmit) }
                            loading={ isLoading }
                            disabled={ isLoading }
                        />
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
        left: 0,
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
        paddingTop: 10
    },
    formBottom: {
        width: '100%',
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

