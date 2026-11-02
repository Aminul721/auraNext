"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AdminUser = { id: string; email: string; role: "admin" };

type AdminAuthValue = {
  accessToken: string | null;
  admin: AdminUser | null;
  signIn: (token: string, user: AdminUser) => void;
  signOut: () => void;
};

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{
    accessToken: string | null;
    admin: AdminUser | null;
  }>({ accessToken: null, admin: null });

  const value = useMemo<AdminAuthValue>(
    () => ({
      ...session,
      signIn: (accessToken, admin) => setSession({ accessToken, admin }),
      signOut: () => setSession({ accessToken: null, admin: null }),
    }),
    [session],
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  return context;
}

export function getAdminApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api"
  ).replace(/\/+$/, "");
}
