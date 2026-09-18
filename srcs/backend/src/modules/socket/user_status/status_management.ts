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