import React, { useState, useEffect } from "react";
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
import { useUpdateProfile, useChangePassword, useChangeEmail } from "@features/profile";
import { useProfile } from "@app/hooks/profile.hook";
import { useAuth } from "@app/hooks/auth.hook";
import { EmailChangeConfirmationModal } from "@shared/components/EmailChangeConfirmationModal";

const createPasswordSchema = (t: any) => yup.object().shape({
    currentPassword: yup.string()
        .required(t('main.profile.personalInfoScreen.currentPasswordRequired'))
        .min(8, t('main.profile.personalInfoScreen.passwordMinLength'))
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, t('main.profile.personalInfoScreen.passwordComplexity')),
    newPassword: yup.string()
        .required(t('main.profile.personalInfoScreen.newPasswordRequired'))
        .min(8, t('main.profile.personalInfoScreen.passwordMinLength'))
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, t('main.profile.personalInfoScreen.passwordComplexity'))
        .test('different-passwords', t('main.profile.personalInfoScreen.differentPasswords'), function(value) {
            const { currentPassword } = this.parent;
            return value !== currentPassword;
        }),
});

const createEmailSchema = (t: any) => yup.object().shape({
    newEmail: yup.string()
        .required(t('main.profile.personalInfoScreen.emailRequired'))
        .email(t('main.profile.personalInfoScreen.emailInvalid')),
    password: yup.string()
        .required(t('main.profile.personalInfoScreen.passwordRequired'))
        .min(8, t('main.profile.personalInfoScreen.passwordMinLength'))
        .matches(/^(?=.*[a-zA-Z])(?=.*\d)/, t('main.profile.personalInfoScreen.passwordComplexity')),
});

const createNameSchema = (t: any) => yup.object().shape({
    newName: yup.string().required(t('main.profile.personalInfoScreen.nameRequired')),
});

type PasswordFormData = {
    currentPassword: string;
    newPassword: string;
};

type EmailFormData = {
    newEmail: string;
    password: string;
};

type NameFormData = {
    newName: string;
};

