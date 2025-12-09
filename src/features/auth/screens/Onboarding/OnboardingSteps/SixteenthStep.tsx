import React, {useCallback, useEffect, useState} from "react";
import {StyleSheet, View, Text, Platform, ScrollView} from "react-native";
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
    const {theme} = useCustomTheme();
    const [isPermissionChecked, setIsPermissionChecked] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'undetermined'>('unknown');
    const { mutateAsync: registerDeviceToken, isPending } = useRegisterDeviceToken();

    const checkNotificationPermission = useCallback(async () => {
        try {
            const { status } = await Notifications.getPermissionsAsync();
            console.log('Current notification permission status:', status);
            setPermissionStatus(status as any);

            if (status === 'granted') {
                await registerTokenIfNeeded();
                setIsPermissionChecked(true);
            } else if (status === 'denied') {
                setIsPermissionChecked(true);
            }
        } catch (error) {
            console.log('Error checking notification permission:', error);
            setIsPermissionChecked(true);
        }
    }, []);

    const requestNotificationPermission = useCallback(async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            setPermissionStatus(status as any);

            if (status === 'granted') {
                console.log('Notification permission granted');
                await registerTokenIfNeeded(true);
            } else if (status === 'denied') {
                console.log('Notification permission denied');
            } else {
                console.log('Notification permission blocked or undetermined');
            }

            setIsPermissionChecked(true);
        } catch (error) {
            console.log('Error requesting notification permission:', error);
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
                console.log('Cannot register device: push token is empty');
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

            console.log('Registering device token', { storedToken, platform: Platform.OS /*, deviceId*/ });
            // await registerDeviceToken({
            //     token: storedToken,
            //     platform: Platform.OS,
            //     // deviceId,
            // });
        } catch (error) {
            console.log('Failed to register device token:', error);
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
                    * Turn off notifications anytime
                </Text>

                <CustomButton
                    title={"See my FREE offer"}
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
