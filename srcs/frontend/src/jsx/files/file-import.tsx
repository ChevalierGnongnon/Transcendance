import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { useAuth } from "../auth/auth-context";
import ErrorMessage from "../others/error-message";
import "../../scss/files.scss"


interface FileImportComponent{
    mode: 'avatar' | 'message';
    onUploaded?: (fileId: string) => void;
    onSelectedChange?:(hasFile: boolean)=> void;
    initialPreviewUrl?: string; 
    deferUpload?: boolean;
    onFileReady?: (file: File | null) => void;
    externalProgress?: number;
    externalError?: string | null;
    inputPlaceHolder: string | undefined
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
    const [confirmed, setConfirmed] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const {markDisconnected} = useAuth();


    return (
        <div className="file_component p-2 d-flex flex-column">
            <input
                type="file"
                name="file_input"
                id="file_input"
                className="d-none"
                ref={fileInputRef}
                placeholder={fileImportComponent.inputPlaceHolder}
                onChange={
                    (e)=>{
                        if (previewURL)
                            URL.revokeObjectURL(previewURL);
                        setUploadProgress(0);
                        setConfirmed(false);
                        const file = e.target.files?.[0];
                        if (file){
                            const whiteList = fileImportComponent.mode === 'avatar' ? avatarWhiteList : messageFileWhiteList;
                            const maxSize = fileImportComponent.mode === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
                            let fileError: string | null = null;

                            if (!whiteList.includes(file.type))
                                fileError = 'WRONG_FILE_TYPE';
                            else if (file.size > maxSize)
                                fileError = 'INVALID_FILE_SIZE';

                            if (fileError) {
                                setErrorMessage(fileError);
                                setSelectedFile(null);
                                setPreviewURL(null);
                                if (fileImportComponent.onSelectedChange)
                                    fileImportComponent.onSelectedChange(false);
                            }
                            else {
                                setErrorMessage(null);
                                setSelectedFile(file);
                                const view = URL.createObjectURL(file);
                                setPreviewURL(view);
                                if (fileImportComponent.onSelectedChange)
                                    fileImportComponent.onSelectedChange(true);
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
            <div className="upload_file" onClick={() => fileInputRef.current?.click()}>
                <span className="upload_file-label">{t('common.import-file-instead')}</span>
                {selectedFile && <span className="upload_file-name">{selectedFile.name}</span>}
            </div>

            <figure className="file_preview_frame">
                {   previewURL && selectedFile?.type.startsWith('image/') &&
                    <img className="avatar-preview" src={previewURL ?? ''} alt={t('alt.file-preview')} />
                }

                {selectedFile?.type === 'application/pdf' &&
                    <div className="icon-preview">
                        <img src="/pdf-icon.svg" alt={t('alt.pdf')} />
                    </div>
                }

                {selectedFile?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                    <div className="icon-preview">
                        <img src="/docx-icon.svg" alt={t('alt.docx')} />
                    </div>
                }

                {selectedFile?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                    <div className="icon-preview">
                        <img src="/xlsx-icon.svg" alt={t('alt.xlsx')} />
                    </div>
                }

                {selectedFile?.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
                    <div className="icon-preview">
                        <img src="/pptx-icon.svg" alt={t('alt.pptx')} />
                    </div>
                }
                
            </figure>
            <progress className="w-75 mx-auto"value={fileImportComponent.externalProgress ?? uploadProgress} max={100}></progress>
            <input
                type="button"
                value={t('common.confirm')}
                className="file-accept-button"
                disabled={isUploading || selectedFile === null}
                onClick={()=>{
                    if (isUploading === true)
                        return;
                    else {
                        setIsUploading(true);
                        setUploadProgress(0);
                        let url ;
                        if (selectedFile === null){
                            setIsUploading(false);
                            return ;
                        }
                            
                        if (fileImportComponent.deferUpload){
                            if (fileImportComponent.onFileReady)
                                fileImportComponent.onFileReady(selectedFile);
                            setConfirmed(true);
                            setIsUploading(false);
                            return;
                        }
                        let form = new FormData();
                        form.append('file', selectedFile);
                        let request = new XMLHttpRequest();
                        if (fileImportComponent.mode === 'avatar')
                            url = '/api/avatar';
                        else{
                            setIsUploading(false);
                            return ;
                        }
                        request.open('POST', url);
                        request.onload = () =>{
                            if (request.status === 201){
                                const id = JSON.parse(request.responseText);
                                if (fileImportComponent.onUploaded){
                                    fileImportComponent.onUploaded(id.file_id);
                                    
                                }
                                setErrorMessage(null);
                                setUploadProgress(0);
                                setConfirmed(false);
                                if (fileInputRef.current)
                                    fileInputRef.current.value = '';
                                setSelectedFile(null);
                                if (previewURL)
                                    URL.revokeObjectURL(previewURL);
                                setPreviewURL(null);
                                if (fileImportComponent.onSelectedChange)
                                    fileImportComponent.onSelectedChange(false);
                            }
                            else if (request.status === 401)
                                markDisconnected();
                            else {
                                try{
                                    const error = JSON.parse(request.responseText);
                                    setErrorMessage(error?.error ?? 'INTERNAL_SERVER_ERROR');
                                } catch {
                                    if (request.status === 413)
                                        setErrorMessage('INVALID_FILE_SIZE');
                                    else
                                        setErrorMessage('INTERNAL_SERVER_ERROR');
                                    
                                }
                            }
                            setIsUploading(false);

                        }
                        request.upload.onprogress = (event) =>{
                            if (event.lengthComputable === true){
                                let progress = (event.loaded / event.total) * 100;
                                setUploadProgress(progress);
                            }   
                        }
                        request.onerror = () => {
                            setErrorMessage('DATABASE_ERROR');
                            setIsUploading(false);
                        };
                        request.send(form);
                    }
                }
            }/>
            {confirmed && <span className="d-block text-center text-white">✓ {t('common.ready')}</span>}
            <ErrorMessage error={errorMessage ?? fileImportComponent.externalError ?? null} />
            <input
                type="button"
                value={t('common.undo')}
                className="file-delete-button"
                onClick={()=>{
                    if (fileImportComponent.onSelectedChange)
                        fileImportComponent.onSelectedChange(false);
                    if (fileInputRef.current)
                        fileInputRef.current.value = '';
                    setSelectedFile(null);
                    if (previewURL)
                        URL.revokeObjectURL(previewURL);
                    setPreviewURL(null);
                    setErrorMessage(null);
                    setUploadProgress(0);
                    setConfirmed(false);
                    if (fileImportComponent.onFileReady)
                        fileImportComponent.onFileReady(null)
                }}
            />
        </div>
    );
}
export default FileImport;