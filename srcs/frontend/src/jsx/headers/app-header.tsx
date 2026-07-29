import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import HeaderOffline from './header-offline';
import HeaderOnline from './header-online';

function AppHeader(){
    const [isAuthenticated, setIsAuthenticated] = useState<true | false | null>(null);
    const location = useLocation();
    useEffect(() => {
        fetch('/api/check-auth', {
            credentials: 'include',
        })
        .then(res => setIsAuthenticated(res.ok))
        .catch(() => setIsAuthenticated(false));
    }, [location.pathname]);
    if (isAuthenticated == null)
        return (null); // in case it takes time to check authentfication, displays nothing(no flash)
    else if (isAuthenticated)
        return <HeaderOnline/>
    else
        return <HeaderOffline/>
}
export default AppHeader;