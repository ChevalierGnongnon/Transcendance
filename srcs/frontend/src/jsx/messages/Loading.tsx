// export function Loading() {
//   return (
//     <div
//       style={{
//         position: 'fixed',
//         inset: 0,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'rgba(255,255,255,0.6)',
//         zIndex: 9999,
//       }}
//     >
//       <div
//         style={{
//           width: 48,
//           height: 48,
//           background: '#3b82f6',
//           borderRadius: 8,
//           animation: 'loader-pulse 1s ease-in-out infinite',
//         }}
//       />
//       <style>{`
//         @keyframes loader-pulse {
//           0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
//           50% { transform: scale(0.6) rotate(45deg); opacity: 0.5; }
//         }
//       `}</style>
//     </div>
//   );
// }
import '../../scss/loading.scss';

export function Loading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="loader-box">
      <div className="loader-square" />
      <span className="loader-text">{text}</span>
    </div>
  );
}
