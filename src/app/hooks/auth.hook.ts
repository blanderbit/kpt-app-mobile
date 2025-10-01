import { createContext, useContext, useState, useEffect } from "react";
import { useLogin, useLogout, useCurrentUser, apiUtils } from '@shared/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithFirebase: (idToken: string) => Promise<void>;
    registerWithFirebase: (
        idToken: string, 
        onboardingData: {
            age?: string;
            feelingToday?: string;
            socialNetworks?: string[];
            onboardingQuestionAndAnswers?: Record<string, string>;
            activities?: Array<{ activityName: string; content?: string }>;
            taskTrackingMethod?: string;
        }
    ) => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
    isFirebaseUser: boolean;
    isEmailVerified: boolean;
    setEmailVerified: (isVerified: boolean) => Promise<void>;
    getEmailVerified: () => Promise<boolean>;
    updateEmailVerifiedState: (isVerified: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
