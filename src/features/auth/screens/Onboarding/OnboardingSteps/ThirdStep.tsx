import React from "react";
import {StyleSheet, Text, View, Image} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";

export default function ThirdStep({onNext}: { onNext: () => void }) {

    const {theme} = useCustomTheme();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.vertical8, styles.centerBlock]}>
                    <Image
                        source={require('@assets/images/onboarding-img.png')}/>
                    <Text style={styles.centerBlockText}>
                        A few quick questions to better understand your current state and goals 🤝
                    </Text>
                </View>
            </View>

            <View style={theme.flexBlocks.vertical8}>
                <CustomButton
                    title={'Continue'}
                    onPress={onNext}
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
