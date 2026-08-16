import { useAuth } from "./auth-context";


// if a user stays connected and the session cookie expires (here 24h)
// silently, and a component calls an auth required route like /my-profile,
// the server will respond error 401, but nothing in the app catches it.
// this hook will do the fetch with one more thing: check if server responds 401
// or 403, and update the context for dead session. 

export function useApiFetch(){
    const {markDisconnected} = useAuth();

    const checkServerAnswer = async(url: string, options ?: RequestInit) =>{
        const answer = await fetch(url, options);
        if (answer.status === 401 || answer.status === 403)
            markDisconnected();
        return (answer);
    }
    return (checkServerAnswer);
}