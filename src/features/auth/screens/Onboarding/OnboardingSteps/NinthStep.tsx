import React from "react";
import {StyleSheet, Text, View} from "react-native";
import CustomButton from "@shared/components/Button/Button";
import {useCustomTheme} from "@app/theme/ThemeContext";
import {useTranslation} from "react-i18next";
import {SuggestedActivitiesIcon} from "@assets/icons/SuggestedActivitiesIcon";
import {ActivityLabel} from "@shared/components/ActivityLabel";

export default function NinthStep({onNext}: { onNext: () => void }) {
    const {t} = useTranslation();
    const {theme} = useCustomTheme();

    const suggestedActivitiesData = {
        "data": [{
            "activityName": "Morning run new",
            "activityType": "general",
            "closedAt": null,
            "content": "Ran 5km in 30 minutes",
            "createdAt": "2025-09-26T12:48:21.325Z",
            "id": 12,
            "position": 0,
            "rateActivities": [Array],
            "status": "active",
            "updatedAt": "2025-09-26T13:06:35.000Z",
            "userId": 15
        }, {
            "activityName": "Morning run test 2 йцуйцуфівфівфі в вйцв йів фй цуіфв",
            "activityType": "general",
            "closedAt": null,
            "content": "Ran 5km in 30 minutes",
            "createdAt": "2025-09-26T13:06:18.788Z",
            "id": 15,
            "position": 1,
            "rateActivities": [Array],
            "status": "active",
            "updatedAt": "2025-09-26T13:06:35.000Z",
            "userId": 15
        }],
        "links": {"current": "http://kpt.api.the-displaycontrol.com/profile/activities?page=1&limit=20&sortBy=position:ASC"},
        "meta": {"currentPage": 1, "itemsPerPage": 20, "sortBy": [[Array]], "totalItems": 2, "totalPages": 1}
    }

    return (
        <View style={{flexDirection: 'column', justifyContent: 'space-between', height: '100%'}}>

            <View style={theme.flexBlocks.vertical16}>
                <Text style={styles.suggestingText}>
                    Based on your previous answers we prepared a few first tasks and activities for you.
                </Text>

                <View style={theme.containers.cardRound}>
                    <View
                        style={[theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, {paddingHorizontal: 8}]}>
                        <SuggestedActivitiesIcon/>

                        <Text style={theme.fonts.subtitle}>
                            {t('main.activities.suggestedActivities')}
                        </Text>
                    </View>

                    <View style={styles.activitySections}>
                        {suggestedActivitiesData?.data && suggestedActivitiesData.data.length > 0 &&
                            suggestedActivitiesData.data.map((activity, index) => (
                                <View
                                    key={activity.id}
                                    style={{
                                        ...styles.activitySection,
                                        ...(index !== suggestedActivitiesData.data.length - 1
                                            ? {borderBottomWidth: 1, borderBottomColor: '#E2DDD8'}
                                            : {}),
                                    }}
                                >
                                    <ActivityLabel id={activity.activityType}/>

                                    <View style={[styles.activityContent, theme.flexBlocks.alignCenter]}>
                                        <Text
                                            style={[styles.activityTitle, theme.fonts.subheader]}>
                                            {activity.activityName}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </View>

            <View style={[styles.formBottom, theme.flexBlocks.vertical4]}>
                <CustomButton
                    title={'Add to my list'}
                    onPress={onNext}
                />

                <CustomButton
                    title={'Skip'}
                    onPress={onNext}
                    themeName={'white_no_border'}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formBottom: {
        width: '100%',
    },
    suggestingText: {
        fontFamily: 'SF Pro Display Bold',
        fontSize: 14,
        lineHeight: 20,
        opacity: .6,
        textAlign: 'center',
        letterSpacing: 0
    },
    activitySections: {
        flexDirection: 'column',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
    },
    activitySection: {
        width: '100%',
        minHeight: 115,
        flexDirection: 'column',
        padding: 16,
        gap: 8,
    },
    activityContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        width: '100%',
        marginRight: -30
    },
    activityTitle: {
        maxWidth: '70%',
    },
});
