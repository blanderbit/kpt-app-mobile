import React from "react";
import {StyleSheet, Text, View, Pressable, Image} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {COLORS} from "@app/theme";

interface FirstStepProps {
    onNext: () => void;
    onBack: () => void;
    currentStep: number;
    totalSteps: number;
}

export default function SecondStep({ onNext, onBack }: FirstStepProps) {

    const {theme} = useCustomTheme();

    const count = 17000;

    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
            <View style={ styles.formTop }>
                <View style={ styles.head }>
                    <Text style={ [ styles.title, { ...theme.fonts.title } ] }>
                        We’ve helped <Text style={styles.count}>{count} busy minds</Text> feel more balanced
                    </Text>
                </View>
            </View>

            <View style={styles.feedbackContainer}>
                <View style={[theme.flexBlocks.vertical8, styles.feedbackSection]}>
                    <View style={styles.starsSection}></View>

                    <Text style={styles.feedbackTitle}>
                        Life-changing for my balance!
                    </Text>

                    <Text style={styles.feedbackInfo}>
                        "I used to feel scattered between work, family, and personal time, always losing track of small but important things. Now, with AppName, I can bring everything into one clear space and finally feel lighter and focused"
                    </Text>
                </View>

                <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter, styles.personContainer]}>
                    <Text style={styles.personName}>Jessica M.</Text>

                    <Image style={styles.personPhoto}/>
                </View>
            </View>

            <View style={ styles.formBottom }>
                <CustomButton
                    title={ 'Continue' }
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
    count: {
        color: COLORS.warning,
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
    feedbackContainer: {
        borderRadius: 30,
        backgroundColor: '#ECF1F8',
        padding: 16,
        paddingBottom: 40,
        position: 'relative'
    },
    feedbackSection: {
    },
    starsSection: {

    },
    feedbackTitle: {
        textAlign: 'center',
    },
    feedbackInfo: {
        textAlign: 'center',
    },
    personContainer: {
        flexDirection: 'column',
        position: 'absolute',
        left: 0,
        bottom: 10,
        width: '100%',
        paddingHorizontal: 16
    },
    personName: {

    },
    personPhoto: {
        width: 52,
        height: 52,
        borderRadius: 44
    }
});
