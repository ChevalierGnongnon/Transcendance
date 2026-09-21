import { apiFetch } from "./apiFetch";
import { useAuth } from "../auth/auth-context";
import { useEffect, useState } from "react";
import type {Friendship} from './my-friends'

export function useFriendships(){
    const {logout, onlineFriends} = useAuth();
    const [friendships, setFriendships] = useState<Friendship[]> ([]);

    useEffect(() =>{
        apiFetch<Friendship[]>('/api/friendships', {}, logout).then((data) => setFriendships(data));
    }, [])

    function getStatus(userId: string){
        const isFriend = friendships.some(
            (f) => f.status === 'accepted' && (f.user.id === userId || f.friend.id === userId)
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