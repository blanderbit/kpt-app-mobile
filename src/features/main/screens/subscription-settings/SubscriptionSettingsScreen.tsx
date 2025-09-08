import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ArrowIcon } from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import { useCustomTheme } from "@app/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { COLORS } from "@app/theme";
import { SubscriptionSettingsScreenNavigationProp } from "@app/navigation/AppNavigator";
import MySubscriptionIcon from "@assets/icons/MySubcriptionIcon";
import { Label, LabelType } from "@shared/components/Label/Label";
import { ChevronRightIcon } from "@assets/icons/ChevronRightIcon";
import { SectionItem } from "@shared/components/SectionItem/SectionItem";
import { formatDateLong } from "@shared/utils/formatDate";

export default function SubscriptionSettingsScreen({ navigation }: {
    navigation: SubscriptionSettingsScreenNavigationProp
}) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    const onBack = () => {
        navigation.goBack()
    };

    return (
        <PageWithHeader headerContent={
            <>
                <Pressable
                    onPress={ onBack }
                    style={ ({ pressed }) => [
                        styles.smallBtn,
                        { ...theme.buttons.smallBtn },
                        pressed && { opacity: 0.6 }
                    ] }>
                    <ArrowIcon/>
                </Pressable>
                <Text style={ theme.fonts.subtitle }>
                    { t('main.profile.subscriptionSettingsScreen.title') }
                </Text>
            </>
        }>
            <View style={ theme.flexBlocks.vertical8 }>
                <View style={ [ theme.containers.cardRound, { paddingHorizontal: 16 } ] }>
                    <View style={ theme.flexBlocks.horizontal4 }>
                        <MySubscriptionIcon/>

                        <Text style={ [ theme.fonts.subtitle, { textAlign: 'left' } ] }>
                            { t('main.profile.subscriptionSettingsScreen.mySubscription') }
                        </Text>
                    </View>

                    <View style={ theme.flexBlocks.vertical4 }>
                        <Text style={ theme.fonts.titleSecond }>
                            username@mail.com
                        </Text>

                        <Text style={ [ theme.fonts.regular, { opacity: .6 } ] }>
                            Description
                        </Text>
                    </View>
                </View>

                <View style={ [ theme.containers.cardRound ] }>
                    <Text
                        style={ [ theme.fonts.titleSecond, { paddingHorizontal: 16 } ] }>{ t('main.profile.subscriptionSettingsScreen.oneMonth') }</Text>

                    <View>
                        <SectionItem
                            label={ t('main.profile.subscriptionSettingsScreen.subscription') }
                            rightElement={
                                <Label status={ LabelType.DANGER }
                                       title={ 'main.profile.subscriptionSettingsScreen.statuses.cancelled' }/>
                            }
                            extraStyles={ [
                                styles.settingsElementsBorderTop,
                                styles.settingsElementsBorder,
                            ] }
                            extraLabelStyles={ [
                                theme.fonts.subtitle
                            ] }
                        />
                        <SectionItem
                            label={ t('main.profile.subscriptionSettingsScreen.lastDay') }
                            rightElement={
                                <Text style={ theme.fonts.label }>{ formatDateLong(new Date('2025-01-21')) }</Text>
                            }
                            extraStyles={ [
                                styles.settingsElementsBorderBottom,
                            ] }
                            extraLabelStyles={ [
                                theme.fonts.subtitle
                            ] }
                        />
                    </View>

                    <Text style={ [ theme.fonts.regular, { opacity: .6, paddingHorizontal: 16 } ] }>
                        You will not be charged in the future. You can still access App until your current subscription
                        ends.
                    </Text>
                </View>
            </View>
        </PageWithHeader>
    );
};


const styles = StyleSheet.create({
    smallBtn: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    changePassBtn: {
        alignSelf: 'flex-start',
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 12,
        height: 'auto'
    },
    dots: {
        fontSize: 60,
        fontWeight: 600,
        letterSpacing: 5,
        lineHeight: 35,
        color: COLORS.gray_dark
    },
    settingsElementsBorder: {
        borderBottomWidth: 1,
        borderColor: '#E2DDD8',
    },
    settingsElementsBorderTop: {
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16
    },
    settingsElementsBorderBottom: {
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16
    }
});
