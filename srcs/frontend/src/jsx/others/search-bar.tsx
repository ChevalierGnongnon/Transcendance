import "../../scss/common-classes.scss"
import "../../scss/common-variables.scss";
import "../../scss/headers.scss";
import { useState , useEffect} from "react";
import { useApiFetch } from "../auth/use-api-fetch";
import { useTranslation } from 'react-i18next';

interface SearchResult{
    id: string;
    firstName: string;
	lastName: string;
	pseudo: string;
	profilePhoto: {
		id: string;
		name: string;
	};
}

interface SearchBarProps {
    ClassName: string, 
    ListClassName: string, 
    BreakPoint : number
    onSelectUser: (result: SearchResult) => void;
}

function SearchBar(props: SearchBarProps){
    const [input, setInput] = useState<string>("");
    const [result, setResult] = useState<SearchResult[] | null>(null)
    const [researchStarted, setResearchStarted] = useState<boolean>(false);
    const apiFetch = useApiFetch();

    useEffect(() => {
        async function search() {
            try {
                const res = await apiFetch("/api/users/search?q=" + encodeURIComponent(input), { credentials: "include" });
                if (!res.ok) {
                    setResult(null);
                    return;
                }
                const data = await res.json();
                setResult(data);
            } catch {
                setResult(null);
            }
        }
        let timeout = setTimeout(search, 300);
        function timeManager(){
            clearTimeout(timeout);
        }
        return(timeManager);
    
    }, [input]);
    
    
    return(
        <>
            <div className="search position-relative">
                <input 
                    type="search"
                    name="search-bar"
                    id="search-bar"
                    className={props.ClassName}
                    value={input}
                    placeholder="Search a user ..."
                    onChange={
                        function startResearch(event){
                            setResearchStarted(true);
                            setInput(event.target.value);
                        }
                    }
                />
                <ul className={`${props.ListClassName} position-absolute top-100 w-100 z-3`}>
                {   result === null ? null : result.length === 0 ? (
                    <li className="search-no-result">Aucun profil avec ce nom, pseudo ou prénom</li>
                    ) : (
                        result.map((user)=>
                            <li className="d-flex align-items-center justify-content-center gap-5 px-3" key={user.id} onClick={(()=> props.onSelectUser(user))}>
                                <figure>
                                    <img
                                        src={user.profilePhoto?.id ? `/api/${user.profilePhoto.id}/download` : '/default-avatar.png'}
                                        alt="avatar"
                                    />
                                </figure>
                                <span className="d-flex">
                                    {
                                        [user.lastName, user.firstName, user.pseudo].map((field, index) => {
                                            const len = input.length;
                                            const boldPart = field.slice(0, len);
                                            const end = field.slice(len, field.length)
                                            return (
                                                    <span key={index}>
                                                        {index > 0 && <span className="mx-4"> | </span>}
                                                        {boldPart.toLowerCase() === input.toLowerCase() &&
                                                            <>
                                                                <span>
                                                                    <strong>{boldPart}</strong>
                                                                </span>
                                                                <span>
                                                                    {end}
                                                                </span>
                                                            </>
                                                        }
                                                        { boldPart !== input &&
                                                            <span>{field}</span>
                                                        }
                                                        
                                                    </span>
                                                )
                                            }   
                                        )
                                    }
                                </span>
                            </li>
                        )
                    )
                }
                    
                </ul>
                
            </div>
            
        </>
    )
}
export default SearchBar;