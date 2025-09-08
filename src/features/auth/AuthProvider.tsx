import React, { useState, ReactNode } from 'react';
import { AuthContext } from '@app/hooks/auth.hook'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);

    const login = (username: string, password: string) => {
        if (username && password) {
            setIsAuthenticated(true);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
