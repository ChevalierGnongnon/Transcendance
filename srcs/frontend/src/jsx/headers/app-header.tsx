import HeaderOffline from './header-offline';
import HeaderOnline from './header-online';
import {useAuth} from '../auth/auth-context';

function AppHeader(){
    const {isAuthenticated} = useAuth();
    
    if (isAuthenticated == null)
        return (null); // in case it takes time to check authentfication, displays nothing(no flash)
    else if (isAuthenticated)
        return <HeaderOnline/>
    else
        return <HeaderOffline/>
}
export default AppHeader;