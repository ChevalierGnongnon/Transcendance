import { useTranslation } from "react-i18next"
import i18n from "../../../localisation/i18n";
import FileImport from "../files/file-import";
function SendFile(){
    const {t} = useTranslation();
    return (
        <>
            <h1>{t('common.send-a-file')}</h1>
            <FileImport
                mode="message"
                
            />
        </>
    )
}