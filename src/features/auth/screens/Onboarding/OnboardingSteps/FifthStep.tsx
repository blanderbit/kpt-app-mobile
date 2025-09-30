import React, {useState} from "react";
import {StyleSheet, Text, View, ScrollView} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {SectionItem} from "@shared/components/SectionItem/SectionItem";
import {BlackCheckmarkIcon} from "@assets/icons/BlackCheckmarkIcon";
import {GrayCircleIcon} from "@assets/icons/GrayCircleIcon";

export default function FifthStep({onNext}: { onNext: () => void }) {

    const {theme} = useCustomTheme();

    const [ selectedSurveys, setSelectedSurveys ] = useState<number[]>([]);

    const moodSurveys = [
        {
            id: 1,
            isArchived: false,
            title: 'Instagram',
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.9939 0H6.00611C2.69427 0 0 2.81394 0 6.27289V17.7271C0 21.1861 2.69427 24 6.00611 24H17.9939C21.3057 24 24 21.1861 24 17.7271V6.27289C24 2.81394 21.3057 0 17.9939 0ZM2.11877 6.27289C2.11877 4.0345 3.86291 2.21288 6.00611 2.21288H17.9939C20.1371 2.21288 21.8812 4.0345 21.8812 6.27289V17.7271C21.8812 19.9655 20.1371 21.7871 17.9939 21.7871H6.00611C3.86291 21.7871 2.11877 19.9655 2.11877 17.7271V6.27289Z" fill="url(#paint0_linear_1101_24626)"/>
                <path d="M12 17.8342C15.0798 17.8342 17.5867 15.2173 17.5867 11.9994C17.5867 8.78143 15.0811 6.16455 12 6.16455C8.91893 6.16455 6.41333 8.78143 6.41333 11.9994C6.41333 15.2173 8.91893 17.8342 12 17.8342ZM12 8.37885C13.9125 8.37885 15.468 10.0034 15.468 12.0008C15.468 13.9982 13.9125 15.6228 12 15.6228C10.0876 15.6228 8.5321 13.9982 8.5321 12.0008C8.5321 10.0034 10.0876 8.37885 12 8.37885Z" fill="url(#paint1_linear_1101_24626)"/>
                <path d="M18.1038 7.10712C18.9331 7.10712 19.609 6.40258 19.609 5.53501C19.609 4.66743 18.9344 3.96289 18.1038 3.96289C17.2731 3.96289 16.5985 4.66743 16.5985 5.53501C16.5985 6.40258 17.2731 7.10712 18.1038 7.10712Z" fill="url(#paint2_linear_1101_24626)"/>
                <defs>
                    <linearGradient id="paint0_linear_1101_24626" x1="2.01561" y1="22.4265" x2="22.8503" y2="2.47788" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FAAD4F"/>
                        <stop offset="0.35" stop-color="#DD2A7B"/>
                        <stop offset="0.62" stop-color="#9537B0"/>
                        <stop offset="1" stop-color="#515BD4"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear_1101_24626" x1="8.05161" y1="16.1232" x2="16.29" y2="8.23516" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FAAD4F"/>
                        <stop offset="0.35" stop-color="#DD2A7B"/>
                        <stop offset="0.62" stop-color="#9537B0"/>
                        <stop offset="1" stop-color="#515BD4"/>
                    </linearGradient>
                    <linearGradient id="paint2_linear_1101_24626" x1="17.0396" y1="6.6464" x2="19.2603" y2="4.52015" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FAAD4F"/>
                        <stop offset="0.35" stop-color="#DD2A7B"/>
                        <stop offset="0.62" stop-color="#9537B0"/>
                        <stop offset="1" stop-color="#515BD4"/>
                    </linearGradient>
                </defs>
            </svg>
        }
    ]

    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>
            <View style={styles.formTop}>
                <View style={styles.head}>
                    <Text style={[styles.title, {...theme.fonts.title}]}>
                        How did you hear about us?
                    </Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={{paddingVertical: 8}}
                showsVerticalScrollIndicator={false}
            >
                <View style={theme.flexBlocks.vertical8}>
                    {moodSurveys
                        .filter(survey => !survey.isArchived)
                        .map((survey) => (
                            <SectionItem
                                key={survey.id}
                                label={survey.title}
                                icon={survey.icon}
                                rightElement={
                                    selectedSurveys.includes(survey.id)
                                        ? <BlackCheckmarkIcon color={theme.buttons.primary.backgroundColor}/>
                                        : <GrayCircleIcon/>
                                }
                                extraStyles={[styles.variantItem]}
                                onPress={() => setSelectedSurveys(prev => {
                                    if (prev.includes(survey.id)) {
                                        return prev.filter(id => id !== survey.id);
                                    } else {
                                        return [...prev, survey.id];
                                    }
                                })}
                            />
                        ))
                    }
                </View>
            </ScrollView>

            <View style={styles.formBottom}>
                {selectedSurveys.length &&
                    <CustomButton
                        title={'Continue'}
                        onPress={onNext}
                    />
                }
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
    variantItem: {
        borderRadius: 16
    },
});
