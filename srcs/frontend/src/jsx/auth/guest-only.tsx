import { useAuth } from './auth-context'
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

export function GuestOnly({children}: {children:ReactNode}){
    const {isAuthenticated} = useAuth();

    if (isAuthenticated === null)
        return (null)
    else if (isAuthenticated === true){
        return (<Navigate to="/personalpage" replace />)
    }
    else if (isAuthenticated === false){
        return (children);
    }
}