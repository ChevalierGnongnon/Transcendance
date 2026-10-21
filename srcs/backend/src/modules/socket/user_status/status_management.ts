import friendshipsServices from "@/modules/social/friendships.services.js";
import { Socket } from "socket.io"
import { getIo } from "../socket-register.ts";

const userList = new Map<string, number>();

// Used for when friendship is just accepted to update both users online status.
export function checkNewFriendOnlineStatus(userAId: string, userBId: string){
    const io = getIo();

    if (!io)
        return ;
    const connected = showConnectedUsers();
    if (connected.includes(userAId)){
        io.to(`user-${userBId}`).emit('user-online', {userId: userAId});
    }
    if (connected.includes(userBId)){
        io.to(`user-${userAId}`).emit('user-online', {userId: userBId});
    }

}

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

// called when user just connected
export async function announceOnline(userId: string, socket: Socket){
    const register = await friendshipsServices.getFriendsRegister(userId);
    // gets all friends (other user)
    const friends = register.map(f => f.userId === userId ? f.friendId : f.userId);
    // get connected users 
    const connected = showConnectedUsers();
    // filters only the ones that are connected
    const onlineFriends = friends.filter(friendId => connected.includes(friendId));
    // builds the room 
    const rooms = onlineFriends.map(id => `user-${id}`)

    // emits to the rooms that the user is online 
    socket.to(rooms).emit('user-online', { userId })
}

//same as online but fot disconnected 
export async function announceOffline(userId: string, socket: Socket){
    const register = await friendshipsServices.getFriendsRegister(userId);
    const friends = register.map(f => f.userId === userId ? f.friendId : f.userId);
    const connected = showConnectedUsers();

    const onlineFriends = friends.filter(friendId => connected.includes(friendId));
    const rooms = onlineFriends.map(id => `user-${id}`)

    socket.to(rooms).emit('user-offline', { userId })
}

// export async function filterAndEmit(userId: string, socket: Socket){
//     const friends = await friendshipsServices.getFriendsId(userId);
//     const connected = showConnectedUsers();

//     const onlineFriends = friends.filter(friendId => connected.includes(friendId));
//     socket.emit('online-friends', { onlineFriends })
// }

// gives to the user the list of connected friends
export async function filterAndEmit(userId: string, socket: Socket){
    const register = await friendshipsServices.getFriendsRegister(userId);
    const friends = register.map(f => f.userId === userId ? f.friendId : f.userId);
    const connected = showConnectedUsers();

    const onlineFriends = friends.filter(friendId => connected.includes(friendId));
    socket.emit('online-friends', { onlineFriends })
}