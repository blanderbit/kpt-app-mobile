import React, {useState} from "react";
import {StyleSheet, Text, View, Image, SafeAreaView, Pressable} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import SatisfactionSlider from "@shared/components/Slider/Slider";
import {useTranslation} from "react-i18next";
import {CloseIcon} from "@assets/icons/CloseIcon";

export default function SubscriptionOfferingTemplate() {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={[styles.header, theme.flexBlocks.justifyCenter]}>
                <Text>
                    Logo
                </Text>

                <Pressable
                    onPress={ () => {} }
                    style={ ({ pressed }) => [
                        styles.smallBtn,
                        { ...theme.buttons.smallBtn },
                        pressed && { opacity: 0.6 }
                    ] }
                >
                    <CloseIcon/>
                </Pressable>
            </View>

            <View style={styles.content}>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'relative',
    },
    smallBtn: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    content: {
        flex: 1
    }
});
