interface BadgeProps {
  count: number;
  max?: number;
  variant?: 'success' | 'danger' | 'primary';
  className?: string;
}

function Badge({ count, max = 99, variant = 'success', className }: BadgeProps) {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span className={`badge rounded-pill bg-${variant} me-2 text-start ${className ?? ''}`}>
      {displayCount}
    </span>
  );
}

export default Badge;
