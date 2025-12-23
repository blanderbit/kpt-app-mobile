import React, { useState, useEffect, ReactNode } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initializeI18n } from '../../locales';

interface TranslationsProviderProps {
    children: ReactNode;
}

export const TranslationsProvider: React.FC<TranslationsProviderProps> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                console.log('🌐 [TranslationsProvider] Starting translations loading...');
                await initializeI18n();
                console.log('🌐 [TranslationsProvider] Translations loaded successfully');
                setIsLoading(false);
            } catch (err) {
                console.error('🌐 [TranslationsProvider] Failed to load translations:', err);
                setError(err instanceof Error ? err : new Error('Unknown error'));
                // Даже при ошибке продолжаем работу, чтобы приложение не зависло
                setIsLoading(false);
            }
        };

        loadTranslations();
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // Если есть ошибка, всё равно рендерим приложение, но с предупреждением
    if (error) {
        console.warn('🌐 [TranslationsProvider] Continuing with error:', error.message);
    }

    return <>{children}</>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

