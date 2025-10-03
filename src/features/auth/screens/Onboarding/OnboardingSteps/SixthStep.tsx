import React from "react";
import {StyleSheet, Text, View, Image} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";

export default function SixthStep({onNext}: { onNext: () => void }) {

    const {theme} = useCustomTheme();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.vertical16, styles.centerBlock]}>
                    <Image
                        source={require('@assets/images/onboarding-awesome.png')}/>
                    <Text style={styles.centerBlockText}>
                        Let's discover how it works!
                    </Text>
                </View>
            </View>

            <View style={theme.flexBlocks.vertical8}>
                <CustomButton
                    title={'Show me how'}
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