export default function PersonalInfoScreen({ navigation }: { navigation: PersonalInfoScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    
    // Хуки для работы с профилем
    const { profile, isLoading, error, refreshProfile, updateProfile: updateProfileContext } = useProfile();
    const updateProfile = useUpdateProfile();
    const changePassword = useChangePassword();
    const changeEmail = useChangeEmail();
    
    // Хук для проверки Firebase пользователя
    const { isFirebaseUser } = useAuth();

    console.log(isFirebaseUser)

    // Формы для разных типов редактирования
    const passwordForm = useForm<PasswordFormData>({
        resolver: yupResolver(createPasswordSchema(t)),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
        },
    });

    const emailForm = useForm<EmailFormData>({
        resolver: yupResolver(createEmailSchema(t)),
        defaultValues: {
            newEmail: profile?.email || '',
            password: '',
        },
    });

    const nameForm = useForm<NameFormData>({
        resolver: yupResolver(createNameSchema(t)),
        defaultValues: {
            newName: profile?.firstName || '',
        },
    });

    // Состояния для редактирования
    const [ passwordDisabled, setPasswordDisabled ] = useState(true);
    const [ emailDisabled, setEmailDisabled ] = useState(true);
    const [ nameDisabled, setNameDisabled ] = useState(true);
    
    // Состояние для отслеживания изначального email
    const [ originalEmail, setOriginalEmail ] = useState<string>('');
    
    // Состояние для модала подтверждения изменения email
    const [ emailChangeModalOpen, setEmailChangeModalOpen ] = useState(false);
    const [ newEmailToConfirm, setNewEmailToConfirm ] = useState<string>('');

    // Обновляем значения форм при загрузке профиля
    useEffect(() => {
        if (profile) {
            const currentEmail = profile.email || '';
            emailForm.setValue('newEmail', currentEmail);
            nameForm.setValue('newName', profile.firstName || '');
            
            // Сохраняем изначальный email только если он еще не установлен
            if (!originalEmail) {
                setOriginalEmail(currentEmail);
            }
        }
    }, [profile, emailForm, nameForm, originalEmail]);

    const onBack = () => {
        navigation.goBack()
    };

    // Отслеживаем изменения в поле email в реальном времени
    const watchedEmail = emailForm.watch('newEmail');
    
    // Функция для проверки изменения email
    const isEmailChanged = () => {
        return watchedEmail !== originalEmail;
    };

    const onSubmitChangePassword = async (data: PasswordFormData) => {
        try {
            console.log('🔐 Начинаем смену пароля...');
            
            await changePassword.mutateAsync({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            
            console.log('✅ Пароль успешно изменен');
            Alert.alert('Успех', 'Пароль успешно изменен');
            passwordForm.reset();
            setPasswordDisabled(true);
        } catch (error: any) {
            console.error('❌ Ошибка смены пароля:', error);
            Alert.alert('Ошибка', error.message || 'Не удалось изменить пароль');
        }
    };

    const onSubmitChangeEmail = async (data: EmailFormData) => {
        try {
            console.log('📧 Начинаем смену email...');
            
            await changeEmail.mutateAsync({
                newEmail: data.newEmail,
                password: data.password,
            });
            
            console.log('✅ Email успешно изменен, открываем модал подтверждения');
            
            // Сохраняем новый email для подтверждения
            setNewEmailToConfirm(data.newEmail);
            
            // Открываем модал подтверждения
            setEmailChangeModalOpen(true);
            
            // Сбрасываем форму с текущими значениями (email не изменится до подтверждения)
            emailForm.reset({
                newEmail: profile?.email || '',
                password: '',
            });
            setEmailDisabled(true);
            
        } catch (error: any) {
            console.error('❌ Ошибка смены email:', error);
            Alert.alert('Ошибка', error.message || 'Не удалось изменить email');
        }
    };

    const onSubmitChangeName = async (data: NameFormData) => {
        try {
            console.log('👤 Начинаем смену имени...');
            
            const updatedProfile = await updateProfile.mutateAsync({
                firstName: data.newName,
            });
            
            console.log('✅ Имя успешно изменено');
            Alert.alert('Успех', 'Имя успешно изменено');
            
            // Немедленно обновляем профиль в контексте с новыми данными
            updateProfileContext(updatedProfile);
            
            // Сбрасываем форму с новыми значениями
            nameForm.reset({
                newName: updatedProfile.firstName || '',
            });
            setNameDisabled(true);
        } catch (error: any) {
            console.error('❌ Ошибка смены имени:', error);
            Alert.alert('Ошибка', error.message || 'Не удалось изменить имя');
        }
    };

    const handleConfirmEmailChange = async () => {
        try {
            console.log('✅ Email успешно подтвержден и изменен');
            
            // Обновляем профиль с сервера для получения актуальных данных
            await refreshProfile();
            
            // Обновляем изначальный email для будущих изменений
            setOriginalEmail(newEmailToConfirm);
            
            // Закрываем модал
            setEmailChangeModalOpen(false);
            setNewEmailToConfirm('');
            
        } catch (error: any) {
            console.error('❌ Ошибка обновления профиля после изменения email:', error);
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
                {isFirebaseUser && (
                    <View style={ [ theme.containers.cardRound, { paddingHorizontal: 16, marginBottom: 16, backgroundColor: '#FFF3CD' } ] }>
                        <Text style={ [ { color: '#856404', textAlign: 'center' } ] }>
                            { t('main.profile.personalInfoScreen.firebaseUserMessage') }
                        </Text>
                    </View>
                )}
                <View style={ [ theme.containers.cardRound, { paddingHorizontal: 16 } ] }>
                    {
                        emailDisabled ?
                            <View style={ theme.flexBlocks.vertical8 }>
                                <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                    { t('main.profile.personalInfoScreen.email') }
                                </Text>

                                <View style={ theme.flexBlocks.vertical16 }>
                                    <View style={ [ theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter ] }>
                                        <Text style={ theme.fonts.titleSecond }>
                                            { profile?.email }
                                        </Text>
                                    </View>

                                    <CustomButton title={ t('main.profile.personalInfoScreen.changeEmail') }
                                                  buttonStyle={ styles.changePassBtn }
                                                  onPress={ () => {setEmailDisabled(!emailDisabled)} }
                                                  disabled={isFirebaseUser}/>
                                </View>
                            </View> :
                            <View style={ theme.flexBlocks.vertical16 }>
                                <View style={ theme.flexBlocks.vertical8 }>
                                    <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                        { t('main.profile.personalInfoScreen.newEmail') }
                                    </Text>

                                    <Controller
                                        control={ emailForm.control }
                                        name="newEmail"
                                        render={ ({ field: { value, onChange } }) => (
                                            <Input
                                                value={ value }
                                                onChangeText={ onChange }
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoComplete="email"
                                                error={ emailForm.formState.errors.newEmail?.message }
                                            />
                                        ) }
                                    />
                                </View>

                                <View style={ theme.flexBlocks.vertical8 }>
                                    <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                        { t('main.profile.personalInfoScreen.password') }
                                    </Text>

                                    <Controller
                                        control={ emailForm.control }
                                        name="password"
                                        render={ ({ field: { value, onChange } }) => (
                                            <Input
                                                value={ value }
                                                onChangeText={ onChange }
                                                secureTextEntry
                                                showPasswordToggle
                                                error={ emailForm.formState.errors.password?.message }
                                            />
                                        ) }
                                    />
                                </View>

                                <CustomButton title={ t('main.profile.personalInfoScreen.confirmEmail') }
                                              buttonStyle={ styles.changePassBtn }
                                              onPress={emailForm.handleSubmit(onSubmitChangeEmail)}
                                              disabled={changeEmail.isPending || !isEmailChanged()}/>
                            </View>
                    }
                </View>

                <View style={ [ theme.containers.cardRound, { paddingHorizontal: 16 } ] }>
                    {
                        nameDisabled ?
                            <View style={ theme.flexBlocks.vertical8 }>
                                <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                    { t('main.profile.personalInfoScreen.name') }
                                </Text>

                                <View style={ theme.flexBlocks.vertical16 }>
                                    <View style={ [ theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter ] }>
                                        <Text style={ theme.fonts.titleSecond }>
                                            { profile?.firstName }
                                        </Text>
                                    </View>

                                    <CustomButton title={ t('main.profile.personalInfoScreen.changeName') }
                                                  buttonStyle={ styles.changePassBtn }
                                                  onPress={ () => {setNameDisabled(!nameDisabled)} }
                                                  disabled={isFirebaseUser}/>
                                </View>
                            </View> :
                            <View style={ theme.flexBlocks.vertical16 }>
                                <View style={ theme.flexBlocks.vertical8 }>
                                    <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                        { t('main.profile.personalInfoScreen.newName') }
                                    </Text>

                                    <Controller
                                        control={ nameForm.control }
                                        name="newName"
                                        render={ ({ field: { value, onChange } }) => (
                                            <Input
                                                value={ value }
                                                onChangeText={ onChange }
                                                autoComplete="given-name"
                                                error={ nameForm.formState.errors.newName?.message }
                                            />
                                        ) }
                                    />
                                </View>

                                <CustomButton title={ t('main.profile.personalInfoScreen.confirmName') }
                                              buttonStyle={ styles.changePassBtn }
                                              onPress={nameForm.handleSubmit(onSubmitChangeName)}
                                              disabled={updateProfile.isPending}/>
                            </View>
                    }
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
                                                  onPress={ () => {setPasswordDisabled(!passwordDisabled)} }
                                                  disabled={isFirebaseUser}/>
                                </View>
                            </View> :
                            <View style={ theme.flexBlocks.vertical16 }>
                                <View style={ theme.flexBlocks.vertical8 }>
                                    <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                        { t('main.profile.personalInfoScreen.currentPass') }
                                    </Text>

                                    <Controller
                                        control={ passwordForm.control }
                                        name="currentPassword"
                                        render={ ({ field: { value, onChange } }) => (
                                            <Input
                                                value={ value }
                                                onChangeText={ onChange }
                                                secureTextEntry
                                                showPasswordToggle
                                                error={ passwordForm.formState.errors.currentPassword?.message }
                                            />
                                        ) }
                                    />
                                </View>

                                <View style={ theme.flexBlocks.vertical8 }>
                                    <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                                        { t('main.profile.personalInfoScreen.newPass') }
                                    </Text>

                                    <Controller
                                        control={ passwordForm.control }
                                        name="newPassword"
                                        render={ ({ field: { value, onChange } }) => (
                                            <Input
                                                value={ value }
                                                onChangeText={ onChange }
                                                secureTextEntry
                                                showPasswordToggle
                                                error={ passwordForm.formState.errors.newPassword?.message }
                                            />
                                        ) }
                                    />
                                </View>

                                <CustomButton title={ t('approve') }
                                              buttonStyle={ styles.changePassBtn }
                                              onPress={passwordForm.handleSubmit(onSubmitChangePassword)}
                                              disabled={changePassword.isPending}/>
                            </View>
                    }
                </View>
            </View>
            
            {/* Модал подтверждения изменения email */}
            <EmailChangeConfirmationModal
                visible={emailChangeModalOpen}
                onClose={() => {
                    setEmailChangeModalOpen(false);
                    setNewEmailToConfirm('');
                }}
                onSuccess={handleConfirmEmailChange}
                title={t('main.profile.personalInfoScreen.confirmEmailChange')}
                description={t('main.profile.personalInfoScreen.confirmEmailChangeDescription', { email: newEmailToConfirm })}
            />
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
