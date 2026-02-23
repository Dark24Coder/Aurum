// src/components/ui/useConfirm.jsx
// ✅ Hook useConfirm — retourne confirm() + ConfirmDialog à rendre dans le JSX
// Usage :
//   const { confirm, ConfirmDialog } = useConfirm()
//   const ok = await confirm({ title, message, confirmLabel, variant })
//   return <main>{ConfirmDialog} ...</main>
import { useState, useCallback } from "react";
import ConfirmDialogUI from "./ConfirmDialog";

export function useConfirm() {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        setDialog({ ...options, resolve });
      }),
    [],
  );

  const handleResponse = (answer) => {
    if (dialog?.resolve) dialog.resolve(answer);
    setDialog(null);
  };

  const ConfirmDialog = dialog ? (
    <ConfirmDialogUI
      title={dialog.title || "Confirmer l'action"}
      message={dialog.message || "Êtes-vous sûr de vouloir continuer ?"}
      confirmLabel={dialog.confirmLabel || "Confirmer"}
      cancelLabel={dialog.cancelLabel || "Annuler"}
      variant={dialog.variant || "danger"}
      onConfirm={() => handleResponse(true)}
      onCancel={() => handleResponse(false)}
    />
  ) : null;

  return { confirm, ConfirmDialog };
}
