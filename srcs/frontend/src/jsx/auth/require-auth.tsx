import { useAuth } from './auth-context'
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

export function RequireAuth({children}: {children:ReactNode}){
    const {isAuthenticated} = useAuth();

    if (isAuthenticated === null)
        return (null)
    else if (isAuthenticated === false){
        return <Navigate to="/login" replace />
    }
    else if (isAuthenticated === true){
        return children;
    }
}
