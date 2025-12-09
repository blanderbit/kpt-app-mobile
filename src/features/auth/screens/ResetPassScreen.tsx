import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
import { authService } from '@shared/services/api';
import { getResponsivePadding, getResponsiveGap, isSmallScreen } from '@shared/utils/screenUtils';

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
            await authService.forgotPassword({ email: data.email });
            
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

    const isSmall = isSmallScreen();

    const headerContent = (
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
    );

    const formContent = (
        <>
            <View style={ [ styles.formTop, { gap: isSmall ? getResponsiveGap(16) : 16 } ] }>
                <View style={ [ styles.head, { marginBottom: isSmall ? 8 : 10 } ] }>
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
        </>
    );

    // Для маленьких экранов используем ScrollView + KeyboardAvoidingView
    if (isSmall) {
        const responsivePadding = getResponsivePadding(24);
        const responsiveGap = getResponsiveGap(16);
        const containerPaddingTop = 16;
        const containerPaddingBottom = 12;
        const containerPaddingHorizontal = 8;

        return (
            <SafeAreaView style={{flex: 1}}>
                <KeyboardAvoidingView 
                    style={ { flex: 1 } }
                    behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
                    keyboardVerticalOffset={ Platform.OS === 'ios' ? 0 : 20 }
                >
                    <PageWithHeader headerContent={headerContent}>
                        <ScrollView
                            contentContainerStyle={ [
                                styles.scrollContent,
                                { 
                                    paddingTop: responsivePadding,
                                    paddingBottom: responsivePadding,
                                    gap: responsiveGap 
                                }
                            ] }
                            showsVerticalScrollIndicator={ false }
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={ [ 
                                styles.mainContainer, 
                                { 
                                    gap: responsiveGap,
                                    paddingTop: containerPaddingTop,
                                    paddingBottom: containerPaddingBottom,
                                    paddingHorizontal: containerPaddingHorizontal
                                } 
                            ] }>
                                {formContent}
                            </View>
                        </ScrollView>
                    </PageWithHeader>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    // Для средних и больших экранов - оригинальная структура
    return (
        <SafeAreaView style={{flex: 1}}>
            <PageWithHeader headerContent={headerContent}>
                <View style={ styles.mainContainer }>
                    {formContent}
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
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 8,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 8,
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

