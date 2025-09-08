import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Alert, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import CustomButton from "@shared/components/Button/Button";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { CloseIcon } from "@assets/icons/CloseIcon";
import { CheckIcon } from "@assets/icons/CheckIcon";
import { CheckEmailScreenNavigationProp } from "@app/navigation/AppNavigator";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";

export default function CheckEmailScreen({ navigation }: { navigation: CheckEmailScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    const onBack = () => {
        navigation.goBack()
    };

    const onSubmit = () => {
        const mailAppUrl = 'mailto:';

        Linking.canOpenURL(mailAppUrl)
            .then((supported) => {
                if ( supported ) {
                    Linking.openURL(mailAppUrl);
                } else {
                    Alert.alert(
                        'Ошибка',
                        'Не удалось открыть почтовый клиент на этом устройстве.'
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
                    </View>

                    <View style={ styles.formBottom }>
                        <CustomButton
                            title={ t('auth.checkEmailScreen.open') }
                            onPress={ onSubmit }
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

