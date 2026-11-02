"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminApiBaseUrl, useAdminAuth } from "@/components/AdminAuth";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  eventDate?: string;
  eventLocation?: string;
  message: string;
  status: string;
  createdAt: string;
};

type EnquiryListResult = {
  enquiries: Enquiry[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
};

const statuses = ["new", "contacted", "in_progress", "completed", "spam"];

function AdminHeader() {
  const router = useRouter();
  const { accessToken, admin, signOut } = useAdminAuth();

  async function logout() {
    if (accessToken) {
      try {
        await fetch(`${getAdminApiBaseUrl()}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        });
      } finally {
        signOut();
        router.replace("/admin/login");
      }
    } else {
      router.replace("/admin/login");
    }
  }

  return (
    <header className="admin-header">
      <Link href="/admin/dashboard" className="admin-brand">
        AURA <span>HUMANOID TECH</span>
      </Link>
      <div className="admin-user">
        <span>{admin?.email}</span>
        <button className="btn btn-secondary" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

export function EnquiryManagement() {
  const router = useRouter();
  const { accessToken, signOut } = useAdminAuth();
  const [result, setResult] = useState<EnquiryListResult | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEnquiries = useCallback(async () => {
    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (query) params.set("search", query);
      if (status) params.set("status", status);
      const response = await fetch(
        `${getAdminApiBaseUrl()}/admin/enquiries?${params}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (response.status === 401) {
        signOut();
        router.replace("/admin/login");
        return;
      }
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Unable to load enquiries.");
      setResult(body);
      setError("");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load enquiries.",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, page, query, router, signOut, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadEnquiries(), 0);
    return () => window.clearTimeout(timer);
  }, [loadEnquiries]);

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setQuery(search.trim());
  }

  return (
    <div className="admin-page">
      <AdminHeader />
      <section className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="badge">Management</p>
            <h1>Enquiries</h1>
          </div>
          <Link className="btn btn-secondary" href="/admin/dashboard">
            Dashboard
          </Link>
        </div>
        <form className="admin-filters glass-panel" onSubmit={applyFilters}>
          <div className="form-group">
            <label htmlFor="enquiry-search">Search name, email or company</label>
            <input
              id="enquiry-search"
              value={search}
              maxLength={100}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="enquiry-status-filter">Status</label>
            <select
              id="enquiry-status-filter"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </form>
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        {loading && <p role="status">Loading enquiries...</p>}
        {!loading && result?.enquiries.length === 0 && (
          <p className="glass-panel admin-empty">No enquiries match these filters.</p>
        )}
        {result && result.enquiries.length > 0 && (
          <>
            <div className="admin-table-wrap glass-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Service</th>
                    <th scope="col">Status</th>
                    <th scope="col">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {result.enquiries.map((enquiry) => (
                    <tr key={enquiry.id}>
                      <td>
                        <Link href={`/admin/enquiries/${enquiry.id}`}>
                          {enquiry.name}
                        </Link>
                      </td>
                      <td>{enquiry.email}</td>
                      <td>{enquiry.service || "—"}</td>
                      <td>
                        <span className="status-pill">{enquiry.status}</span>
                      </td>
                      <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-pagination">
              <p>
                {result.pagination.total} total · Page {result.pagination.page} of{" "}
                {Math.max(result.pagination.totalPages, 1)}
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => current - 1)}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={page >= result.pagination.totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export function EnquiryDetail({ id }: { id: string }) {
  const router = useRouter();
  const { accessToken, signOut } = useAdminAuth();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadEnquiry = useCallback(async () => {
    if (!accessToken) {
      router.replace("/admin/login");
      return;
    }
    try {
      const response = await fetch(
        `${getAdminApiBaseUrl()}/admin/enquiries/${encodeURIComponent(id)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (response.status === 401) {
        signOut();
        router.replace("/admin/login");
        return;
      }
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || "Unable to load enquiry.");
      setEnquiry(body.enquiry);
      setStatus(body.enquiry.status);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Unable to load enquiry.",
      );
    } finally {
      setLoading(false);
    }
  }, [accessToken, id, router, signOut]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadEnquiry(), 0);
    return () => window.clearTimeout(timer);
  }, [loadEnquiry]);

  async function updateStatus() {
    if (!accessToken) return;
    setError("");
    setMessage("");
    try {
      const response = await fetch(
        `${getAdminApiBaseUrl()}/admin/enquiries/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );
      const body = await response.json();
      if (response.status === 401) {
        signOut();
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) throw new Error(body.message || "Unable to update enquiry.");
      setEnquiry(body.enquiry);
      setMessage("Enquiry status updated.");
    } catch (updateError) {
      setError(
        updateError instanceof Error ? updateError.message : "Unable to update enquiry.",
      );
    }
  }

  async function deleteEnquiry() {
    if (!accessToken || !window.confirm("Remove this enquiry from the admin list?"))
      return;
    setError("");
    try {
      const response = await fetch(
        `${getAdminApiBaseUrl()}/admin/enquiries/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const body = await response.json();
      if (response.status === 401) {
        signOut();
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) throw new Error(body.message || "Unable to delete enquiry.");
      router.replace("/admin/enquiries");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : "Unable to delete enquiry.",
      );
    }
  }

  return (
    <div className="admin-page">
      <AdminHeader />
      <section className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="badge">Enquiry details</p>
            <h1>{enquiry?.name || "Enquiry"}</h1>
          </div>
          <Link className="btn btn-secondary" href="/admin/enquiries">
            Back to enquiries
          </Link>
        </div>
        {loading && <p role="status">Loading enquiry...</p>}
        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}
        {message && (
          <p className="admin-success" role="status">
            {message}
          </p>
        )}
        {enquiry && (
          <article className="glass-panel enquiry-detail">
            <dl>
              <div><dt>Email</dt><dd><a href={`mailto:${enquiry.email}`}>{enquiry.email}</a></dd></div>
              <div><dt>Phone</dt><dd>{enquiry.phone || "Not provided"}</dd></div>
              <div><dt>Company</dt><dd>{enquiry.company || "Not provided"}</dd></div>
              <div><dt>Service</dt><dd>{enquiry.service || "Not provided"}</dd></div>
              <div><dt>Event date</dt><dd>{enquiry.eventDate ? new Date(enquiry.eventDate).toLocaleDateString() : "Not provided"}</dd></div>
              <div><dt>Event location</dt><dd>{enquiry.eventLocation || "Not provided"}</dd></div>
              <div><dt>Received</dt><dd>{new Date(enquiry.createdAt).toLocaleString()}</dd></div>
              <div className="detail-message"><dt>Message</dt><dd>{enquiry.message}</dd></div>
            </dl>
            <div className="admin-detail-actions">
              <div className="form-group">
                <label htmlFor="detail-status">Enquiry status</label>
                <select
                  id="detail-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  {statuses.map((item) => (
                    <option key={item} value={item}>{item.replace("_", " ")}</option>
                  ))}
                </select>
              </div>
              <button className="btn btn-primary" onClick={updateStatus}>
                Save status
              </button>
              <button className="btn btn-danger" onClick={deleteEnquiry}>
                Remove enquiry
              </button>
            </div>
          </article>
        )}
      </section>
    </div>
  );
}
