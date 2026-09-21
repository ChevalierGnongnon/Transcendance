import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { socket } from "../messages/socket";
// Shape of the info shared everywhere in the app (via AuthProvider):
// whether or not the user is connected,
// and functions to change its status and check if it changed
type AuthContextType = {
    isAuthenticated: true | false | null;
    login: () => void;
    markDisconnected: () => void;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    onlineFriends: string[];
};

const context = createContext<AuthContextType | undefined>(undefined);

// Auth provider : delivers connection status (is authenticated)
// and the functions to change the status (login / logout / markdisconnected, refresh)
// info everywhere inside its tags
export function AuthProvider({children}:{children:ReactNode}){
    const [isAuthenticated, setIsAuthenticated] = useState<true | false | null>(null)
    const [onlineFriends, setOnlineFriends] = useState<string[]>([]);
    //simple function to avoid code repetition, checks/fetches the current connection status
    const checkAuth = async() => {
        //calls check-auth route to know if the token cookie is still valid
        await fetch('/api/check-auth',{
                credentials: 'include'
        })
        .then(res => setIsAuthenticated(res.ok))
        .catch(() => setIsAuthenticated(false));
    }

    // useEffect: used to trigger checkauth() one time, when the app is starting.
    // [] at the end is for "trigger it once, never restarted after"
    useEffect(() => {
        checkAuth();        
    }, []);

    useEffect(() => {
        if (isAuthenticated === true)
            socket.connect();
        else{
            setOnlineFriends([]);
            socket.disconnect()
        }
    }, [isAuthenticated])

    useEffect(() => {
        window.addEventListener('storage', refresh)
        return () => window.removeEventListener('storage', refresh);
    }, [])

    useEffect(() => {
        function handleOnlineFriends(data: {onlineFriends: string[]}){
            setOnlineFriends(data.onlineFriends);
        }
        function handleUserOnline(data: {userId: string}){
            setOnlineFriends(prev => [...prev, data.userId]);
        }

        function handleUserOffline(data: {userId: string}){
            setOnlineFriends(prev => prev.filter(id => id !== data.userId));
        }
        socket.on('online-friends', handleOnlineFriends);
        socket.on('user-online', handleUserOnline);
        socket.on('user-offline', handleUserOffline);
        return () => {
            socket.off('online-friends', handleOnlineFriends);
            socket.off('user-online', handleUserOnline);
            socket.off('user-offline', handleUserOffline);
        }; 
    }, [])
    function login(){
        localStorage.setItem('auth-sync', Date.now().toString());
        setIsAuthenticated(true);
    }

    // When user disconnects himself volontarly (clicks on logout)
    const logout = async() => {
        await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        localStorage.setItem('auth-sync', Date.now().toString());
        setIsAuthenticated(false);
    }
    // When user fetch api receives a 401 or 403, like invalid cookie, expired cookie...
    function markDisconnected(){
        setIsAuthenticated(false);
        localStorage.setItem('auth-sync', Date.now().toString());
    }

    const refresh = async() => {
        await checkAuth();
    }

    return (
        //returns value + usefull functions
        <context.Provider value={{ isAuthenticated, login, logout, markDisconnected, refresh, onlineFriends }}>
            {children}
        </context.Provider>
    )
}

// useAuth: entry point every other component uses to read and act on the auth state
// (isAuthenticated, login, logout, markdisconnected, refresh) without touching useContext directly,
// it throws if called outside AuthProvider, so if it's missing, the  provider fails loudly
// instead of silently breaking somewhere else.
export function useAuth(){
    const ctx = useContext(context);

    if (ctx === undefined)
        throw new Error("useAuth fail");
    return (ctx);
}
