import { createContext, useContext } from "react";
import { MoodTrackerResponse } from '@shared/services/api/types';

interface CurrentMoodContextType {
    currentMood: MoodTrackerResponse | null;
    isLoading: boolean;
    hasMoodForToday: boolean;
    refreshCurrentMood: () => Promise<void>;
    clearCurrentMood: () => void;
}

export const CurrentMoodContext = createContext<CurrentMoodContextType | undefined>(undefined);

export const useCurrentMoodContext = () => {
    const context = useContext(CurrentMoodContext);
    if (!context) {
        throw new Error('useCurrentMoodContext must be used within CurrentMoodProvider');
    }
    return context;
};
