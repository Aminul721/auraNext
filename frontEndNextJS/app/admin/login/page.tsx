"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAdminApiBaseUrl, useAdminAuth } from "@/components/AdminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${getAdminApiBaseUrl()}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error("The admin service returned an unexpected response.");
      }
      if (!response.ok || typeof result !== "object" || result === null) {
        throw new Error("Sign-in failed. Check your credentials and try again.");
      }
      if (
        !("success" in result) ||
        result.success !== true ||
        !("accessToken" in result) ||
        typeof result.accessToken !== "string" ||
        !("admin" in result) ||
        typeof result.admin !== "object" ||
        result.admin === null ||
        !("id" in result.admin) ||
        !("email" in result.admin)
      ) {
        throw new Error("The server returned an invalid sign-in response.");
      }

      signIn(result.accessToken, {
        id: String(result.admin.id),
        email: String(result.admin.email),
        role: "admin",
      });
      router.replace("/admin/dashboard");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to connect to the admin service.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-auth-wrap">
      <Link href="/" className="admin-brand">
        AURA <span>HUMANOID TECH</span>
      </Link>
      <section className="admin-panel glass-panel">
        <p className="badge">Enquiry management</p>
        <h1>Admin sign in</h1>
        <p className="text-muted-sm">
          Access is restricted to provisioned admin accounts.
        </p>
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="admin-email">Email address</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </button>
          <p className="enquiry-form-status error" role="alert" aria-live="polite">
            {error}
          </p>
        </form>
      </section>
    </div>
  );
}
