import { apiFetch } from "./apiFetch";
import { useAuth } from "../auth/auth-context";
import { useEffect, useState } from "react";
import type {Friend} from './types'

export function useFriendships(){
    const {logout, onlineFriends} = useAuth();
    const [friendships, setFriendships] = useState<Friend[]> ([]);

    useEffect(() =>{
        apiFetch<Friend[]>('/api/social/friends', {}, logout)
        .then((data) => setFriendships(data))
        .catch((err) => console.error("CALL FAILED", err));
    }, [])

    function getStatus(userId: string){
        const isFriend = friendships.some(
            (f) => (f.friend.id === userId)
        );
        if (!isFriend)
            return ('not-friend')
        else{
            if (onlineFriends.includes(userId))
                return ('online');
            else
                return ('offline');    
        }

    }
    return {getStatus};
}