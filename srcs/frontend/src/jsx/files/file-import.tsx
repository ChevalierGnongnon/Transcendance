import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

interface FileImportComponent{
    mode: 'avatar' | 'message';
    onUploaded: (fileId: string) => void;
    initialPreviewUrl?: string; 
}

const avatarWhiteList = [
    'image/png',
    'image/webp',
    'image/jpeg'
];

const messageFileWhiteList = [
  'image/png',
  'image/webp',
  'image/jpeg',
  'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',   // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',        // .xlsx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
]

function FileImport(fileImportComponent: FileImportComponent){
    const {t} = useTranslation();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(fileImportComponent.initialPreviewUrl ?? null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
                            if (fileImportComponent.mode === 'avatar'
                                && file.size <= (5 * 1024 * 1024)
                                && avatarWhiteList.includes(file.type)){
                                    setErrorMessage(null);
                                    setSelectedFile(file);
                                    const view = URL.createObjectURL(file);
                                    setPreviewURL(view);   
                            }
                            else if (fileImportComponent.mode === 'message'
                                && file.size <= (10 * 1024 * 1024)
                                && messageFileWhiteList.includes(file.type)){
                                    setErrorMessage(null);
                                    setSelectedFile(file);
                                    const view = URL.createObjectURL(file);
                                    setPreviewURL(view); 
                            }
                            else {
                                setErrorMessage('BAD_FILE_TYPE');
                                setSelectedFile(null);
                                setPreviewURL(null);
                            }
                        }
                        else {
                            setErrorMessage(null);
                            setSelectedFile(null);
                            setPreviewURL(null);
                        }
                    }
                }/>
            <figure className="file_preview_frame">
                <img src={previewURL ?? ''} alt="file-preview" />
            </figure>
            <input
                type="button"
                value={t('common.confirm')}
                className="confirm_button" 
                onClick={()=>{
                    let url ;
                    if (selectedFile === null)
                        return ;
                    let form = new FormData();
                    form.append('file', selectedFile);
                    let request = new XMLHttpRequest();
                    if (fileImportComponent.mode === 'avatar')
                        url = '/api/avatar';
                    else if (fileImportComponent.mode === 'message')
                        url = '/api/message';
                    else
                        return ;
                    request.open('POST', url);
                    request.onload = () =>{
                        if (request.status === 201){
                            const id = JSON.parse(request.responseText);
                            fileImportComponent.onUploaded(id.file_id);
                        }
                    }
                    request.send(form);
                }
            }/>
            <input type="button" value={t('common.undo')} className="undo_button" />
        </div>
    );
}
export default FileImport;