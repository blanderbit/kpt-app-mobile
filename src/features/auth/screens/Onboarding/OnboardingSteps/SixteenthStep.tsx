import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, Alert, Platform, Linking} from "react-native";
import {useCustomTheme} from "@app/theme/ThemeContext";
import CustomButton from "@shared/components/Button/Button";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {NOTIFICATIONS_SVG} from "@features/auth/screens/Onboarding/OnboardingSteps/icons";

export default function SixteenthStep({onNext}: { onNext: () => void }) {
    const {theme} = useCustomTheme();
    const [isPermissionChecked, setIsPermissionChecked] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'undetermined'>('unknown');

    useEffect(() => {
        checkNotificationPermission();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            requestNotificationPermission();
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const checkNotificationPermission = async () => {
        try {
            const {getPermissionsAsync} = await import('expo-notifications');
            const {status} = await getPermissionsAsync();
            console.log('Current notification permission status:', status);
            
            setPermissionStatus(status as any);

            if (status === 'granted' || status === 'denied') {
                setIsPermissionChecked(true);
            }
        } catch (error) {
            console.log('Error checking notification permission:', error);
            setIsPermissionChecked(true);
        }
    };

    const requestNotificationPermission = async () => {
        try {
            const {requestPermissionsAsync} = await import('expo-notifications');
            const {status} = await requestPermissionsAsync();

            setPermissionStatus(status as any);

            if (status === 'granted') {
                console.log('Notification permission granted');
            } else if (status === 'denied') {
                console.log('Notification permission denied');
            } else {
                console.log('Notification permission blocked');
            }
            
            setIsPermissionChecked(true);
        } catch (error) {
            console.log('Error requesting notification permission:', error);
            setIsPermissionChecked(true);
        }
    };

    return (
        <View style={styles.container}>
            <View style={[styles.content, theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter]}>
                <RemoteSvg xml={NOTIFICATIONS_SVG}/>
            </View>

            <View style={theme.flexBlocks.vertical8}>
                <Text style={styles.centerBlockText}>
                    * Turn off notifications anytime
                </Text>

                <CustomButton
                    title={"See my FREE offer"}
                    onPress={onNext}
                    disabled={!isPermissionChecked}
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
