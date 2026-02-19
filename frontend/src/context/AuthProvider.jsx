// src/context/AuthProvider.jsx
import React, { useState, useMemo, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { ADMIN_EMAIL, generateId, COUNTRIES_DATA } from "../utils/constants";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const [db, setDb] = useState({
    users: [],
    orders: [
      {
        id: "ORD-9921",
        userId: "USER-01",
        product: "iPhone 15 Pro",
        status: "EN_TRANSIT",
        price: 750000,
        date: "15/03/2024",
        type: "SOURCING",
        trackingInternal: "BJB-552",
        trackingCarrier: "DHL: 442110",
      },
      {
        id: "ORD-1223",
        userId: "USER-01",
        product: "MacBook Air M2",
        status: "LIVRE",
        price: 950000,
        date: "10/02/2024",
        type: "MARKETPLACE",
        trackingInternal: "BJB-110",
        trackingCarrier: "LIVRÉ",
      },
    ],
    kycRequests: [],
    notifications: [
      {
        id: 1,
        userId: "USER-01",
        title: "Bienvenue",
        message: "Votre compte BJ Business est actif.",
        type: "SUCCESS",
        date: "18/03/2024",
        read: false,
      },
    ],
  });

  const isAdmin = useMemo(
    () => currentUser?.email === ADMIN_EMAIL,
    [currentUser],
  );
  const isAuthenticated = useMemo(() => !!currentUser, [currentUser]);

  const unreadCount = useMemo(() => {
    if (!currentUser) return 0;
    return db.notifications.filter(
      (n) => n.userId === currentUser.uid && !n.read,
    ).length;
  }, [db.notifications, currentUser]);

  // ── LOGIN (mock — password ignoré volontairement jusqu'au backend) ──────
  const login = useCallback(async (email) => {
    setAuthLoading(true);
    setAuthError("");
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = email === ADMIN_EMAIL ? "ADMIN" : "CLIENT";
        const user = {
          uid: email === ADMIN_EMAIL ? "ADMIN-01" : "USER-01",
          name: email === ADMIN_EMAIL ? "Admin BJB" : "Client Privilège",
          email,
          role,
          kycStatus: email === ADMIN_EMAIL ? "VALID" : "PENDING",
          depositPaid: email === ADMIN_EMAIL,
          balance: 0,
          phone: "",
          country: "",
        };
        setCurrentUser(user);
        setAuthLoading(false);
        resolve({ success: true, role });
      }, 1000);
    });
  }, []);

  // ── REGISTER ──────────────────────────────────────────────────────────────
  const register = useCallback(async (userData) => {
    setAuthLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          uid: generateId("USR"),
          ...userData,
          role: "CLIENT",
          kycStatus: "NONE",
          depositPaid: false,
          balance: 0,
        };
        const welcomeNotif = {
          id: generateId("NOTIF"),
          userId: newUser.uid,
          title: "Bienvenue sur BJBUSINESS !",
          message:
            "Votre compte a été créé. Complétez votre KYC pour commencer.",
          date: new Date().toLocaleDateString(),
          read: false,
          type: "INFO",
        };
        setDb((prev) => ({
          ...prev,
          notifications: [...prev.notifications, welcomeNotif],
        }));
        setCurrentUser(newUser);
        setAuthLoading(false);
        resolve({ success: true });
      }, 1500);
    });
  }, []);

  // ── LOGOUT ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setCurrentUser(null);
    setAuthError("");
  }, []);

  // ── RECOVER PASSWORD ──────────────────────────────────────────────────────
  const recoverPassword = useCallback(async (email) => {
    setAuthLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setAuthLoading(false);
        resolve({
          success: true,
          message: `Si un compte existe pour ${email}, un lien a été envoyé.`,
        });
      }, 1000);
    });
  }, []);

  // ── UPDATE PROFILE ────────────────────────────────────────────────────────
  const updateProfile = useCallback(
    async (formData) => {
      setAuthLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          const updatedUser = { ...currentUser, ...formData };
          if (!formData.password) delete updatedUser.password;
          setCurrentUser(updatedUser);
          setAuthLoading(false);
          resolve({ success: true });
        }, 800);
      });
    },
    [currentUser],
  );

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  const markNotifRead = useCallback((id) => {
    setDb((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
  }, []);

  const deleteNotif = useCallback((id) => {
    setDb((prev) => ({
      ...prev,
      notifications: prev.notifications.filter((n) => n.id !== id),
    }));
  }, []);

  // ── KYC ───────────────────────────────────────────────────────────────────
  const submitKyc = useCallback(
    async (data) => {
      setAuthLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          const newRequest = {
            id: generateId("KYC"),
            userId: currentUser?.uid,
            userName: currentUser?.name,
            ...data,
            status: "PENDING",
            date: new Date().toLocaleDateString(),
          };
          setDb((prev) => ({
            ...prev,
            kycRequests: [newRequest, ...prev.kycRequests],
          }));
          setCurrentUser((prev) => ({ ...prev, kycStatus: "PENDING" }));
          setAuthLoading(false);
          resolve({ success: true });
        }, 1500);
      });
    },
    [currentUser],
  );

  // ── ADMIN ACTIONS ─────────────────────────────────────────────────────────
  const adminUpdateKyc = useCallback((kycId, newStatus) => {
    setDb((prev) => ({
      ...prev,
      kycRequests: prev.kycRequests.map((k) =>
        k.id === kycId ? { ...k, status: newStatus } : k,
      ),
    }));
  }, []);

  const adminUpdateOrderStatus = useCallback((orderId, newStatus) => {
    setDb((prev) => ({
      ...prev,
      orders: prev.orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o,
      ),
    }));
  }, []);

  const value = {
    currentUser,
    isAuthenticated,
    isAdmin,
    authLoading,
    authError,
    db,
    setDb,
    unreadCount,
    COUNTRIES_DATA,
    login,
    register,
    logout,
    recoverPassword,
    updateProfile,
    submitKyc,
    markNotifRead,
    deleteNotif,
    adminUpdateKyc,
    adminUpdateOrderStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
