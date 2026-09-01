import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import ErrorMessage from "../others/error-message";
import "../../scss/files.scss"
interface FileImportComponent{
    mode: 'avatar' | 'message';
    onUploaded: (fileId: string) => void;
    onSelectedChange?:(hasFile: boolean)=> void;
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
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    const fileInputRef = useRef<HTMLInputElement>(null);
    return (
        <div className="file_component d-flex flex-column">
            <input
                type="file"
                name="file_input" 
                id="file_input"
                className="upload_file"
                ref={fileInputRef}
                onChange={
                    (e)=>{
                        setUploadProgress(0);
                        const file = e.target.files?.[0];
                        if (file){
                            if (fileImportComponent.mode === 'avatar'
                                && file.size <= (5 * 1024 * 1024)
                                && avatarWhiteList.includes(file.type)){
                                    setErrorMessage(null);
                                    setSelectedFile(file);
                                    const view = URL.createObjectURL(file);
                                    setPreviewURL(view);
                                    if (fileImportComponent.onSelectedChange)
                                        fileImportComponent.onSelectedChange(true);
                            }
                            else if (fileImportComponent.mode === 'message'
                                && file.size <= (10 * 1024 * 1024)
                                && messageFileWhiteList.includes(file.type)){
                                    setErrorMessage(null);
                                    setSelectedFile(file);
                                    const view = URL.createObjectURL(file);
                                    setPreviewURL(view);
                                    if (fileImportComponent.onSelectedChange)
                                        fileImportComponent.onSelectedChange(true);
                            }
                            else {
                                setErrorMessage('WRONG_FILE_TYPE');
                                setSelectedFile(null);
                                setPreviewURL(null);
                                if (fileImportComponent.onSelectedChange)
                                    fileImportComponent.onSelectedChange(false);
                            }
                        }
                        else {
                            setErrorMessage(null);
                            setSelectedFile(null);
                            setPreviewURL(null);
                            if (fileImportComponent.onSelectedChange)
                                fileImportComponent.onSelectedChange(false);
                        }
                    }
                }/>
            
            <figure className="file_preview_frame">
                <img className="avatar-preview" src={previewURL ?? ''} alt="file-preview" />
            </figure>
            <progress className="w-25 mx-auto" value={uploadProgress} max={100}></progress>
            <input
                type="button"
                value={t('common.confirm')}
                className="confirm_button" 
                onClick={()=>{
                    setUploadProgress(0);
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
                    request.upload.onprogress = (event) =>{
                        let progress = (event.loaded / event.total) * 100;
                        setUploadProgress(progress);
                    }
                    request.send(form);
                }
            }/>
            <ErrorMessage error={errorMessage} />
            <input
                type="button"
                value={t('common.undo')}
                className="undo_button"
                onClick={()=>{
                    if (fileImportComponent.onSelectedChange)
                        fileImportComponent.onSelectedChange(false);
                    if (fileInputRef.current)
                        fileInputRef.current.value = '';
                    setSelectedFile(null);
                    if (previewURL)
                        URL.revokeObjectURL(previewURL)
                    setPreviewURL(null);
                    setErrorMessage(null);
                    setUploadProgress(0);

                }}/>
        </div>
    );
}
export default FileImport;