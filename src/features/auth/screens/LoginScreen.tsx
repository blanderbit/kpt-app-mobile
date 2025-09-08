import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from '@app/hooks/auth.hook';
import { LoginIcon } from '@assets/icons/LoginIcon';
import { Input } from '@shared/components/Input/Input';
import { useTranslation } from 'react-i18next';
import CustomButton from "@shared/components/Button/Button";
import { AppleIcon } from "@assets/icons/AppleLogo";
import { COLORS } from "@app/theme";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { LoginScreenNavigationProp } from "@app/navigation/AppNavigator";
import { Routes } from "@app/navigation/const";

const schema = yup.object().shape({
    username: yup.string().required('Username is required'),
    password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

type FormData = {
    username: string;
    password: string;
};

export default function LoginScreen({ navigation }: { navigation: LoginScreenNavigationProp }) {
    const { t } = useTranslation();
    const { login } = useAuth();
    const { theme, themeName } = useCustomTheme();

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        // login( data.username, data.password );
        navigation.navigate(Routes.RESET_PASS)
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
                        name="username"
                        render={ ({ field: { value, onChange } }) => (
                            <Input
                                label={ t('auth.email') }
                                value={ value }
                                onChangeText={ onChange }
                                error={ errors.username?.message }
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
                            />
                        ) }
                    />

                    <Text style={ styles.forgotPassword }>{ t('auth.forgotPass') }</Text>
                </View>

                <View style={ styles.container }>
                    <CustomButton title={ t('auth.login') } onPress={ onSubmit }/>

                    <CustomButton title={ t('auth.appleSignIn') } onPress={ () => {
                    } } themeName="white">
                        <AppleIcon fill={ themeName === 'Green' ? 'white' : 'black' }/>
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
        fontFamily: 'Inter',
        color: COLORS.warning,
        fontWeight: '600',
        paddingBottom: 40,
    }
});

