import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

const PageWithHeader: React.FC<{ headerContent: ReactNode, children: ReactNode}> = ({ headerContent, children }) => {
    return (
        <View style={ styles.page }>
            <View style={ styles.pageHeader }>
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
        gap: 16,
        height: '100%',
    },
    pageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        height: 32,
    },
});
