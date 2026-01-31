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
                await initializeI18n();
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
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

    if (error) {
        // продолжаем рендер приложения
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


