import '../../../scss/common-classes.scss';
import '../../../scss/profile-page.scss';

interface ShortcutCardProps {
  icon: string;
  label: string;
  onClick?: () => void;
  colSize?: string;
  alt?: string;
}

export default function ShortcutCard({
  icon,
  label,
  onClick,
  colSize = 'col-12 col-md-6 col-xl-6',
  alt,
}: ShortcutCardProps) {
  return (
    <div className={colSize}>
      <figure className="shortcut-icon justify-content-center" onClick={onClick}>
        <img src={icon} alt={alt || label} />
        <span>{label}</span>
      </figure>
    </div>
  );
}
