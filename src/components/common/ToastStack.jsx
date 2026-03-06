export function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-wrap">
      {toasts.map((toast) => (
        <button
          type="button"
          key={toast.id}
          className={`toast ${toast.kind}`}
          onClick={() => onDismiss(toast.id)}
        >
          <div style={{ fontWeight: 900, marginBottom: 4 }}>{toast.title}</div>
          <div className="muted">{toast.text}</div>
        </button>
      ))}
    </div>
  );
}
