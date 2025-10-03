import React, {useMemo} from "react";
import {StyleSheet, View, ScrollView} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useCustomTheme} from "@app/theme/ThemeContext";
import {SectionItem} from "@shared/components/SectionItem/SectionItem";
import {ONBOARDING_KEYS} from "@shared/utils/onboardingStorage";

export default function TenthStep({onNext}: { onNext: () => void }) {

    const {theme} = useCustomTheme();

    const ageQuestions = useMemo(() => [
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
    ], []);

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
            <View style={styles.content}>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 8,
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
