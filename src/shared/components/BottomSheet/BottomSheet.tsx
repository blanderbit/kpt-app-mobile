import React, { useRef, useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Pressable,
    ScrollView,
    Easing,
} from 'react-native';
import { useCustomTheme } from "@app/theme/ThemeContext";
import { CloseIcon } from "@assets/icons/CloseIcon";
import { ArrowIcon } from "@assets/icons/ArrowIcon";

const { height } = Dimensions.get('window');

type BottomSheetProps = {
    visible: boolean;
    onClose: () => void;
    onBack?: () => void;
    title: string;
    button: React.ReactNode;
    closeBtn?: boolean;
    backBtn?: boolean;
    children?: React.ReactNode;
};

export default function BottomSheet({
                                        visible,
                                        onClose,
                                        onBack,
                                        title,
                                        button,
                                        closeBtn = true,
                                        backBtn,
                                        children
                                    }: BottomSheetProps) {
    const [ showModal, setShowModal ] = useState(visible);
    const translateY = useRef(new Animated.Value(height)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const { theme } = useCustomTheme();

    useEffect(() => {
        if ( visible ) {
            setShowModal(true);
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 250,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: height,
                    duration: 350,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
            ]).start(({ finished }) => {
                if ( finished ) {
                    setShowModal(false);
                }
            });
        }
    }, [ visible ]);

    if ( !showModal ) return null;

    return (
        <Modal
            transparent
            visible={ showModal }
            animationType="none"
            onRequestClose={ onClose }
        >
            <Animated.View style={ [ styles.overlay, { opacity } ] }>
                <Pressable style={ StyleSheet.absoluteFill } onPress={ onClose }/>
            </Animated.View>

            <Animated.View
                style={ [
                    styles.sheet,
                    { transform: [ { translateY } ] },
                ] }
            >
                <View style={ [ styles.header, theme.flexBlocks.justifyCenter, theme.flexBlocks.alignCenter ] }>
                    <Text style={ theme.fonts.subtitle }>{ title }</Text>

                    { closeBtn &&
                        <Pressable
                            onPress={ onClose }
                            style={ ({ pressed }) => [
                                { ...theme.buttons.smallBtn },
                                styles.closeBtn,
                                pressed && { opacity: 0.6 },
                            ] }>
                            <CloseIcon/>
                        </Pressable>
                    }

                    { backBtn &&
                        <Pressable
                            onPress={ onBack }
                            style={ ({ pressed }) => [
                                { ...theme.buttons.smallBtn },
                                styles.backBtn,
                                pressed && { opacity: 0.6 },
                            ] }>
                            <ArrowIcon/>
                        </Pressable>
                    }
                </View>

                <ScrollView
                    style={ styles.content }
                    contentContainerStyle={ { paddingBottom: 10 } }
                    showsVerticalScrollIndicator={ false }
                >
                    { children }
                </ScrollView>

                <View style={ styles.footer }>
                    { button }
                </View>
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        height: height - height / 12,
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        flex: 1,
    },
    header: {
        height: 32,
        marginBottom: 12,
    },
    closeBtn: {
        backgroundColor: '#F5F6F9',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    backBtn: {
        backgroundColor: '#F5F6F9',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    content: {
        flex: 1,
    },
    footer: {
        flexShrink: 0,
        minHeight: 70,
        justifyContent: 'center',
    },
});
