import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCustomTheme } from "@app/theme/ThemeContext";
import { ArrowIcon } from "@assets/icons/ArrowIcon";
import PageWithHeader from "@shared/components/PageWithHeader/PageWithHeader";
import { ArticleScreenNavigationProp, ArticleScreenRouteProp } from "@app/navigation/AppNavigator";
import { testArticles } from "./const";

export default function ArticleScreen({ navigation, route }: { navigation: ArticleScreenNavigationProp, route: ArticleScreenRouteProp }) {
    const { t } = useTranslation();
    const { theme } = useCustomTheme();

    const { id } = route.params;
    const article = testArticles.find(a => a.id === +id);

    if (!article) {
        return (
            <PageWithHeader headerContent={<Text>{t('main.additionalTasks.article.title')}</Text>}>
                <View style={styles.center}>
                    <Text>Article not found</Text>
                </View>
            </PageWithHeader>
        );
    }

    const onBack = () => navigation.goBack();

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
            <ScrollView style={styles.mainContainer} contentContainerStyle={{ paddingBottom: 24 }}>
                <View style={[theme.flexBlocks.vertical8, { paddingBottom: 24 }]}>
                    <Image
                        source={{ uri: article.image }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <Text style={[theme.fonts.title]}>{article.title}</Text>
                    <Text style={[theme.fonts.subtitle, { textAlign: 'left'}]}>{article.description}</Text>
                </View>

                <View style={theme.flexBlocks.vertical16}>
                    {article.data.map((item, index) => (
                        <View key={index} style={theme.flexBlocks.vertical8}>
                            <Text style={[theme.fonts.subheader]}>{item.title}</Text>
                            <Text style={[theme.fonts.articleText]}>{item.description}</Text>
                        </View>
                    ))}
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
});
