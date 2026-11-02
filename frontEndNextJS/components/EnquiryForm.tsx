"use client";

import { useRef, useState, type FormEvent } from "react";

type EnquiryFormValues = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  eventDate: string;
  eventLocation: string;
  message: string;
};

const initialValues: EnquiryFormValues = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  eventDate: "",
  eventLocation: "",
  message: "",
};

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api"
).replace(/\/+$/, "");

export function EnquiryForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const update =
    (field: keyof EnquiryFormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setValues((current) => ({ ...current, [field]: event.target.value }));
      if (status) setStatus("");
    };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setStatus("");

    try {
      const payload = Object.fromEntries(
        Object.entries(values).filter(([, value]) => value.trim() !== ""),
      );
      const response = await fetch(`${apiBaseUrl}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The enquiry service returned an unexpected response. Your information is still here; please try again.",
        );
      }
      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("success" in result) ||
        result.success !== true
      ) {
        let message = "We couldn’t submit your enquiry. Please try again.";
        if (typeof result === "object" && result !== null && "message" in result) {
          if (typeof result.message === "string") message = result.message;
        }
        throw new Error(message);
      }

      setValues(initialValues);
      setIsError(false);
      setStatus("Your enquiry has been received by AURA HUMANOID TECH.");
    } catch (error) {
      setIsError(true);
      setStatus(
        error instanceof Error
          ? error.message
          : "We couldn’t connect to the enquiry service. Your information is still here; please try again.",
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <div className="enquiry-form-panel glass-panel">
      <div className="enquiry-form-heading">
        <span className="badge">Start a conversation</span>
        <h3>Tell us about your event</h3>
        <p className="text-muted-sm">
          Share a few details and our team can follow up about your enquiry.
        </p>
      </div>
      <form className="enquiry-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="enquiry-name">Full name *</label>
            <input
              id="enquiry-name"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              value={values.name}
              onChange={update("name")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="enquiry-email">Email address *</label>
            <input
              id="enquiry-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={values.email}
              onChange={update("email")}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="enquiry-phone">Phone / WhatsApp</label>
            <input
              id="enquiry-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              maxLength={40}
              value={values.phone}
              onChange={update("phone")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="enquiry-company">Company / organization</label>
            <input
              id="enquiry-company"
              name="company"
              autoComplete="organization"
              maxLength={120}
              value={values.company}
              onChange={update("company")}
            />
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="enquiry-service">Service interested in</label>
            <select
              id="enquiry-service"
              name="service"
              value={values.service}
              onChange={update("service")}
            >
              <option value="">Select a service</option>
              <option>Corporate Events</option>
              <option>Product Launches</option>
              <option>Expos &amp; Trade Fairs</option>
              <option>VIP Weddings &amp; Private Events</option>
              <option>STEM &amp; Education</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="enquiry-date">Event date</label>
            <input
              id="enquiry-date"
              name="eventDate"
              type="date"
              value={values.eventDate}
              onChange={update("eventDate")}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="enquiry-location">Event location</label>
          <input
            id="enquiry-location"
            name="eventLocation"
            maxLength={160}
            value={values.eventLocation}
            onChange={update("eventLocation")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="enquiry-message">Message / requirements *</label>
          <textarea
            id="enquiry-message"
            name="message"
            required
            minLength={1}
            maxLength={5000}
            rows={5}
            value={values.message}
            onChange={update("message")}
          />
        </div>

        <button
          className="btn btn-primary enquiry-submit"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Enquiry"}
        </button>
        <p
          className={`enquiry-form-status${isError ? " error" : " success"}`}
          role={isError ? "alert" : "status"}
          aria-live={isError ? "assertive" : "polite"}
          aria-atomic="true"
        >
          {status}
        </p>
      </form>
    </div>
  );
}
