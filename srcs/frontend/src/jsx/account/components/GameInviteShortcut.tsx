import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function AddFriendShortcut() {
  const { t } = useTranslation();
  const navigate = useNavigate();

interface GameInviteShortcutProps {
  propName: type;
}

export default function GameInviteShortcut({ propName }: GameInviteShortcut
Props) {
  return <div></div>;
}
