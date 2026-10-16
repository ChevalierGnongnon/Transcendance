import messageIcon from '../../assets/icons/message-60.png';
import moreIcon from '../../assets/icons/plus.png';
import blockIcon from '../../assets/icons/croix.png';
import geminiIcon from '../../assets/icons/gemini.png';
import { useTranslation } from 'react-i18next';
import { ActiveView } from './types';

interface NavBarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

function NavBar({ activeView, setActiveView }: NavBarProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="p-1 nav-bar d-none d-md-grid">
        <div className="icon-message-message m-2" onClick={() => setActiveView('chats')}>
          <img src={messageIcon} alt="messagelist" />
        </div>
        <span onClick={() => setActiveView('chats')}>{t('message.chats')}</span>
        <div className="icon-message-message m-2" onClick={() => setActiveView('new message')}>
          <img src={moreIcon} alt="newone" />
        </div>
        <span onClick={() => setActiveView('new message')}>{t('message.new-message')}</span>
        <div className="icon-message-message m-2" onClick={() => setActiveView('block')}>
          <img src={blockIcon} alt="block" />
        </div>
        <span onClick={() => setActiveView('block')}>{t('message.block')}</span>
        <div className="icon-message-message m-2" onClick={() => setActiveView('imaginaryfriend')}>
          <img src={geminiIcon} alt="gemini" />
        </div>
        <span onClick={() => setActiveView('imaginaryfriend')}>
          {t('message.imaginary-friend')}
        </span>
      </div>
      <select
        className="nav-dropdown d-md-none"
        value={activeView === 'conversation' ? 'chats' : activeView}
        onChange={(e) => setActiveView(e.target.value as NavBarProps['activeView'])}
      >
        <option value="chats">{t('message.chats')}</option>
        <option value="new message">{t('message.new-message')}</option>
        <option value="block">{t('message.block')}</option>
        <option value="imaginaryfriend">{t('message.imaginary-friend')}</option>
      </select>
    </>
  );
}
export default NavBar;
