import React from "react";
import {StyleSheet, Text, View, Image} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";

export default function SixthStep({onNext}: { onNext: () => void }) {

    const {theme} = useCustomTheme();

    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>

            <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.vertical16, styles.centerBlock]}>
                <Image
                    source={require('@assets/images/onboarding-awesome.png')}/>
                <Text style={styles.centerBlockText}>
                    Let's discover how it works!
                </Text>
            </View>

            <View style={styles.formBottom}>
                <CustomButton
                    title={'Show me how'}
                    onPress={onNext}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formBottom: {
        width: '100%',
        flexDirection: 'column',
        gap: 10
    },
    centerBlock: {
        paddingVertical: 20,
        gap: 32
    },
    centerBlockText: {
        fontFamily: 'SF Pro Display Bold',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        opacity: .6
    }
});
