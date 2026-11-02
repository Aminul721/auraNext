import type { ReactNode } from "react";
import { AdminAuthProvider } from "@/components/AdminAuth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminAuthProvider>
      <main className="admin-shell">{children}</main>
    </AdminAuthProvider>
  );
}
