// src/context/AuthProvider.jsx
// ✅ SESSION PERSISTANTE via localStorage
// - Au démarrage : relit l'user depuis localStorage (survive au refresh)
// - Au login/register : sauvegarde dans localStorage
// - Au logout : efface localStorage → seul moyen de couper la session
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { ADMIN_EMAIL, generateId, COUNTRIES_DATA } from "../utils/constants";

const STORAGE_KEY = "bjb_session";

// Données marketplace par défaut intégrées dans le provider
const DEFAULT_MARKETPLACE = [
  {
    id: "MK-001",
    sellerId: "ADMIN-01",
    category: "ELECTRONIQUE",
    name: "AirPods Pro 2",
    price: 35000,
    desc: "Neufs sous scellé. Qualité premium. Garantie 6 mois.",
    img: "https://images.unsplash.com/photo-1603351154351-5cf99bc32f2d?auto=format&fit=crop&q=80&w=400",
    status: "ACTIVE",
  },
  {
    id: "MK-002",
    sellerId: "ADMIN-01",
    category: "ELECTRONIQUE",
    name: "PS5 Slim",
    price: 380000,
    desc: "Version standard avec lecteur. Garantie 1 an constructeur.",
    img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=400",
    status: "ACTIVE",
  },
  {
    id: "MK-003",
    sellerId: "ADMIN-01",
    category: "MODE",
    name: 'Perruque Brésilienne 24"',
    price: 85000,
    desc: "Cheveux naturels lisses, grade 12A. Longueur 24 pouces.",
    img: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=400",
    status: "ACTIVE",
  },
  {
    id: "MK-004",
    sellerId: "ADMIN-01",
    category: "MAISON",
    name: "Mixeur Blender Pro",
    price: 45000,
    desc: "2000W, idéal pour smoothies et pâtes lourdes. Livré avec 3 bols.",
    img: "https://images.unsplash.com/photo-1570222094114-28a9d88a27e6?auto=format&fit=crop&q=80&w=400",
    status: "ACTIVE",
  },
  {
    id: "MK-005",
    sellerId: "ADMIN-01",
    category: "AUTO",
    name: "Kit Nettoyage Auto",
    price: 15000,
    desc: "Complet : Shampoing, Cire, Microfibres. Résultats pro garantis.",
    img: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=400",
    status: "ACTIVE",
  },
  {
    id: "MK-006",
    sellerId: "ADMIN-01",
    category: "MODE",
    name: "Montre Homme Luxe",
    price: 25000,
    desc: "Style classique, bracelet acier inoxydable. Étanche 50m.",
    img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=400",
    status: "ACTIVE",
  },
  {
    id: "MK-007",
    sellerId: "ADMIN-01",
    category: "ELECTRONIQUE",
    name: "iPhone 14 Pro",
    price: 520000,
    desc: "128Go, état impeccable, batterie 94%. Débloqué tous opérateurs.",
    img: "https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?auto=format&fit=crop&q=80&w=400",
    status: "RUPTURE",
  },
  {
    id: "MK-008",
    sellerId: "ADMIN-01",
    category: "MAISON",
    name: "Climatiseur 12000 BTU",
    price: 220000,
    desc: "Inverter, 12000 BTU, classe A++. Installation incluse à Cotonou.",
    img: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=400",
    status: "RUPTURE",
  },
];

const DEFAULT_DB = {
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
  marketplace: DEFAULT_MARKETPLACE,
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
};

// ── Lecture sécurisée localStorage ───────────────────────────────────────────
function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Écriture sécurisée localStorage ──────────────────────────────────────────
function writeSession(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    /* quota dépassé etc. */
  }
}

export const AuthProvider = ({ children }) => {
  // ── Initialisation : relit la session depuis localStorage au démarrage ────
  const [currentUser, setCurrentUser] = useState(() => readSession());
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [db, setDb] = useState(DEFAULT_DB);

  // ── Synchronise localStorage à chaque changement de currentUser ───────────
  useEffect(() => {
    writeSession(currentUser);
  }, [currentUser]);

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

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, _password) => {
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
        setCurrentUser(user); // ← useEffect écrit dans localStorage
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
          role: "CLIENT",
          kycStatus: "NONE",
          depositPaid: false,
          balance: 0,
          ...userData,
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
        setCurrentUser(newUser); // ← useEffect écrit dans localStorage
        setAuthLoading(false);
        resolve({ success: true });
      }, 1500);
    });
  }, []);

  // ── LOGOUT — efface localStorage ─────────────────────────────────────────
  const logout = useCallback(() => {
    setCurrentUser(null); // ← useEffect supprime localStorage via writeSession(null)
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
          setCurrentUser(updatedUser); // ← aussi sauvegardé dans localStorage
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
