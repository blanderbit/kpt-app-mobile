import React, { createContext, useState, useContext, useCallback } from "react";

type ScrollBlockerContextType = {
    scrollEnabled: boolean;
    blockScroll: () => void;
    allowScroll: () => void;
};

const ScrollBlockerContext = createContext<ScrollBlockerContextType | null>(null);

export function ScrollBlockerProvider({ children }: { children: React.ReactNode }) {
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const blockScroll = useCallback(() => setScrollEnabled(false), []);
    const allowScroll = useCallback(() => setScrollEnabled(true), []);

    return (
        <ScrollBlockerContext.Provider value={{ scrollEnabled, blockScroll, allowScroll }}>
            {children}
        </ScrollBlockerContext.Provider>
    );
}

export function useScrollBlocker() {
    const ctx = useContext(ScrollBlockerContext);
    if (!ctx) {
        throw new Error("useScrollBlocker must be used within a ScrollBlockerProvider");
    }
    return ctx;
}
