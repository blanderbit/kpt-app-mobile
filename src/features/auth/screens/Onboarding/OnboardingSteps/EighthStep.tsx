import React from "react";
import {StyleSheet, Text, View, Pressable, Image} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";

export default function EighthStep({onNext}: { onNext: () => void }) {

    const {theme} = useCustomTheme();

    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
            <View style={styles.formTop}>
                <View style={styles.head}>
                    <Text style={[styles.title, {...theme.fonts.title}]}>
                        Good job! 👏
                    </Text>
                    <Text style={[styles.info, {...theme.fonts.regular}]}>
                        Now, rate your activity using these metrics:
                    </Text>
                </View>
            </View>

            <View style={theme.flexBlocks.vertical16}>
                <View>

                </View>
                
                <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.horizontal16]}>
                    <Image source={require('@assets/images/swipe_the_lines.png')}/>
                    <Image style={styles.pointArrow} source={require('@assets/images/pointing_arrow.png')}/>
                </View>
            </View>

            <View style={styles.formBottom}>
                <CustomButton
                    title={'Complete'}
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
    pointArrow: {
        marginTop: -30
    }
});
