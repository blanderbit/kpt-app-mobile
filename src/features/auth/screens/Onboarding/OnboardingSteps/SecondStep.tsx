import React from "react";
import {StyleSheet, Text, View, Pressable, Image} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {COLORS} from "@app/theme";
import StarRating from "@shared/components/StarRating/StarRating";

export default function SecondStep({ onNext }: { onNext: () => void }) {

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
                     <View style={styles.starsSection}>
                         <StarRating rating={5} />
                     </View>

                    <Text style={styles.feedbackTitle}>
                        Life-changing for my balance!
                    </Text>

                    <Text style={styles.feedbackInfo}>
                        "I used to feel scattered between work, family, and personal time, always losing track of small but important things. Now, with AppName, I can bring everything into one clear space and finally feel lighter and focused"
                    </Text>
                </View>

                <View style={[theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter, theme.flexBlocks.vertical4, styles.personContainer]}>
                    <Text style={styles.personName}>Jessica M.</Text>

                     <Image 
                         style={styles.personPhoto}
                         source={require('@assets/images/jessica-img.png')}
                     />
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
         paddingBottom: 50,
         position: 'relative',
     },
    feedbackSection: {
    },
     starsSection: {
         alignItems: 'center',
         marginBottom: 8,
     },
    feedbackTitle: {
        textAlign: 'center',
        fontFamily: 'SF Pro Display Bold',
        fontSize: 18,
        lineHeight: 24,
    },
    feedbackInfo: {
        textAlign: 'center',
        fontFamily: 'SF Pro Display',
        fontSize: 14,
        lineHeight: 20,
        opacity: .6
    },
     personContainer: {
         flexDirection: 'column',
         position: 'absolute',
         left: 0,
         right: 0,
         bottom: -50,
         paddingBottom: 16,
         paddingHorizontal: 16,
     },
    personName: {
        fontFamily: 'SF Pro Display Bold',
        fontSize: 14,
        lineHeight: 20,
        opacity: .6
    },
    personPhoto: {
        width: 52,
        height: 52,
        borderRadius: 44
    }
});
