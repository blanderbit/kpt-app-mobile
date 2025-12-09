import React from "react";
import {StyleSheet, Text, View, Image, ScrollView} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import StarRating from "@shared/components/StarRating/StarRating";
import { isSmallScreen } from "@shared/utils/screenUtils";

interface SecondStepProps {
    onNext: () => void;
}

export default function SecondStep({onNext}: SecondStepProps) {

    const {theme} = useCustomTheme();
    const isSmall = isSmallScreen();

    const content = (
                <View style={styles.content}>
                    <View style={styles.feedbackContainer}>
                        <View style={[theme.flexBlocks.vertical8, styles.feedbackSection]}>
                            <View style={styles.starsSection}>
                                <StarRating rating={5}/>
                            </View>

                            <Text style={styles.feedbackTitle}>
                                Life-changing for my balance!
                            </Text>

                            <Text style={styles.feedbackInfo}>
                                "I used to feel scattered between work, family, and personal time, always losing track of
                                small but important things. Now, with Plesury, I can bring everything into one clear space
                                and finally feel lighter and focused"
                            </Text>
                        </View>

                        <View
                            style={[theme.flexBlocks.alignCenter, theme.flexBlocks.justifyCenter, theme.flexBlocks.vertical4, styles.personContainer]}>
                            <Text style={styles.personName}>Jessica M.</Text>

                            <Image
                                style={styles.personPhoto}
                                source={require('@assets/images/jessica-img.png')}
                            />
                        </View>
                    </View>
                </View>
    );

    return (
        <View style={styles.container}>
            {isSmall ? (
                <ScrollView 
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {content}
            </ScrollView>
            ) : (
                content
            )}

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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    feedbackContainer: {
        borderRadius: 30,
        backgroundColor: '#ECF1F8',
        padding: 16,
        paddingBottom: 50,
        position: 'relative',
    },
    feedbackSection: {},
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
