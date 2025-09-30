import React from 'react';
import { View, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { useCustomTheme } from "@app/theme/ThemeContext";
import { ArrowIcon } from "@assets/icons/ArrowIcon";
import { ResetPassScreenNavigationProp } from "@app/navigation/AppNavigator";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import StepperLine from "@shared/components/StepperLine/StepperLine";

export default function OnboardingTemplate({ navigation }: { navigation: ResetPassScreenNavigationProp }) {
    const { theme } = useCustomTheme();

    const onBack = () => {
        navigation.goBack()
    };


    return (
        <SafeAreaView style={{flex: 1}}>
            <PageWithHeader noStylingHeader headerContent={
                <View style={[theme.flexBlocks.horizontal16, theme.flexBlocks.alignCenter]}>
                    <Pressable
                        onPress={onBack}
                        style={({ pressed }) => [
                            { ...theme.buttons.smallBtn },
                            pressed && { opacity: 0.6 }
                        ]}>
                        <ArrowIcon/>
                    </Pressable>

                    <StepperLine step={1}/>
                </View>
            }>
                <View style={ styles.mainContainer }>
                </View>
            </PageWithHeader>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 24,
        paddingHorizontal: 8,
        paddingBottom: 16,
        borderRadius: 24,
        backgroundColor: '#fff',
    },
});

