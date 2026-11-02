"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminApiBaseUrl, useAdminAuth } from "@/components/AdminAuth";

type DashboardData = {
  total: number;
  new: number;
  contacted: number;
  in_progress: number;
  completed: number;
};

type RecentEnquiry = {
  id: string;
  name: string;
  email: string;
  service?: string;
  status: string;
  createdAt: string;
};

export function AdminDashboard() {
  const router = useRouter();
  const { accessToken, admin, signOut } = useAdminAuth();
  const [counts, setCounts] = useState<DashboardData | null>(null);
  const [recent, setRecent] = useState<RecentEnquiry[]>([]);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }
    try {
      const response = await fetch(`${getAdminApiBaseUrl()}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 401) {
        signOut();
        router.replace("/admin/login");
        return;
      }
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to load dashboard.");
      setCounts(result.counts);
      setRecent(result.recentEnquiries);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load dashboard.",
      );
    }
  }, [accessToken, router, signOut]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadDashboard(), 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  async function handleSignOut() {
    signOut();
    router.replace("/admin/login");
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <Link href="/admin/dashboard" className="admin-brand">
          AURA <span>HUMANOID TECH</span>
        </Link>
        <div className="admin-user">
          <span>{admin?.email}</span>
          <button className="btn btn-secondary" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </header>
      <section className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="badge">Overview</p>
            <h1>Enquiry dashboard</h1>
          </div>
          <Link className="btn btn-primary" href="/admin/enquiries">
            View all enquiries
          </Link>
        </div>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        {!counts && !error ? (
          <p role="status">Loading dashboard...</p>
        ) : (
          <>
            <div className="admin-stats">
              {[
                ["Total enquiries", counts?.total],
                ["New", counts?.new],
                ["Contacted", counts?.contacted],
                ["In progress", counts?.in_progress],
                ["Completed", counts?.completed],
              ].map(([label, count]) => (
                <article className="glass-panel admin-stat" key={label}>
                  <h2>{count ?? 0}</h2>
                  <p>{label}</p>
                </article>
              ))}
            </div>
            <section className="glass-panel admin-recent">
              <h2>Recent enquiries</h2>
              {recent.length ? (
                <ul>
                  {recent.map((enquiry) => (
                    <li key={enquiry.id}>
                      <Link href={`/admin/enquiries/${enquiry.id}`}>
                        <strong>{enquiry.name}</strong>
                        <span>{enquiry.email}</span>
                        <span>{enquiry.service || "Service not specified"}</span>
                        <span className="status-pill">{enquiry.status}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No enquiries have been received yet.</p>
              )}
            </section>
          </>
        )}
      </section>
    </div>
  );
}
