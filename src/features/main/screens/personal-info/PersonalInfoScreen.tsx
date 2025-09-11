import React, { useState } from "react";
import { StyleSheet, Pressable, Text, View, Alert } from "react-native";
import { ArrowIcon } from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { Input } from "@shared/components/Input/Input";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomButton from "@shared/components/Button/Button";
import { EyeIcon } from "@assets/icons/EyeIcon";
import { COLORS } from "@app/theme";
import { PersonalInfoScreenNavigationProp } from "@app/navigation/AppNavigator";
import { useProfile, useUpdateProfile, useChangePassword } from "@features/profile";

const schema = yup.object().shape({
    currentPassword: yup.string().required('Текущий пароль обязателен').min(6, 'Пароль должен содержать минимум 6 символов'),
    newPassword: yup.string()
        .required('Новый пароль обязателен')
        .min(6, 'Пароль должен содержать минимум 6 символов')
        .test('different-passwords', 'Новый пароль должен отличаться от текущего', function(value) {
            const { currentPassword } = this.parent;
            return value !== currentPassword;
        }),
});

type FormData = {
    currentPassword: string;
    newPassword: string;
};

export default function PersonalInfoScreen({ navigation }: { navigation: PersonalInfoScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    
    // Хуки для работы с профилем
    const { data: profile, isLoading, error } = useProfile();
    const updateProfile = useUpdateProfile();
    const changePassword = useChangePassword();

    const { control, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
        },
    });

    const [ passwordDisabled, setPasswordDisabled ] = useState(true);
    const [ isEditing, setIsEditing ] = useState(false);

    const onBack = () => {
        navigation.goBack()
    };

    const onSubmitChangePassword = async (data: FormData) => {
        try {
            console.log('🔐 Начинаем смену пароля...');
            
            await changePassword.mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            
            console.log('✅ Пароль успешно изменен');
            Alert.alert('Успех', 'Пароль успешно изменен');
            reset();
            setPasswordDisabled(true);
        } catch (error: any) {
            console.error('❌ Ошибка смены пароля:', error);
            Alert.alert('Ошибка', error.message || 'Не удалось изменить пароль');
        }
    };

    return (
        <PageWithHeader headerContent={
            <>
                <Pressable
                    onPress={ onBack }
                    style={ ({ pressed }) => [
                        styles.smallBtn,
                        { ...theme.buttons.smallBtn },
                        pressed && { opacity: 0.6 }
                    ] }>
                    <ArrowIcon/>
                </Pressable>
                <Text style={ theme.fonts.subtitle }>
                    { t('main.profile.personalInfoScreen.title') }
                </Text>
            </>
        }>
            <View style={ theme.flexBlocks.vertical8 }>
                <View style={ [ theme.containers.cardRound, { paddingHorizontal: 16 } ] }>
                    <View>
                        <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                            { t('main.profile.personalInfoScreen.email') }
                        </Text>
                    </View>

                    <Text style={ theme.fonts.titleSecond }>
                        { profile?.email }
                    </Text>
                </View>

                <View style={ [ theme.containers.cardRound, { paddingHorizontal: 16 } ] }>
                    <View>
                        <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                            { t('main.profile.personalInfoScreen.name') }
                        </Text>
                    </View>

                    <Text style={ theme.fonts.titleSecond }>
                        { profile?.firstName }
                    </Text>
                </View>

                <View style={ [ theme.containers.cardRound, { paddingHorizontal: 16 } ] }>
                    {
                        passwordDisabled ?
                            <View style={ theme.flexBlocks.vertical8 }>
                                <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                    { t('main.profile.personalInfoScreen.password') }
                                </Text>

                                <View style={ theme.flexBlocks.vertical16 }>
                                    <View style={ [ theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter ] }>
                                        <Text style={ styles.dots }>............</Text>

                                        <EyeIcon/>
                                    </View>

                                    <CustomButton title={ t('main.profile.personalInfoScreen.changePass') }
                                                  buttonStyle={ styles.changePassBtn }
                                                  onPress={ () => {setPasswordDisabled(!passwordDisabled)} }/>
                                </View>
                            </View> :
                            <View style={ theme.flexBlocks.vertical16 }>
                                <View style={ theme.flexBlocks.vertical8 }>
                                    <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                        { t('main.profile.personalInfoScreen.currentPass') }
                                    </Text>

                                    <Controller
                                        control={ control }
                                        name="currentPassword"
                                        render={ ({ field: { value, onChange } }) => (
                                            <Input
                                                value={ value }
                                                onChangeText={ onChange }
                                                secureTextEntry
                                                showPasswordToggle
                                                error={ errors.currentPassword?.message }
                                            />
                                        ) }
                                    />
                                </View>

                                <View style={ theme.flexBlocks.vertical8 }>
                                    <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                        { t('main.profile.personalInfoScreen.newPass') }
                                    </Text>

                                    <Controller
                                        control={ control }
                                        name="newPassword"
                                        render={ ({ field: { value, onChange } }) => (
                                            <Input
                                                value={ value }
                                                onChangeText={ onChange }
                                                secureTextEntry
                                                showPasswordToggle
                                                error={ errors.newPassword?.message }
                                            />
                                        ) }
                                    />
                                </View>

                                <CustomButton title={ t('approve') }
                                              buttonStyle={ styles.changePassBtn }
                                              onPress={handleSubmit(onSubmitChangePassword)}
                                              disabled={changePassword.isPending}/>
                            </View>
                    }
                </View>
            </View>
        </PageWithHeader>
    );
};


const styles = StyleSheet.create({
    smallBtn: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    changePassBtn: {
        alignSelf: 'flex-start',
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 'auto'
    },
    dots: {
        fontSize: 60,
        fontWeight: 600,
        letterSpacing: 5,
        lineHeight: 35,
        color: COLORS.gray_dark
    }
});
