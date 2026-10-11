import { useTranslation } from 'react-i18next';
import '../../scss/messages.scss';
import { useState } from 'react';
import { MessageType } from './types';
import { useAuth } from '../auth/auth-context';
import FileImport from '../files/file-import';
import ErrorMessage from '../others/error-message';

interface MoreOptionsProps {
  chatId: string;
  onClose: () => void;
  onSendMessage: (content?: string, type?: MessageType) => void;
}

function MoreOptions(props: MoreOptionsProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const handleSendMessage = props.onSendMessage;
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (file: File | null) => {
    
    if (!file)
      return;

    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    const request = new XMLHttpRequest();
    request.open('POST', `/api/message/${props.chatId}`);
    request.withCredentials = true;
    request.upload.onprogress = (event) =>{
      if (event.lengthComputable === true){
        let progress = (event.loaded / event.total) * 100;
        setUploadProgress(progress);
      }
    }
    request.onload = () =>{
      if (!request || request.status == 401) {
        logout();
        return;
      }
      if (request.status === 201){
        const data = JSON.parse(request.responseText)
        handleSendMessage(data.file_id)
        props.onClose()
      }
      else {
        try{
          const error = JSON.parse(request.responseText);
          setError(error?.error ?? 'INTERNAL_SERVER_ERROR');
        } catch {
          if (request.status === 413)
            setError('INVALID_FILE_SIZE');
          else
            setError('INTERNAL_SERVER_ERROR');
        }
      }
    }
    request.onerror = () => {
      setError('DATABASE_ERROR');
    };
    request.send(formData);
  };
  
  return (
    <div className="more-options-div gap-1 d-flex flex-column align-items-center">
      <FileImport
        mode="message"
        deferUpload={true}
        onFileReady={(fileId) => handleChange(fileId)}
        externalProgress={uploadProgress}
        inputPlaceHolder={t('common.import-file')}
      ></FileImport>
      <input
        type="button"
        value={t('message.invite-to-game')}
        className="btn btn-primary more-options-btn"
      />
      <ErrorMessage error={error} />
    </div>
  );
}

export default MoreOptions;
