import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

function FileImport(){
    const {t} = useTranslation();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    return (
        <div className="file_component">
            <input
                type="file"
                name="file_input" 
                id="file_input"
                className="upload_file"
                onChange={
                    (e)=>{
                        const file = e.target.files?.[0];
                        if (file){
                            setSelectedFile(file);
                            const view = URL.createObjectURL(file);
                            setPreviewURL(view);
                        }
                        else {
                            setSelectedFile(null);
                            setPreviewURL(null);
                        }
                        
                    }
                }/>
            <figure className="file_preview_frame">
                <img src="" alt="file-preview" />
            </figure>
            <input type="button" value={t('common.confirm')} className="confirm_button" />
            <input type="button" value={t('common.undo')} className="undo_button" />
        </div>
    );
}
export default FileImport;