import { createContext, useContext, useState, useEffect, ReactNode} from "react";
import { createAiConversation } from "../ai/utils/api";

import { socket } from "../messages/socket";

// Shape of the info shared everywhere in the app (via AuthProvider):
// whether or not the user is connected,
// and functions to change its status and check if it changed
type AuthContextType = {
    isAuthenticated: true | false | null;
    login: () => void;
    markDisconnected: () => void;
    // both refresh and logout returns a promise that once solved,
    // doesn't return anything usefull
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
    const [conversationId, setAiConversationId] = useState<string | null>(null);
    const [onlineFriends, setOnlineFriends] = useState<string[]>([]);
    //simple function to avoid code repetition, checks/fetches the current connection status
    const checkAuth = async() => {
        //calls check-auth route to know if the token cookie is still valid
        await fetch('/api/check-auth',{
                credentials: 'include'
        })
        .then(res => res.json())
        .then(data => setIsAuthenticated(data.authenticated === true))
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

    // To handle logout in all tabs if one logged out 
    useEffect(() => {
        function listenToStorage(event: StorageEvent){
            if (event.key === 'auth-sync')
                refresh();
        }
        window.addEventListener('storage', listenToStorage)
        return () => window.removeEventListener('storage', listenToStorage);
    }, [])

    useEffect(() => {
        // receives online friends sent by filter and emit
        function handleOnlineFriends(data: {onlineFriends: string[]}){
            // onceper connexion, replaces the whole list
            setOnlineFriends(data.onlineFriends);
        }
        // receives user online event sent by announce online
        function handleUserOnline(data: {userId: string}){
            // each time a friend passes from offline to online
            setOnlineFriends(prev => {
                if (prev.includes(data.userId))
                    return (prev);
                // copies prev and adds userid at the end 
                // (react detects changes by checking if its the same
                // object as before ...prev means copy the current object)
                return [...prev, data.userId];
            });
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

    async function login(){
        const conversationId = await createAiConversation();
        localStorage.setItem('aiConversationId', conversationId);
        localStorage.setItem('auth-sync', Date.now().toString());
        setIsAuthenticated(true);
        setAiConversationId(conversationId);
    }

    // When user disconnects himself volontarily (clicks on logout)
    const logout = async() => {
        try{
            await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err){
            console.error('logout error : ', err);
        } finally { // finally will execute anyway even if catch is not reached
            // signal for other tabs that a change occurs in auth so it updates
            // everywhere. 
            localStorage.setItem('auth-sync', Date.now().toString());
            setIsAuthenticated(false);
            // Mknoll: ai cleaning conversation is put there so even though server
            // request fails, cleaning is still done. please recheck
            sessionStorage.removeItem('aiConversationId');
            setAiConversationId(null);
        }
    }
    // When user fetch api receives a 401, like invalid cookie, expired cookie...
    function markDisconnected(){
        setIsAuthenticated(false);
        localStorage.setItem('auth-sync', Date.now().toString());
    }

    const refresh = async() => {
        await checkAuth();
    }

    return (
        //returns value + useful functions
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
