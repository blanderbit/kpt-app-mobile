import React from "react";
import { Pressable, StyleSheet, Animated } from "react-native";
import { PlusIcon } from "@assets/icons/PlusIcon";
import CheckMarkIcon from "@assets/icons/CheckMarkIcon";

export const AddButton = ({ onPress, done }: { onPress?: () => void, done?: boolean }) => {
    const scale = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.9,
            useNativeDriver: true,
            speed: 50,
            bounciness: 0,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
            bounciness: 5,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: pressed ? "#f8f6f4" : "transparent" },
                ]}
            >
                {done ? <CheckMarkIcon /> : <PlusIcon />}
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: "#F1ECE6",
        alignItems: "center",
        justifyContent: "center",
    },
});
