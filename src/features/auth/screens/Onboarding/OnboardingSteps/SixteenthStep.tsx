import React, {useState, useEffect} from "react";
import {StyleSheet, View, Text, Alert, Platform, Linking} from "react-native";
import {useCustomTheme} from "@app/theme/ThemeContext";
import CustomButton from "@shared/components/Button/Button";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {REMINDER_SVG} from "@features/auth/screens/Onboarding/OnboardingSteps/icons";

export default function SixteenthStep({onNext}: { onNext: () => void }) {
    const {theme} = useCustomTheme();
    const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'never_ask_again'>('unknown');
    const [isRequesting, setIsRequesting] = useState(false);

    // Проверяем текущий статус разрешений при монтировании
    useEffect(() => {
        checkNotificationPermission();
    }, []);

    const checkNotificationPermission = async () => {
        try {
            const {getPermissionsAsync} = await import('expo-notifications');
            const {status} = await getPermissionsAsync();
            setPermissionStatus(status as any);
        } catch (error) {
            console.log('Error checking notification permission:', error);
            setPermissionStatus('unknown');
        }
    };

    const requestNotificationPermission = async () => {
        setIsRequesting(true);
        try {
            // Пытаемся использовать expo-notifications
            const {requestPermissionsAsync} = await import('expo-notifications');
            const {status} = await requestPermissionsAsync();
            
            if (status === 'granted') {
                setPermissionStatus('granted');
                Alert.alert(
                    'Уведомления разрешены!',
                    'Теперь вы будете получать напоминания о ваших активностях.',
                    [{text: 'Отлично!', onPress: onNext}]
                );
            } else if (status === 'denied') {
                setPermissionStatus('denied');
                Alert.alert(
                    'Уведомления отключены',
                    'Вы можете включить уведомления в настройках устройства позже.',
                    [{text: 'Понятно', onPress: onNext}]
                );
            } else {
                setPermissionStatus('never_ask_again');
                Alert.alert(
                    'Уведомления заблокированы',
                    'Для включения уведомлений перейдите в настройки приложения.',
                    [{text: 'Понятно', onPress: onNext}]
                );
            }
        } catch (error) {
            console.log('Error requesting notification permission:', error);
            // Если библиотека не установлена, показываем инструкции
            Alert.alert(
                'Настройка уведомлений',
                'Для получения напоминаний включите уведомления в настройках устройства.',
                [
                    {
                        text: 'Открыть настройки',
                        onPress: () => {
                            if (Platform.OS === 'ios') {
                                Linking.openURL('app-settings:');
                            } else {
                                Linking.openSettings();
                            }
                        }
                    },
                    {text: 'Пропустить', onPress: onNext}
                ]
            );
        } finally {
            setIsRequesting(false);
        }
    };

    const getButtonTitle = () => {
        switch (permissionStatus) {
            case 'granted':
                return 'Продолжить';
            case 'denied':
                return 'Попробовать снова';
            case 'never_ask_again':
                return 'Продолжить без уведомлений';
            default:
                return 'Разрешить уведомления';
        }
    };

    const handleButtonPress = () => {
        if (permissionStatus === 'granted') {
            onNext();
        } else {
            requestNotificationPermission();
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter]}>
                <RemoteSvg xml={REMINDER_SVG} />
                
                <View style={styles.textContainer}>
                    <Text style={[styles.title, theme.fonts.title]}>
                        Включите уведомления
                    </Text>
                    <Text style={[styles.description, theme.fonts.regular]}>
                        Получайте напоминания о ваших активностях и достижениях
                    </Text>
                </View>
            </View>

            <View style={theme.flexBlocks.vertical8}>
                <CustomButton
                    title={getButtonTitle()}
                    onPress={handleButtonPress}
                    disabled={isRequesting}
                />
                
                {permissionStatus !== 'granted' && (
                    <CustomButton
                        title={'Пропустить'}
                        onPress={onNext}
                        themeName={'white_no_border'}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    textContainer: {
        marginTop: 32,
        alignItems: 'center',
        gap: 16,
    },
    title: {
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        opacity: 0.7,
        lineHeight: 22,
    },
});
