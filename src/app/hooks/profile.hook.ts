import { createContext, useContext } from 'react';
import { ProfileResponse } from '@shared/services/api';

export interface ProfileContextType {
  profile: ProfileResponse | null;
  isLoading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (profile: ProfileResponse) => void;
  clearProfile: () => void;
}

export const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};