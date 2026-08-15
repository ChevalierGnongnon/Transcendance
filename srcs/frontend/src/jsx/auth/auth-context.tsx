import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: true | false | null;
    login: () => void;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
};

const context = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}:{children:ReactNode}){
    const [isAuthenticated, setIsAuthenticated] = useState<true | false | null>(null)
    
    const checkAuth = async() => {
        await fetch('/api/check-auth',{
                credentials: 'include'
        })
        .then(res => setIsAuthenticated(res.ok))
        .catch(() => setIsAuthenticated(false));

    }
    useEffect(() => {
        checkAuth();        
    }, []);

    function login(){
        setIsAuthenticated(true);
    }

    const logout = async() => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setIsAuthenticated(false);
    }

    const refresh = async() => {
        await checkAuth();
    }

    
    return (
        <context.Provider value={{ isAuthenticated, login, logout, refresh }}>
            {children}
        </context.Provider>
    )
}

export function useAuth(){
    const ctx = useContext(context);

    if (ctx === undefined)
        throw new Error("useAuth fail");
    return (ctx);
}
