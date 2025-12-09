import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import SubscriptionOfferingTemplate from './SubscriptionOfferingTemplate';
import { getResponsiveHorizontalPadding, getResponsiveTopPadding } from '@shared/utils/screenUtils';

interface SubscriptionOfferingContextType {
    showSubscriptionOffering: (onComplete?: () => void) => void;
    hideSubscriptionOffering: () => void;
    isVisible: boolean;
}

const SubscriptionOfferingContext = createContext<SubscriptionOfferingContextType | undefined>(undefined);

export const useSubscriptionOffering = () => {
    const context = useContext(SubscriptionOfferingContext);
    if (!context) {
        throw new Error('useSubscriptionOffering must be used within SubscriptionOfferingProvider');
    }
    return context;
};

interface SubscriptionOfferingProviderProps {
    children: ReactNode;
}

export const SubscriptionOfferingProvider: React.FC<SubscriptionOfferingProviderProps> = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [onCompleteCallback, setOnCompleteCallback] = useState<(() => void) | undefined>(undefined);
    const horizontalPadding = getResponsiveHorizontalPadding(14);
    const topPadding = getResponsiveTopPadding(60);

    const showSubscriptionOffering = (onComplete?: () => void) => {
        setIsVisible(true);
        if (onComplete) {
            setOnCompleteCallback(() => onComplete);
        }
    };

    const hideSubscriptionOffering = () => {
        setIsVisible(false);
        if (onCompleteCallback) {
            onCompleteCallback();
            setOnCompleteCallback(undefined);
        }
    };

    // Создаем фиктивный navigation объект для SubscriptionOfferingTemplate
    const mockNavigation = {
        goBack: hideSubscriptionOffering,
        navigate: () => {},
        reset: () => {},
        dispatch: () => {},
        setParams: () => {},
        addListener: () => () => {},
        removeListener: () => {},
        canGoBack: () => false,
        isFocused: () => true,
        push: () => {},
        replace: () => {},
        pop: () => {},
        popToTop: () => {},
        setOptions: () => {},
        getId: () => undefined,
        getParent: () => undefined,
        getState: () => ({
            key: '',
            index: 0,
            routeNames: [],
            routes: [],
            type: '',
            stale: false,
        }),
    };

    return (
        <SubscriptionOfferingContext.Provider value={{ showSubscriptionOffering, hideSubscriptionOffering, isVisible }}>
            {children}
            
            {/* Рендерим SubscriptionOfferingTemplate поверх всего */}
            {isVisible && (
                <View style={[styles.overlay, { paddingHorizontal: horizontalPadding, paddingTop: topPadding }]}>
                    <SubscriptionOfferingTemplate 
                        navigation={mockNavigation}
                        onComplete={hideSubscriptionOffering}
                    />
                </View>
            )}
        </SubscriptionOfferingContext.Provider>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        // paddingTop будет добавлен динамически через inline стили
    },
});

