import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { pinkTheme, greenTheme, Theme } from "./index";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeName = "Pink" | "Green";

interface ThemeContextProps {
    theme: Theme;
    themeName: ThemeName;
    setThemeByName: (name: ThemeName) => void;
    isReady: boolean;
}

const ThemeContext = createContext<ThemeContextProps>({
    theme: pinkTheme,
    themeName: "Pink",
    setThemeByName: () => {},
    isReady: false,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [themeName, setThemeName] = useState<ThemeName>("Pink");
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        (async () => {
            const savedTheme = (await AsyncStorage.getItem("appTheme")) as ThemeName | null;
            if (savedTheme === "Green" || savedTheme === "Pink") {
                setThemeName(savedTheme);
            }
            setIsReady(true);
        })();
    }, []);

    const setThemeByName = async (name: ThemeName) => {
        setThemeName(name);
        await AsyncStorage.setItem("appTheme", name);
    };

    const theme = themeName === "Pink" ? pinkTheme : greenTheme;

    return (
        <ThemeContext.Provider value={{ theme, themeName, setThemeByName, isReady }}>
            {isReady ? children : null}
        </ThemeContext.Provider>
    );
};

export const useCustomTheme = () => useContext(ThemeContext);
