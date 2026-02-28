// src/components/ui/useToast.jsx
// ✅ Hook uniquement — Fast Refresh compatible (aucun composant exporté)
// ✅ Usage :
//     const { toast, ToastContainer } = useToast()
//     toast.success("Produit supprimé !")
//     // Dans le JSX : {ToastContainer}
import { useState, useCallback, useRef } from "react";
import ToastListContainer from "./ToastContainer";
import { TOAST_DURATION } from "./toastConfig";

export function useToast() {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 280);
  }, []);

  const addToast = useCallback(
    (type, message) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, type, message, exiting: false }]);
      setTimeout(() => dismiss(id), TOAST_DURATION);
    },
    [dismiss],
  );

  const toast = {
    success: (msg) => addToast("success", msg),
    error: (msg) => addToast("error", msg),
    warning: (msg) => addToast("warning", msg),
    info: (msg) => addToast("info", msg),
  };

  const ToastContainer = (
    <ToastListContainer toasts={toasts} onDismiss={dismiss} />
  );

  return { toast, ToastContainer };
}
