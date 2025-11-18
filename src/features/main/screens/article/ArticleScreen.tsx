import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image, ActivityIndicator, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useCustomTheme } from "@app/theme/ThemeContext";
import { ArrowIcon } from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import { ArticleScreenNavigationProp, ArticleScreenRouteProp } from "@app/navigation/AppNavigator";
import { useArticleById, useHideArticle } from '@shared/services/api/hooks';
import RenderHTML from 'react-native-render-html';

export default function ArticleScreen({ navigation, route }: { navigation: ArticleScreenNavigationProp, route: ArticleScreenRouteProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();
    const { width } = useWindowDimensions();

    const { id } = route.params;
    const articleId = Number(id);
    
    const { data: article, isLoading, error, isFetching } = useArticleById(articleId);
    const hideArticleMutation = useHideArticle();
    const hasCalledHideRef = React.useRef(false);

    // Вызываем hideArticle при каждом попадании на экран (только один раз)
    useFocusEffect(
        React.useCallback(() => {
            if (articleId && !isNaN(articleId) && !hasCalledHideRef.current) {
                hasCalledHideRef.current = true;
                console.log('📰 [ArticleScreen] Вызываем hideArticle для ID:', articleId);
                hideArticleMutation.mutate(articleId, {
                    onSuccess: () => {
                        console.log('📰 [ArticleScreen] ✅ Статья успешно скрыта');
                    },
                    onError: (error) => {
                        console.error('📰 [ArticleScreen] ❌ Ошибка при скрытии статьи:', error);
                    },
                });
            }
            
            // Сбрасываем флаг при размонтировании (когда уходим с экрана)
            return () => {
                hasCalledHideRef.current = false;
            };
        }, [articleId]) // Убрали hideArticleMutation из зависимостей
    );

    useEffect(() => {
        if (article) {
            console.log('📰 [ArticleScreen] ✅ Статья загружена:', {
                id: article.id,
                title: article.title,
            });
        }
    }, [article]);

    const onBack = () => navigation.goBack();

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
                        {t('main.additionalTasks.article.title')}
                    </Text>
                </>
            }>
                <View style={[styles.center, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" />
                    <Text style={[theme.fonts.regular, { marginTop: 16 }]}>Загрузка статьи...</Text>
                </View>
            </PageWithHeader>
        );
    }

    if (error || !article) {
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
                        {t('main.additionalTasks.article.title')}
                    </Text>
                </>
            }>
                <View style={styles.center}>
                    <Text style={theme.fonts.subheader}>
                        {error ? 'Ошибка загрузки статьи' : 'Статья не найдена'}
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
                    {t('main.additionalTasks.article.title')}
                </Text>
            </>
        }>
            <ScrollView 
                style={styles.mainContainer} 
                contentContainerStyle={{ flex: 1, paddingBottom: 24, marginTop: 10 }}
            >
                <View style={[theme.flexBlocks.vertical8, { flex: 1, paddingBottom: 24 }]}>
                    {/* Изображение в самом верху, если есть файлы */}
                    {article.files && article.files.length > 0 && article.files[0]?.fileUrl && (
                        <Image
                            source={{ uri: article.files[0].fileUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    )}
                    
                    {/* Заголовок */}
                    <Text style={[theme.fonts.title]}>{article.title}</Text>
                    
                    {/* HTML контент */}
                    {article.text && (
                        <RenderHTML
                            contentWidth={width - 48}
                            source={{ html: article.text }}
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
});
