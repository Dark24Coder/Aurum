import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Hook principal pour accéder à tout le contexte auth.
 *
 * Usage :
 *   const { currentUser, login, logout, isAdmin, db } = useAuth();
 *
 * Doit être utilisé à l'intérieur d'un <AuthProvider>.
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un <AuthProvider>");
  }
  return ctx;
}