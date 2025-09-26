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
import { ActivityLabel } from '@shared/components/ActivityLabel';
import { HomeScreenNavigationProp } from "@app/navigation/AppNavigator";
import { InfoPopup } from "@shared/components/InfoPopup/InfoPopup";
import LayersIcon from "@assets/icons/LayersIcon";
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
import { 
    useMyActivities, 
    useCreateActivity, 
    useDeleteActivity,
    useSuggestedActivities,
    useAddSuggestedActivityToActivities,
    useDeleteSuggestedActivity
} from '@shared/services/api/hooks';
import { useQueryClient } from '@tanstack/react-query';

export default function ActivitiesScreen({ navigation }: { navigation: HomeScreenNavigationProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const { showToast } = useToast();

    const [ satisfaction, setSatisfaction ] = useState(0)
    const [ achieveness, setAchieveness ] = useState(0)
    const [ newActivity, setNewActivity ] = useState('');
    const [ inputHeight, setInputHeight ] = useState(28);
    const [ activitiesKey, setActivitiesKey ] = useState(0);

    // Query client for cache invalidation
    const queryClient = useQueryClient();

    // API hooks
    const { data: myActivities, isLoading, error } = useMyActivities();
    const { data: suggestedActivitiesData } = useSuggestedActivities();

    const createActivityMutation = useCreateActivity();
    const deleteActivityMutation = useDeleteActivity();
    const addSuggestedActivityMutation = useAddSuggestedActivityToActivities();
    const deleteSuggestedActivityMutation = useDeleteSuggestedActivity();

    // Debug logs
    console.log('=== ACTIVITIES DEBUG ===');
    console.log('myActivities:', myActivities);
    console.log('myActivities.data:', myActivities?.data);
    console.log('myActivities.data length:', myActivities?.data?.length);
    console.log('isLoading:', isLoading);
    console.log('error:', error);
    console.log('=== END DEBUG ===');

    // Log when myActivities changes
    React.useEffect(() => {
        console.log('🔄 myActivities data changed:', myActivities?.data);
    }, [myActivities]);

    // Function to force re-render of DraggableList
    const forceActivitiesRerender = () => {
        setActivitiesKey(prev => prev + 1);
    };

    const handleAddNewActivity = () => {
        if ( newActivity.trim().length < 10 ) {
            showToast({ message: "The name of activity should not be less than 10 symbols.", type: "error" })
            return;
        }
        
        createActivityMutation.mutate({
            activityName: newActivity.trim(),
            isPublic: false
        }, {
            onSuccess: (data) => {
                console.log('✅ Activity created successfully:', data);
                showToast({ message: "Activity successfully added", type: "success" });
                setNewActivity("");
                Keyboard.dismiss();
                
                // Invalidate and refetch activities data
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                // Force refetch
                queryClient.refetchQueries({ queryKey: ['activities', 'my'] });
                
                // Force re-render of DraggableList
                forceActivitiesRerender();
                
                console.log('🔄 Cache invalidated and refetch triggered');
            },
            onError: (error) => {
                showToast({ message: "Failed to add activity", type: "error" });
            }
        });
    };

    const handleArchiveActivity = (activityId: number) => {
        deleteActivityMutation.mutate(activityId, {
            onSuccess: () => {
                showToast({ message: "Activity archived", type: "success" });
                
                // Invalidate and refetch activities data
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                
                // Force re-render of DraggableList
                forceActivitiesRerender();
            },
            onError: (error) => {
                showToast({ message: "Failed to archive activity", type: "error" });
            }
        });
    };

    const handleAddSuggestedActivity = (suggestedActivityId: number) => {
        addSuggestedActivityMutation.mutate({
            id: suggestedActivityId
        }, {
            onSuccess: () => {
                showToast({ message: "Activity added to your list", type: "success" });
                
                // Invalidate and refetch activities data
                queryClient.invalidateQueries({ queryKey: ['activities'] });
                queryClient.invalidateQueries({ queryKey: ['activities', 'my'] });
                queryClient.invalidateQueries({ queryKey: ['suggestedActivities'] });
                
                // Force re-render of DraggableList
                forceActivitiesRerender();
            },
            onError: (error) => {
                showToast({ message: "Failed to add activity", type: "error" });
            }
        });
    };

    const handleDeleteSuggestedActivity = (suggestedActivityId: number) => {
        deleteSuggestedActivityMutation.mutate(suggestedActivityId, {
            onSuccess: () => {
                showToast({ message: "Suggested activity removed", type: "success" });
            },
            onError: (error) => {
                showToast({ message: "Failed to remove suggested activity", type: "error" });
            }
        });
    };

    const renderRightActions = (progress, dragX, activityId: number) => {
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
                <RectButton onPress={ () => handleArchiveActivity(activityId) }>
                    <Pressable style={ styles.archiveBtn }>
                        <ArchiveIcon/>
                    </Pressable>
                </RectButton>
            </Animated.View>
        );
    };

    return (
        <View style={ [ styles.container, theme.flexBlocks.vertical8 ] }>
            <View style={ theme.containers.cardRound }>
                <View
                    style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter, { paddingHorizontal: 8 } ] }>
                    <LayersIcon/>

                    <Text style={ theme.fonts.subtitle }>
                        { t('main.activities.myActivities') }
                    </Text>
                </View>

                <View style={ styles.activitySections }>
                    {myActivities?.data && myActivities.data.length > 0 ? (
                        <View style={ { height: 115 * myActivities.data.length } }>
                            <DraggableList 
                                key={`activities-${activitiesKey}-${myActivities.data.length}`}
                                itemsArr={ myActivities.data }
                                itemHeight={ 115 }
                                renderItem={ (activity, index) =>
                                               <View style={ {
                                                   ...styles.activitySection,
                                                   borderBottomWidth: 1,
                                                   borderBottomColor: '#E2DDD8',
                                               } }>
                                                   <Swipeable
                                                       renderRightActions={ (progress, dragX) => renderRightActions(progress, dragX, activity.id) }
                                                       overshootRight={ false }>
                                                       <View style={ [ theme.flexBlocks.horizontal4, theme.flexBlocks.alignCenter ] }>
                                                           <BurgerIcon/>

                                                           <View>
                                                               <ActivityLabel id={activity.activityType} />

                                                               <Pressable style={ styles.activityContent }>
                                                                   <Text
                                                                       style={ [ styles.activityTitle, theme.fonts.subheader ] }> 
                                                                       { activity.activityName } 
                                                                   </Text>
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
                    ) : null}

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
                                      onPress={ handleAddNewActivity }
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
                    {suggestedActivitiesData?.data && suggestedActivitiesData.data.length > 0 && 
                        suggestedActivitiesData.data.map((activity, index) => (
                            <View
                                key={ activity.id }
                                style={ {
                                    ...styles.activitySection,
                                    ...(index !== suggestedActivitiesData.data.length - 1
                                        ? { borderBottomWidth: 1, borderBottomColor: '#E2DDD8' }
                                        : {}),
                                } }
                            >
                                <ActivityLabel id={activity.activityType} />

                                <View style={ [ styles.activityContent, theme.flexBlocks.alignCenter ] }>
                                    <Text
                                        style={ [ styles.activityTitle, theme.fonts.subheader ] }>
                                        { activity.activityName }
                                    </Text>

                                    <CustomButton title={ t('add') }
                                                  onPress={ () => handleAddSuggestedActivity(activity.id) }
                                                  buttonStyle={ styles.addBtn }
                                                  contentStyle={ { gap: 4 } }>
                                        <PlusIcon color="#fff" size={ 20 }/>
                                    </CustomButton>
                                </View>
                            </View>
                        ))
                    }
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
        width: '100%',
        marginRight: -30
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

