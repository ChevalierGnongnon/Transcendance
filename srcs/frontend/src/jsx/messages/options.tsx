import { useTranslation } from 'react-i18next';
import '../../scss/messages.scss';
import { useState } from 'react';
import { MessageType } from './types';
import { useAuth } from '../auth/auth-context';
import FileImport from '../files/file-import';

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
  

  const handleChange = async (file: File | null) => {
    
    if (!file)
      return;

    const formData = new FormData();
    formData.append('file', file);

    const request = new XMLHttpRequest();
    request.open('POST', `/api/message/${props.chatId}`);
    request.withCredentials = true;
    request.upload.onprogress = (event) =>{
      setUploadProgress((event.loaded / event.total) * 100)
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
      
    }
    request.send(formData);
  };
  
  return (
    <div className="more-options-div gap-1 d-flex flex-column align-items-center">
      <FileImport
        mode="message"
        deferUpload={true}
        onFileReady={(fileId) => handleChange(fileId)}
        externalProgress={uploadProgress}
      ></FileImport>
      <input
        type="button"
        value={t('message.invite-to-game')}
        className="btn btn-primary more-options-btn"
      />
    </div>
  );
}

export default MoreOptions;
