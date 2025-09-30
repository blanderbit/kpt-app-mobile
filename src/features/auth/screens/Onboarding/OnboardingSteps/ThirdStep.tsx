import React from "react";
import {StyleSheet, Text, View, Pressable, Image} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {COLORS} from "@app/theme";

export default function ThirdStep({onNext}: { onNext: () => void }) {

    const {theme} = useCustomTheme();

    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
            <View style={styles.formTop}>
                <View style={styles.head}>
                    <Text style={[styles.title, {...theme.fonts.title}]}>
                        That's great!
                    </Text>
                    <Text style={[styles.info, {...theme.fonts.regular}]}>
                        93% of users report AppName has seamlessly helped them to stay balanced and live fulfilled life.
                    </Text>
                </View>
            </View>

            <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.vertical8, styles.centerBlock]}>
                <Image
                    source={require('@assets/images/onboarding-img.png')}/>
                <Text style={styles.centerBlockText}>
                    A few quick questions to better understand your current state and goals 🤝
                </Text>
            </View>

            <View style={styles.formBottom}>
                <CustomButton
                    title={'Continue'}
                    onPress={onNext}
                />
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
    centerBlock: {
        paddingBottom: 40
    },
    centerBlockText: {
        fontFamily: 'SF Pro Display Bold',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        opacity: .6
    }
});
