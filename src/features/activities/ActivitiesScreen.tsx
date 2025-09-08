import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Pressable,
    TextInput,
    Keyboard,
    Animated,
} from 'react-native';
import { useCustomTheme } from '@app/theme/ThemeContext';
import { useTranslation } from "react-i18next";
import { HomeScreenNavigationProp } from "@app/navigation/AppNavigator";
import { InfoPopup } from "@shared/components/InfoPopup/InfoPopup";
import LayersIcon from "@assets/icons/LayersIcon";
import { DailyActivitySections } from "@features/main/screens/today/const";
import SemiCircleSplit from "@shared/components/GradientArc/GradientArc";
import CustomButton from "@shared/components/Button/Button";
import { PlusIcon } from "@assets/icons/PlusIcon";
import { useToast } from "@shared/components/Toast/ToastProvider";
import { SuggestedActivitiesIcon } from "@assets/icons/SuggestedActivitiesIcon";
import { ArchiveIcon } from "@assets/icons/ArchiveIcon";
import { ReturnIcon } from "@assets/icons/ReturnIcon";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { BurgerIcon } from "@assets/icons/BurgerIcon";
import DraggableList from "@features/activities/draggable-activities/DraggableActivities";

export default function ActivitiesScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const { showToast } = useToast();

    const [ satisfaction, setSatisfaction ] = useState(0)
    const [ achieveness, setAchieveness ] = useState(0)

    const [ activitySections, setActivitySections ] = useState([ ...DailyActivitySections ])
    const [ suggestedActivities, setSuggestedActivities ] = useState([ ...DailyActivitySections ])
    const [ newActivity, setNewActivity ] = useState('');
    const [ inputHeight, setInputHeight ] = useState(28);

    const handleAddNewActivity = () => {
        if ( newActivity.trim().length < 10 ) {
            showToast({ message: "The name of activity should not be less than 10 symbols.", type: "error" })
            // showToast({ message: "Activity successfully added", type: "info" })
            return;
        }
        // onAddActivity(newActivity.trim());
        setNewActivity("");
        Keyboard.dismiss();
    };

    const renderRightActions = (progress, dragX, sectionIndex) => {
        const scale = dragX.interpolate({
            inputRange: [ -150, 0 ],
            outputRange: [ 1, 1 ],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View
                style={ {
                    transform: [ { scale } ],
                    justifyContent: "center",
                    marginLeft: 10,
                } }
            >
                <RectButton onPress={ () => {
                } }>
                    <Pressable style={ styles.archiveBtn }>
                        <ArchiveIcon/>
                    </Pressable>
                </RectButton>
            </Animated.View>
        );
    };

    return (
        <View style={ [ styles.container, theme.flexBlocks.vertical8 ] }>
            <InfoPopup title={ 'Min-Max Technique' }
                       desc={ 'Set flexible goals: do the minimum to stay consistent (5 mins), aim for 100% as your baseline (30 mins), and push for the max when feeling motivated (1 hour).' }/>

            <View style={ theme.containers.cardRound }>
                <View
                    style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                    <LayersIcon/>

                    <Text style={ theme.fonts.subtitle }>
                        { t('main.activities.myActivities') }
                    </Text>
                </View>

                <View style={ styles.activitySections }>
                    <View style={ { height: 115 * activitySections.length } }>
                        <DraggableList itemsArr={ activitySections }
                                       itemHeight={ 115 }
                                       renderItem={ (section, index) =>
                                           <View style={ {
                                               ...styles.activitySection,
                                               borderBottomWidth: 1,
                                               borderBottomColor: '#E2DDD8',
                                           } }>
                                               <Swipeable
                                                   renderRightActions={ (progress, dragX) => renderRightActions(progress, dragX, index) }
                                                   overshootRight={ false }>
                                                   <View style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter ] }>
                                                       <BurgerIcon/>

                                                       <View>
                                                           <View style={ {
                                                               ...styles.activityLabel,
                                                               backgroundColor: section.backgroundColor
                                                           } }>
                                                               { section.icon }

                                                               <Text style={ {
                                                                   ...theme.fonts.label,
                                                                   color: section.color
                                                               } }>
                                                                   { t(section.label) }
                                                               </Text>
                                                           </View>

                                                           <Pressable style={ styles.activityContent }>
                                                               <Text
                                                                   style={ [ styles.activityTitle, theme.fonts.subheader ] }> { t(section.info) } </Text>
                                                               <SemiCircleSplit valueA={ satisfaction }
                                                                                valueB={ achieveness }/>
                                                           </Pressable>
                                                       </View>
                                                   </View>
                                               </Swipeable>
                                           </View>
                                       }
                        />
                    </View>
                    {/*{*/ }
                    {/*    activitySections.map((section, index) => (*/ }
                    {/*        <View key={ index }*/ }
                    {/*              style={ {*/ }
                    {/*                  ...styles.activitySection,*/ }
                    {/*                  borderBottomWidth: 1,*/ }
                    {/*                  borderBottomColor: '#E2DDD8',*/ }
                    {/*              } }>*/ }
                    {/*            <Swipeable*/ }
                    {/*                renderRightActions={ (progress, dragX) => renderRightActions(progress, dragX, index) }*/ }
                    {/*                overshootRight={ false }>*/ }
                    {/*                <View style={ { ...styles.activityLabel, backgroundColor: section.backgroundColor } }>*/ }
                    {/*                    { section.icon }*/ }
                    {/*                    <Text style={ {*/ }
                    {/*                        ...theme.fonts.label,*/ }
                    {/*                        color: section.color*/ }
                    {/*                    } }>{ t(section.label) }</Text>*/ }
                    {/*                </View>*/ }
                    {/*                <Pressable style={ styles.activityContent }>*/ }
                    {/*                    <Text style={ [ styles.activityTitle, theme.fonts.subheader ] }> { t(section.info) } </Text>*/ }
                    {/*                    <SemiCircleSplit valueA={ satisfaction } valueB={ achieveness }/>*/ }
                    {/*                </Pressable>*/ }
                    {/*            </Swipeable>*/ }
                    {/*        </View>*/ }
                    {/*    ))*/ }
                    {/*}*/ }

                    <View
                        style={ [ styles.activitySection, theme.flexBlocks.justifySpaceBetween, theme.flexBlocks.alignCenter, { height: 'auto' } ] }>
                        <TextInput style={ [ styles.textInput, { height: inputHeight } ] }
                                   placeholder={ t('main.activities.addNewActivity') } multiline value={ newActivity }
                                   onContentSizeChange={ (e) => {
                                       const newHeight = e.nativeEvent.contentSize.height;
                                       setInputHeight(Math.min(newHeight, 56));
                                   } }
                                   onChangeText={ (val) => {
                                       if ( val.endsWith('\n') ) {
                                           handleAddNewActivity();
                                       } else {
                                           setNewActivity(val);
                                       }
                                   } }/>

                        <CustomButton title={ t('add') }
                                      onPress={ () => {
                                      } }
                                      buttonStyle={ {
                                          ...styles.addBtn,
                                          ...(newActivity ? {} : { opacity: 0 }),
                                      } }
                                      contentStyle={ { gap: 4 } }
                                      disabled={ newActivity.trim().length < 10 }>
                            <PlusIcon color="#fff" size={ 20 }/>
                        </CustomButton>
                    </View>
                </View>
            </View>

            <View style={ theme.containers.cardRound }>
                <View
                    style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                    <SuggestedActivitiesIcon/>

                    <Text style={ theme.fonts.subtitle }>
                        { t('main.activities.suggestedActivities') }
                    </Text>
                </View>

                <View style={ styles.activitySections }>
                    { suggestedActivities.map((section, index) => (
                        <View
                            key={ index }
                            style={ {
                                ...styles.activitySection,
                                ...(index !== suggestedActivities.length - 1
                                    ? { borderBottomWidth: 1, borderBottomColor: '#E2DDD8' }
                                    : {}),
                            } }
                        >
                            <View style={ { ...styles.activityLabel, backgroundColor: section.backgroundColor } }>
                                { section.icon }
                                <Text style={ {
                                    ...theme.fonts.label,
                                    color: section.color
                                } }>{ t(section.label) }</Text>
                            </View>

                            <View style={ [ styles.activityContent, theme.flexBlocks.alignCenter ] }>
                                <Text
                                    style={ [ styles.activityTitle, theme.fonts.subheader ] }>
                                    { t(section.info) }
                                </Text>

                                <CustomButton title={ t('add') }
                                              onPress={ () => {
                                              } }
                                              buttonStyle={ styles.addBtn }
                                              contentStyle={ { gap: 4 } }>
                                    <PlusIcon color="#fff" size={ 20 }/>
                                </CustomButton>
                            </View>
                        </View>
                    )) }
                </View>
            </View>

            <View style={ theme.containers.cardRound }>
                <View
                    style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                    <ArchiveIcon/>

                    <Text style={ theme.fonts.subtitle }>
                        { t('main.activities.archivedActivities') }
                    </Text>
                </View>

                <View style={ styles.activitySections }>
                    { suggestedActivities.map((section, index) => (
                        <View
                            key={ index }
                            style={ {
                                ...styles.activitySection,
                                ...(index !== suggestedActivities.length - 1
                                    ? { borderBottomWidth: 1, borderBottomColor: '#E2DDD8' }
                                    : {}),
                            } }
                        >
                            <View style={ { ...styles.activityLabel, backgroundColor: section.backgroundColor } }>
                                { section.icon }
                                <Text style={ {
                                    ...theme.fonts.label,
                                    color: section.color
                                } }>{ t(section.label) }</Text>
                            </View>

                            <View style={ [ styles.activityContent, theme.flexBlocks.alignCenter ] }>
                                <Text
                                    style={ [ styles.activityTitle, theme.fonts.subheader ] }>
                                    { t(section.info) }
                                </Text>

                                <CustomButton onPress={ () => {
                                } }
                                              buttonStyle={ styles.returnBtn }
                                              contentStyle={ { gap: 4 } }>
                                    <ReturnIcon/>
                                </CustomButton>
                            </View>
                        </View>
                    )) }
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    activitySections: {
        flexDirection: 'column',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
    },
    activitySection: {
        width: '100%',
        height: 115,
        flexDirection: 'column',
        padding: 16,
        gap: 8,
    },
    activityLabel: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 24,
        flexDirection: 'row',
        gap: 4,
        alignSelf: 'flex-start',
    },
    activityContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
    },
    activityTitle: {
        maxWidth: '70%',
    },
    textInput: {
        backgroundColor: '#F5F5F5',
        fontSize: 20,
        lineHeight: 28,
        maxWidth: '70%',
        padding: 0,
    },
    addBtn: {
        width: 'auto',
        height: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    returnBtn: {
        width: 'auto',
        height: 'auto',
        paddingVertical: 11,
        paddingHorizontal: 11,
    },
    archiveBtn: {
        backgroundColor: '#8100851A',
        borderRadius: 12,
        padding: 6,
    },
});

