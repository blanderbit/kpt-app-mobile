import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from "@app/theme/ThemeContext";
import { ArrowIcon } from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import { SurveyScreenNavigationProp, SurveyScreenRouteProp } from "@app/navigation/AppNavigator";
import { Routes } from '@app/navigation/const';
import { useSurveyById } from '@shared/services/api/hooks';
import RenderHTML from 'react-native-render-html';
import CustomButton from "@shared/components/Button/Button";

export default function SurveyScreen({ navigation, route }: { navigation: SurveyScreenNavigationProp, route: SurveyScreenRouteProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const { width } = useWindowDimensions();

    const { id } = route.params;
    console.log('📋 [SurveyScreen] Получен ID из route.params:', id);
    console.log('📋 [SurveyScreen] ID как число:', Number(id));
    const surveyId = Number(id);
    
    const { data: survey, isLoading, error, isFetching } = useSurveyById(surveyId);

    useEffect(() => {
        console.log('📋 [SurveyScreen] useEffect - survey изменился:', survey);
        console.log('📋 [SurveyScreen] isLoading:', isLoading);
        console.log('📋 [SurveyScreen] error:', error);
        console.log('📋 [SurveyScreen] isFetching:', isFetching);
    }, [survey, isLoading, error, isFetching]);

    const onBack = () => navigation.goBack();

    const onStart = () => {
        console.log('📋 [SurveyScreen] Нажата кнопка Let\'s start для опроса:', surveyId);
        if (survey && survey.questions && survey.questions.length > 0) {
            navigation.navigate(Routes.SURVEY_QUESTIONS, { survey });
        } else {
            console.log('📋 [SurveyScreen] ⚠️ У опроса нет вопросов');
        }
    };

    if (isLoading || isFetching) {
        return (
            <PageWithHeader headerContent={
                <>
                    <Pressable
                        onPress={onBack}
                        style={({ pressed }) => [
                            styles.smallBtn,
                            { ...theme.buttons.smallBtn },
                            pressed && { opacity: 0.6 }
                        ]}>
                        <ArrowIcon />
                    </Pressable>
                    <Text style={theme.fonts.subtitle}>
                        {t('main.additionalTasks.survey.title')}
                    </Text>
                </>
            }>
                <View style={[styles.center, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" />
                    <Text style={[theme.fonts.regular, { marginTop: 16 }]}>Загрузка опроса...</Text>
                </View>
            </PageWithHeader>
        );
    }

    if (error || !survey) {
        console.log('📋 [SurveyScreen] ❌ Ошибка или опрос не найден:', error);
        return (
            <PageWithHeader headerContent={
                <>
                    <Pressable
                        onPress={onBack}
                        style={({ pressed }) => [
                            styles.smallBtn,
                            { ...theme.buttons.smallBtn },
                            pressed && { opacity: 0.6 }
                        ]}>
                        <ArrowIcon />
                    </Pressable>
                    <Text style={theme.fonts.subtitle}>
                        {t('main.additionalTasks.survey.title')}
                    </Text>
                </>
            }>
                <View style={styles.center}>
                    <Text style={theme.fonts.subheader}>
                        {error ? 'Ошибка загрузки опроса' : 'Опрос не найден'}
                    </Text>
                    {error && (
                        <Text style={[theme.fonts.regular, { marginTop: 8, opacity: 0.6 }]}>
                            {error.message || 'Неизвестная ошибка'}
                        </Text>
                    )}
                </View>
            </PageWithHeader>
        );
    }

    console.log('📋 [SurveyScreen] ✅ Отображаем опрос:', {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        questionsCount: survey.questions?.length || 0,
        hasImage: !!(survey.file?.fileUrl),
        imageUrl: survey.file?.fileUrl,
    });

    // Обработка description - может быть строкой или null
    const descriptionText = survey.description || null;

    return (
        <PageWithHeader headerContent={
            <>
                <Pressable
                    onPress={onBack}
                    style={({ pressed }) => [
                        styles.smallBtn,
                        { ...theme.buttons.smallBtn },
                        pressed && { opacity: 0.6 }
                    ]}>
                    <ArrowIcon />
                </Pressable>
                <Text style={theme.fonts.subtitle}>
                    {t('main.additionalTasks.survey.title')}
                </Text>
            </>
        }>
            <ScrollView 
                style={styles.mainContainer} 
                contentContainerStyle={{ flex: 1, paddingBottom: 24, marginTop: 10 }}
            >
                <View style={[theme.flexBlocks.vertical8, { flex: 1, paddingBottom: 24 }]}>
                    {/* Изображение в самом верху, если есть файл */}
                    {survey.file?.fileUrl && (
                        <Image
                            source={{ uri: survey.file.fileUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                    
                    {/* Заголовок */}
                    <Text style={[theme.fonts.title]}>{survey.title}</Text>
                    
                    {/* Описание опроса */}
                    {descriptionText && (
                        <RenderHTML
                            contentWidth={width - 48}
                            source={{ html: descriptionText }}
                            baseStyle={{
                                fontSize: 16,
                                lineHeight: 24,
                                color: theme.colors?.text || '#000',
                            }}
                            tagsStyles={{
                                p: {
                                    marginBottom: 12,
                                },
                                strong: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                    )}
                </View>

                {/* Кнопка Let's start в конце страницы */}
                <View style={styles.buttonContainer}>
                    <CustomButton
                        title="Let's start"
                        onPress={onStart}
                        themeName="primary"
                    />
                </View>
            </ScrollView>
        </PageWithHeader>
    );
}

const styles = StyleSheet.create({
    smallBtn: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    mainContainer: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 24,
        marginBottom: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    buttonContainer: {
        paddingTop: 24,
        paddingHorizontal: 16,
    },
});

