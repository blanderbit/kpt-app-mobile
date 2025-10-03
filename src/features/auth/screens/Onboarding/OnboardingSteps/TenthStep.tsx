import React, {useState, useEffect} from "react";
import {StyleSheet, Text, View, ScrollView, ActivityIndicator} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCustomTheme} from "@app/theme/ThemeContext";
import {SectionItem} from "@shared/components/SectionItem/SectionItem";
import {BlackCheckmarkIcon} from "@assets/icons/BlackCheckmarkIcon";
import {GrayCircleIcon} from "@assets/icons/GrayCircleIcon";
import {RemoteSvg} from "@shared/components/RemoteSvgIcon/RemoteSvgIcon";
import {useSocialNetworks} from "@shared/services/api/hooks";
import {ONBOARDING_KEYS} from "@shared/utils/onboardingStorage";

interface FifthStepProps {
    onNext: (selectedNetworks: string[]) => void;
}

export default function TenthStep({onNext}: FifthStepProps) {

    const {theme} = useCustomTheme();

    const [ ageQuestions, setAgeQuestions ] = useState([
        {
            id: 1,
            name: '24 and under',
        },
        {
            id: 2,
            name: '25-34',
        },
        {
            id: 3,
            name: '35-44',
        },
        {
            id: 4,
            name: '45-55',
        },
        {
            id: 5,
            name: '55+',
        }
    ]);

    const saveData = async (age: string) => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEYS.AGE, JSON.stringify(age));
        } catch (error) {
            console.error('Error saving age:', error);
        }
    };

    const handleAgeSelect = (ageId: number) => {
        saveData(ageId);
        onNext(ageId);
    };

    return (
        <View style={styles.container}>
            <View style={styles.formTop}>
                <View style={styles.head}>
                    <Text style={[styles.title, {...theme.fonts.title}]}>
                        How old are you?
                    </Text>
                </View>
            </View>

            {/*{isLoading ? (*/}
            {/*    <View style={styles.loadingContainer}>*/}
            {/*        <ActivityIndicator size="large" color={theme.buttons.primary.backgroundColor} />*/}
            {/*    </View>*/}
            {/*) : (*/}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={theme.flexBlocks.vertical8}>
                        {ageQuestions?.map((age) => (
                            <SectionItem
                                key={age.id}
                                label={age.name}
                                extraStyles={[styles.variantItem]}
                                onPress={() => handleAgeSelect(age.id)}
                            />
                        ))}
                    </View>
                </ScrollView>
            {/*)}*/}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    formTop: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        paddingTop: 10,
        marginBottom: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: 8,
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
    variantItem: {
        borderRadius: 16
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
