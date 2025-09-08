import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { Trans, useTranslation } from "react-i18next";
import { useCustomTheme } from "@app/theme/ThemeContext";
import BottomSheet from '@shared/components/BottomSheet/BottomSheet';
import { MoodIcon } from "@assets/icons/MoodIcon";
import CustomButton from "@shared/components/Button/Button";
import { moodConfig, testVariants } from "@features/main/screens/mood-tracker/const";
import { ChevronRightIcon } from "@assets/icons/ChevronRightIcon";
import { SectionItem } from "@shared/components/SectionItem/SectionItem";
import WhiteCheckmarkIcon from "@assets/icons/WhiteCheckmarkIcon";
import { GrayCircleIcon } from "@assets/icons/GrayCircleIcon";
import { BlackCheckmarkIcon } from "@assets/icons/BlackCheckmarkIcon";

const { width: screenWidth } = Dimensions.get('window');
const GAP = 8;
const NUM_COLUMNS = 3;
const ITEM_WIDTH = (screenWidth - 32 - (GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

export default function MoodTracker({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const [ step, setStep ] = useState(1);
    const [ selectedVariants, setSelectedVariants ] = useState([]);

    const goNext = () => setStep(prev => Math.min(prev + 1, 2));
    const goBack = () => setStep(prev => Math.max(prev - 1, 1));

    return (
        <BottomSheet
            title={ t('main.today.additionalTasks.mood.title') }
            visible={ visible }
            onClose={ onClose }
            onBack={ goBack }
            closeBtn={ step === 1 }
            backBtn={ step === 2 }
            button={
                <View style={ { flexDirection: 'row', justifyContent: 'space-between' } }>
                    { step === 1 &&
                        <CustomButton title={ t('next') } onPress={ goNext }/>
                    }
                    { step === 2 &&
                        <CustomButton title={ t('main.today.additionalTasks.moodTracker.saveRate') }
                                      onPress={ onClose }/> }
                </View>
            }
        >
            { step === 1 && (
                <View style={ theme.flexBlocks.vertical16 }>
                    <View style={ theme.flexBlocks.vertical8 }>
                        <MoodIcon/>

                        <Text style={ { ...theme.fonts.title, textAlign: 'left' } }>
                            { t('main.today.additionalTasks.moodTracker.title') }
                        </Text>

                        <Text style={ [ theme.fonts.regular, { opacity: 0.6 } ] }>
                            { t('main.today.additionalTasks.moodTracker.desc') }
                        </Text>
                    </View>

                    <View style={ styles.gridContainer }>
                        { moodConfig(80).reverse().map(({ value, icon, label }) => (
                            <Pressable key={ value } style={ [ styles.gridItem, { width: ITEM_WIDTH } ] }>
                                { icon }
                                <Text numberOfLines={ 1 } style={ theme.fonts.subtitleSecond }>{ t(label) }</Text>
                            </Pressable>
                        )) }
                    </View>
                </View>
            ) }

            { step === 2 && (
                <View style={ theme.flexBlocks.vertical16 }>
                    <View style={ theme.flexBlocks.vertical8 }>
                        <MoodIcon size={ 30 }/>

                        <Text style={ { ...theme.fonts.title, textAlign: 'left' } }>
                            <Trans
                                i18nKey="main.today.additionalTasks.moodTracker.titleStepTwo"
                                components={ {
                                    styled: <Text style={ { color: "#f4a73a" } }/>,
                                } }
                            />
                        </Text>

                        <Text style={ [ theme.fonts.regular, { opacity: 0.6 } ] }>
                            { t('main.today.additionalTasks.moodTracker.descStepTwo') }
                        </Text>
                    </View>

                    <ScrollView
                        style={ { maxHeight: '70%' }}
                        contentContainerStyle={ { paddingVertical: 8 } }
                        showsVerticalScrollIndicator={ false }
                    >
                        <View style={theme.flexBlocks.vertical8}>
                            { testVariants.map((variant, index) => (
                                <SectionItem
                                    key={ index }
                                    label={ variant.label }
                                    rightElement={
                                        selectedVariants.includes(variant.value)
                                            ? <BlackCheckmarkIcon color={theme.buttons.primary.backgroundColor}/>
                                            : <GrayCircleIcon/>
                                    }
                                    extraStyles={ [ styles.variantItem ] }
                                    onPress={ () => setSelectedVariants(prev => {
                                        if ( prev.includes(variant.value) ) {
                                            return prev.filter(v => v !== variant.value);
                                        } else {
                                            return [ ...prev, variant.value ];
                                        }
                                    }) }
                                />
                            )) }
                        </View>
                    </ScrollView>
                </View>
            ) }
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: GAP
    },
    gridItem: {
        marginBottom: GAP,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#F2F1F6',
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        gap: 4
    },
    variantItem: {
        borderRadius: 16
    },
});
