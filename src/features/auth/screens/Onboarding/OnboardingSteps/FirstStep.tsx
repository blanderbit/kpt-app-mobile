import React from "react";
import {StyleSheet, Text, View} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {COLORS} from "@app/theme";

export default function FirstStep() {

    const {theme} = useCustomTheme();

    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
            <View style={ styles.formTop }>
                <View style={ styles.head }>
                    <Text style={ [ styles.title, { ...theme.fonts.title } ] }>
                        Welcome to AppName
                    </Text>
                    <Text style={ [ styles.info, { ...theme.fonts.regular } ] }>
                        Choose ready-made or create you own tasks, activities and habits. Track achievement and satisfaction. Discover your balance!
                    </Text>
                </View>
            </View>

            <View style={ styles.formBottom }>
                <CustomButton
                    title={ 'Get started' }
                />

                <View style={[theme.flexBlocks.alignCenter, styles.haveAnAccSection]}>
                    <View style={theme.flexBlocks.alignCenter}>
                        <Text style={styles.haveAnAccText}>Already have an account?</Text>
                        <Text style={[styles.haveAnAccText, styles.logIn]}>Log in</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formTop: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        paddingTop: 10
    },
    formBottom: {
        width: '100%',
        flexDirection: 'column',
        gap: 10
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
    haveAnAccSection: {
        height: 52,
        margin: 'auto'
    },
    haveAnAccText: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'Inter Semibold',
        fontWeight: '600',
        marginRight: 2
    },
    logIn: {
        color: COLORS.warning,
    }
});
