import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowUpRight, ArrowRight, Mail } from "lucide-react";
export default function ContactForm({
  demo = false,
  product,
}: {
  demo?: boolean;
  product?: string;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "prepared" | "error"
  >("idle");
  const [mail, setMail] = useState("");
  const [error, setError] = useState("");
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const fields = Object.fromEntries(new FormData(form));
    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
    if (!endpoint) {
      const subject = product
        ? `Datasheet request: ${product}`
        : demo
          ? "EnerMAN demo / technical proposal request"
          : "EnerMAN website enquiry";
      const body = Object.entries(fields)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");
      setMail(
        `mailto:sales@enerman.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      );
      setStatus("prepared");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          requestType: product ? "datasheet" : demo ? "demo" : "contact",
          product,
        }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true)
        throw Error(
          result.message ||
            "The request could not be submitted. Please contact sales@enerman.in.",
        );
      setStatus("sent");
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Please email sales@enerman.in.",
      );
      setStatus("error");
    }
  };
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      onChange={() => {
        if (status !== "sending") {
          setStatus("idle");
          setMail("");
        }
      }}
    >
      <div className="form-heading">
        <span className="mono">
          {product
            ? "PRODUCT DATASHEET"
            : demo
              ? "YOUR NEXT STEP"
              : "GET IN TOUCH"}
        </span>
        <h2>
          {product
            ? `${product} datasheet`
            : demo
              ? "Let’s talk solar."
              : "Start a conversation."}
        </h2>
        <p>
          {product
            ? "What it monitors, what it needs on site, what it reports. Full manual on request."
            : "Tell us about your plant and what you need."}
        </p>
      </div>
      <div className="form-grid">
        <label>
          {product ? "Name" : "First name"} <span>*</span>
          <input
            name={product ? "Name" : "First name"}
            autoComplete="given-name"
            required
            minLength={2}
            maxLength={100}
          />
        </label>
        {!product && (
          <label>
            Last name <span>*</span>
            <input
              name="Last name"
              autoComplete="family-name"
              required
              maxLength={100}
            />
          </label>
        )}
        <label className={product ? "" : "span-2"}>
          {product ? "Work email" : "Email"} <span>*</span>
          <input
            type="email"
            name="Email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        {product ? (
          <label>
            Plant size (MW) <span>*</span>
            <input
              type="number"
              min="0.001"
              step="any"
              name="Plant size (MW)"
              required
            />
          </label>
        ) : (
          <label className="span-2">
            Mobile number <span>*</span>
            <input
              type="tel"
              name="Mobile number"
              autoComplete="tel"
              pattern="[+0-9\(\) .\-]{7,25}"
              title="Enter a valid phone number (7–25 characters)."
              required
            />
          </label>
        )}
        {demo && (
          <>
            <label>
              Company name <span>*</span>
              <input
                name="Company name"
                autoComplete="organization"
                required
                maxLength={200}
              />
            </label>
            <label>
              Designation
              <input
                name="Designation"
                autoComplete="organization-title"
                maxLength={100}
              />
            </label>
          </>
        )}
        {!product && (
          <label className="span-2">
            {demo
              ? "Detailed description about your solar plant"
              : "Message details"}
            <textarea name="Message" rows={4} maxLength={5000} />
          </label>
        )}
      </div>
      <p className="form-note">
        {import.meta.env.VITE_CONTACT_ENDPOINT
          ? "Your request will be sent to EnerMAN."
          : "This form prepares an email to sales@enerman.in for you to review and send."}
      </p>
      <button className="button" type="submit" disabled={status === "sending"}>
        {status === "sending"
          ? "Sending…"
          : import.meta.env.VITE_CONTACT_ENDPOINT
            ? "Submit request"
            : "Prepare email request"}
        <ArrowRight size={18} />
      </button>
      <div className="form-status" role="status" aria-live="polite">
        {status === "prepared" && (
          <>
            <p>
              Your request is ready. Open your email app to review and send it.
            </p>
            <a className="text-button" href={mail}>
              <Mail size={17} />
              Open email app
              <ArrowUpRight size={16} />
            </a>
          </>
        )}
        {status === "sent" && <p>Thank you. Your request has been accepted.</p>}
        {status === "error" && <p className="error">{error}</p>}
      </div>
    </form>
  );
}
