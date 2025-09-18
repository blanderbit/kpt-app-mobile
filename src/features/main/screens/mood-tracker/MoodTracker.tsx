import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { Trans, useTranslation } from "react-i18next";
import { useCustomTheme } from "@app/theme/ThemeContext";
import BottomSheet from '@shared/components/BottomSheet/BottomSheet';
import { MoodIcon } from "@assets/icons/MoodIcon";
import CustomButton from "@shared/components/Button/Button";
import { ChevronRightIcon } from "@assets/icons/ChevronRightIcon";
import { SectionItem } from "@shared/components/SectionItem/SectionItem";
import WhiteCheckmarkIcon from "@assets/icons/WhiteCheckmarkIcon";
import { GrayCircleIcon } from "@assets/icons/GrayCircleIcon";
import { BlackCheckmarkIcon } from "@assets/icons/BlackCheckmarkIcon";
import { useMoodTypes, useSetMoodForDay } from '@shared/services/api';

const { width: screenWidth } = Dimensions.get('window');
const GAP = 8;
const NUM_COLUMNS = 4; // Увеличиваем до 4 колонок для лучшего отображения
const ITEM_WIDTH = (screenWidth - 32 - (GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

export default function MoodTracker({ visible, onClose }: { visible: boolean, onClose: () => void }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const [ step, setStep ] = useState(1);
    const [ selectedVariants, setSelectedVariants ] = useState([]);
    const [ selectedMoodType, setSelectedMoodType ] = useState<string | null>(null);

    // Получаем типы настроения с бэкенда
    const { data: moodTypes, isLoading: moodTypesLoading } = useMoodTypes();
    
    // Хук для сохранения настроения
    const setMoodForDay = useSetMoodForDay();

    const goNext = () => {
        if (step === 1 && selectedMoodType) {
            setStep(prev => Math.min(prev + 1, 2));
        }
    };
    const goBack = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSaveMood = async () => {
        if (selectedMoodType && moodTypes) {
            try {
                const selectedMoodNames = selectedVariants
                    .map(id => moodTypes.find(mood => mood.id === id)?.name)
                    .filter(Boolean);
                
                await setMoodForDay.mutateAsync({
                    moodType: selectedMoodType,
                    notes: selectedVariants.length > 0 ? `Дополнительные эмоции: ${selectedMoodNames.join(', ')}` : undefined
                });
                onClose();
            } catch (error) {
                console.error('Ошибка сохранения настроения:', error);
            }
        }
    };

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
                        <CustomButton 
                            title={ t('next') } 
                            onPress={ goNext }
                            disabled={ !selectedMoodType }
                        />
                    }
                    { step === 2 &&
                        <CustomButton 
                            title={ t('main.today.additionalTasks.moodTracker.saveRate') }
                            onPress={ handleSaveMood }
                            loading={ setMoodForDay.isPending }
                        /> }
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

                    <ScrollView showsVerticalScrollIndicator={ false }>
                        { moodTypesLoading ? (
                            <Text style={ theme.fonts.regular }>Загрузка...</Text>
                        ) : moodTypes ? (
                            <View style={ styles.gridContainer }>
                                { moodTypes
                                    .sort((a, b) => b.score - a.score) // Сортируем по score (от высокого к низкому)
                                    .map((moodType) => (
                                        <Pressable 
                                            key={ moodType.id } 
                                            style={ [ 
                                                styles.gridItem, 
                                                { 
                                                    width: ITEM_WIDTH,
                                                    borderColor: selectedMoodType === moodType.id ? moodType.color : '#F2F1F6',
                                                    backgroundColor: selectedMoodType === moodType.id ? `${moodType.color}20` : 'transparent'
                                                } 
                                            ] }
                                            onPress={ () => setSelectedMoodType(moodType.id) }
                                        >
                                            <Text style={ { fontSize: 32 } }>{ moodType.emoji }</Text>
                                            <Text numberOfLines={ 1 } style={ [ theme.fonts.subtitleSecond, { fontSize: 12 } ] }>{ moodType.name }</Text>
                                        </Pressable>
                                    )) }
                            </View>
                        ) : (
                            <Text style={ theme.fonts.regular }>Ошибка загрузки типов настроения</Text>
                        ) }
                    </ScrollView>
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
                            Выберите дополнительные эмоции, которые вы сейчас испытываете
                        </Text>
                    </View>

                    <ScrollView
                        contentContainerStyle={ { paddingVertical: 8 } }
                        showsVerticalScrollIndicator={ false }
                    >
                        <View style={theme.flexBlocks.vertical8}>
                            {moodTypes
                                    .filter(moodType => moodType.id !== selectedMoodType) // Исключаем уже выбранное основное настроение
                                    .sort((a, b) => b.score - a.score) // Сортируем по score
                                    .map((moodType) => (
                                        <SectionItem
                                            key={ moodType.id }
                                            label={ `${moodType.emoji} ${moodType.name}` }
                                            rightElement={
                                                selectedVariants.includes(moodType.id)
                                                    ? <BlackCheckmarkIcon color={theme.buttons.primary.backgroundColor}/>
                                                    : <GrayCircleIcon/>
                                            }
                                            extraStyles={ [ styles.variantItem ] }
                                            onPress={ () => setSelectedVariants(prev => {
                                                if ( prev.includes(moodType.id) ) {
                                                    return prev.filter(v => v !== moodType.id);
                                                } else {
                                                    return [ ...prev, moodType.id ];
                                                }
                                            }) }
                                        />
                                    ))
                            }
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
