import '../../scss/loading.scss';

export function Loading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="loader-box">
      <div className="loader-square" />
      <span className="loader-text">{text}</span>
    </div>
  );
}
