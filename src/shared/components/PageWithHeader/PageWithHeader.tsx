import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { getResponsiveGap, isSmallScreen } from "@shared/utils/screenUtils";

const PageWithHeader: React.FC<{ headerContent: ReactNode, noStylingHeader?: boolean, children: ReactNode}> = ({ headerContent, noStylingHeader, children }) => {
    const isSmall = isSmallScreen();
    const gap = isSmall ? getResponsiveGap(16) : 16; // Для средних/больших экранов - оригинальное значение 16
    
    return (
        <View style={ [styles.page, { gap }] }>
            <View style={ !noStylingHeader && styles.pageHeader }>
                {headerContent}
            </View>

            {children}
        </View>
    );
};

export default PageWithHeader;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        // gap будет добавлен динамически через inline стили
    },
    pageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 32,
    },
});
