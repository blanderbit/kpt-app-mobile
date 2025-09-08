import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ToastType = "success" | "error" | "warning" | "info";

type ToastOptions = {
    message: string;
    type?: ToastType;
    duration?: number; // ms
};

type ToastContextType = {
    showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if ( !ctx ) throw new Error("useToast must be used within ToastProvider");
    return ctx;
};

const ICONS: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
    success: "checkmark-circle",
    error: "warning",
    warning: "alert-circle",
    info: '',
};

const COLORS: Record<ToastType, string> = {
    success: "#4CAF50",
    error: "#E53935",
    warning: "#FF9800",
    info: "#000",
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [ toast, setToast ] = useState<ToastOptions | null>(null);
    const [ toastShown, setToastShown ] = useState<boolean>(false);
    const translateY = useRef(new Animated.Value(-120)).current;

    const showToast = (options: ToastOptions) => {
        setToast(options);
    };

    const hideToast = () => {
        Animated.timing(translateY, {
            toValue: -120,
            duration: 300,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if ( finished ) {
                setToast(null);
                setToastShown(false);
            }
        });
    };

    useEffect(() => {
        if ( toast && !toastShown ) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
            }).start();
            setToastShown(true)

            setTimeout(() => {
                hideToast();
            }, 3000);
        }
    }, [ toast ]);

    return (
        <ToastContext.Provider value={ { showToast } }>
            { children }
            { toast && (
                <Animated.View
                    style={ [
                        styles.container,
                        {
                            transform: [ { translateY } ],
                            backgroundColor: COLORS[toast.type ?? "info"],
                        },
                    ] }
                >
                    { toast.type !== 'info' ? <Ionicons
                        name={ ICONS[toast.type ?? "info"] }
                        size={ 20 }
                        color="white"
                        style={ styles.icon }
                    /> : null }

                    <Text style={ styles.text }>{ toast.message }</Text>
                </Animated.View>
            ) }
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 50,
        left: 16,
        right: 16,
        padding: 14,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 1000,
        elevation: 5,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        color: "white",
        fontSize: 14,
        fontWeight: "500",
        flexShrink: 1,
    },
});
