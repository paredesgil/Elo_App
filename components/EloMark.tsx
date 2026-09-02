export function EloMark({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <circle cx="24" cy="30" r="14" stroke="var(--gold)" strokeWidth="4.5" />
      <circle cx="38" cy="30" r="14" stroke="var(--gold-soft)" strokeWidth="4.5" />
    </svg>
  );
}
