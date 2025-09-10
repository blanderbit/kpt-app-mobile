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
import { LoadingSpinner } from "@shared/components/LoadingSpinner/LoadingSpinner";
import { ErrorMessage } from "@shared/components/ErrorMessage/ErrorMessage";

const schema = yup.object().shape({
    firstName: yup.string().required('Имя обязательно'),
    lastName: yup.string().required('Фамилия обязательна'),
    currentPassword: yup.string().required('Текущий пароль обязателен'),
    newPassword: yup.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type FormData = {
    firstName: string;
    lastName: string;
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

    const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            currentPassword: '',
            newPassword: '',
        },
    });

    const [ passwordDisabled, setPasswordDisabled ] = useState(true);
    const [ isEditing, setIsEditing ] = useState(false);

    const onBack = () => {
        navigation.goBack()
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
                        username@mail.com
                    </Text>
                </View>

                <View style={ [ theme.containers.cardRound, { paddingHorizontal: 16 } ] }>
                    <View>
                        <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                            { t('main.profile.personalInfoScreen.name') }
                        </Text>
                    </View>

                    <Text style={ theme.fonts.titleSecond }>
                        Rostyk
                    </Text>
                </View>

                <View style={ [ theme.containers.cardRound, { paddingHorizontal: 16 } ] }>
                    <View>
                        <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                            { t('main.profile.personalInfoScreen.password') }
                        </Text>
                    </View>

                    <View style={ theme.flexBlocks.vertical16 }>
                        { passwordDisabled ?
                            <View style={ [ theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter ] }>
                                <Text style={ styles.dots }>............</Text>

                                <EyeIcon/>
                            </View> :
                            <Controller
                                control={ control }
                                name="password"
                                render={ ({ field: { value, onChange } }) => (
                                    <Input
                                        value={ value }
                                        onChangeText={ onChange }
                                        secureTextEntry
                                        showPasswordToggle
                                        error={ errors.password?.message }
                                    />
                                ) }
                            /> }


                        <CustomButton title={ t('main.profile.personalInfoScreen.changePass') }
                                      buttonStyle={ styles.changePassBtn }
                                      onPress={ () => {
                                          setPasswordDisabled(!passwordDisabled)
                                      } }/>
                    </View>
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
