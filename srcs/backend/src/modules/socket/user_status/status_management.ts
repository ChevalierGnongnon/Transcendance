import friendshipsServices from "@/modules/friendships/friendships.services.js";
import {Socket} from "socket.io"

const userList = new Map<string, number>();

export function connectUser(userId: string){
    let nbConnections = userList.get(userId);

    if (nbConnections === undefined){
        userList.set(userId, 1);
        return (true);
    }
        
    else {
        nbConnections++;
        userList.set(userId, nbConnections);
        return (false);
    }
}

export function disconnectUser(userId: string){
    let nbConnections = userList.get(userId);

    if (nbConnections === undefined)
        nbConnections = 1;
    nbConnections--;
    userList.set(userId, nbConnections);
    if (nbConnections < 1){
        userList.delete(userId);
        return (true);
    }
    return (false);

}

export function showConnectedUsers(){
    return (Array.from(userList.keys()));
}

export async function announceOnline(userId: string, socket: Socket){
    const friends = await friendshipsServices.getFriendsId(userId);
    const rooms = friends.map(id => `user-${id}`)

    socket.to(rooms).emit('user-online', { userId })
}

export async function announceOffline(userId: string, socket: Socket){
    const friends = await friendshipsServices.getFriendsId(userId);
    const rooms = friends.map(id => `user-${id}`)

    socket.to(rooms).emit('user-offline', { userId })
}

export async function filterAndEmit(userId: string, socket: Socket){
    const friends = await friendshipsServices.getFriendsId(userId);
    const connected = showConnectedUsers();

    const onlineFriends = friends.filter(friendId => connected.includes(friendId));
    socket.emit('online-friends', { onlineFriends })
}