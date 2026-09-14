import { useTranslation } from "react-i18next";

function MyStats(){
    const {t} = useTranslation();
    
    return (
        <h1>{t('common.my-stats')}</h1>
    )
}
export default MyStats;