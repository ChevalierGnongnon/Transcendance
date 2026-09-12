import { useAuth } from './auth-context'
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

export function RequireAuth({children}: {children:ReactNode}){
    const {isAuthenticated} = useAuth(); 

    // waiting
    if (isAuthenticated === null)
        return (null);
    // if connected, return the page asked
    else if (isAuthenticated === true){
        return children;
    }
    // else redirect to login
    else {
        return <Navigate to="/login" replace />
    }
}
