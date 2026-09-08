import "../../scss/common-classes.scss"
import { useTranslation } from 'react-i18next';

function SearchBar(){
    return(
        <>
            <input type="search" name="search-user" id="search-user" />
            <div className="search-results">

            </div>
        </>
    )
}