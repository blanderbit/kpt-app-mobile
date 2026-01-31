import React, {useCallback, useEffect, useState} from "react";
import {StyleSheet, View, Text, Platform, ScrollView} from "react-native";
import {useTranslation} from 'react-i18next';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCustomTheme} from "@app/theme/ThemeContext";
import CustomButton from "@shared/components/Button/Button";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {NOTIFICATIONS_SVG} from "@features/auth/screens/Onboarding/OnboardingSteps/icons";
import {useRegisterDeviceToken} from "@shared/services/api/hooks";
import { isSmallScreen } from "@shared/utils/screenUtils";

const DEVICE_TOKEN_KEY = 'push_device_token';
const DEVICE_ID_KEY = 'push_device_id';

export default function SixteenthStep({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();
    const [isPermissionChecked, setIsPermissionChecked] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'undetermined'>('unknown');
    const { mutateAsync: registerDeviceToken, isPending } = useRegisterDeviceToken();

    const checkNotificationPermission = useCallback(async () => {
        try {
            const { status } = await Notifications.getPermissionsAsync();
            setPermissionStatus(status as any);

            if (status === 'granted') {
                await registerTokenIfNeeded();
                setIsPermissionChecked(true);
            } else if (status === 'denied') {
                setIsPermissionChecked(true);
            }
        } catch {
            setIsPermissionChecked(true);
        }
    }, []);

    const requestNotificationPermission = useCallback(async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            setPermissionStatus(status as any);

            if (status === 'granted') {
                await registerTokenIfNeeded(true);
            }

            setIsPermissionChecked(true);
        } catch {
            setIsPermissionChecked(true);
        }
    }, []);

    const registerTokenIfNeeded = useCallback(async (forceRefresh = false) => {
        try {
            let storedToken: string | null = null;
            if (!forceRefresh) {
                storedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
            }

            if (!storedToken || forceRefresh) {
                const tokenResponse = await Notifications.getDevicePushTokenAsync();
                storedToken = tokenResponse.data;
                await AsyncStorage.setItem(DEVICE_TOKEN_KEY, storedToken);
            }

            if (!storedToken) {
                return;
            }

            // TODO: backend will require deviceId later; keeping logic commented for now
            // let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
            // if (!deviceId) {
            //     if (Platform.OS === 'android') {
            //         deviceId = Application.androidId ?? null;
            //     } else if (Platform.OS === 'ios') {
            //         deviceId = await Application.getIosIdForVendorAsync();
            //     }
            //
            //     if (!deviceId) {
            //         deviceId = `generated-${Math.random().toString(36).slice(2, 12)}`;
            //     }
            //
            //     await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
            // }

            // await registerDeviceToken({
            //     token: storedToken,
            //     platform: Platform.OS,
            //     // deviceId,
            // });
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        checkNotificationPermission();
    }, [checkNotificationPermission]);

    useEffect(() => {
        const timer = setTimeout(() => {
            requestNotificationPermission();
        }, 3000);

        return () => clearTimeout(timer);
    }, [requestNotificationPermission]);

    const isSmall = isSmallScreen();

    const content = (
        <View style={[styles.content, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter]}>
            <RemoteSvg xml={NOTIFICATIONS_SVG}/>
        </View>
    );

    return (
        <View style={styles.container}>
            {isSmall ? (
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                    {content}
            </ScrollView>
            ) : (
                content
            )}

            <View style={theme.flexBlocks.vertical8}>
                <Text style={styles.centerBlockText}>
                    {t('onboarding.texts.step16NotificationText')}
                </Text>

                <CustomButton
                    title={t('onboarding.buttons.seeMyFreeOffer')}
                    onPress={onNext}
                    disabled={!isPermissionChecked || isPending}
                />
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingBottom: 20,
    },
    centerBlockText: {
        fontFamily: 'SF Pro Display Bold',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        opacity: .6
    }
});
