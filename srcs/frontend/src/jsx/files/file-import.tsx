import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

function FileImport(){
    const {t} = useTranslation();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);

    return (
        <div className="file_component">
            <input type="file" name="file_input" id="file_input" className="upload_file" onChange={}/>
            <figure className="file_preview_frame">
                <img src="" alt="file-preview" />
            </figure>
            <input type="button" value={t('common.confirm')} className="confirm_button" />
            <input type="button" value={t('common.undo')} className="undo_button" />
        </div>
    );
}
export default FileImport;