"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { isValidEmail } from "@/lib/validate-email";

type FormStatus = "idle" | "loading" | "success" | "error";

const inputClassName =
  "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-accent/40 focus:ring-2 focus:ring-accent/20 disabled:opacity-60";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!name.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!subject.trim()) {
      setStatus("error");
      setErrorMessage("Please enter a subject.");
      return;
    }

    if (message.trim().length < 10) {
      setStatus("error");
      setErrorMessage("Please enter a message of at least 10 characters.");
      return;
    }

    setStatus("loading");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          website: formData.get("website"),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data.error ?? "Something went wrong. Please try again or email us directly.",
        );
        return;
      }

      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMessage(
        "We could not send your message. Please email support@occudule.com directly.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="glass-card border-success/30 bg-success/10 p-8"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg font-semibold text-white">Message sent</p>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Thanks for reaching out. We&apos;ve received your message and sent a confirmation to your
          inbox. Our team will reply as soon as we can.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white hover:decoration-white/50"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      id="contact-form-heading"
      onSubmit={handleSubmit}
      className="glass-card p-6 md:p-8"
      noValidate
    >
      <p className="text-xs font-medium tracking-wide text-white/45">[ SEND A MESSAGE ]</p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">Contact form</h2>
      <p className="mt-2 text-sm text-white/55">We typically respond within one business day.</p>

      <div className="sr-only" aria-hidden>
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <label htmlFor="contact-name" className="block text-sm font-medium text-white/80">
          Name <span className="text-cta">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className={inputClassName}
          disabled={status === "loading"}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="contact-email" className="block text-sm font-medium text-white/80">
          Email <span className="text-cta">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={inputClassName}
          disabled={status === "loading"}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="contact-subject" className="block text-sm font-medium text-white/80">
          Subject <span className="text-cta">*</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="How can we help?"
          className={inputClassName}
          disabled={status === "loading"}
        />
      </div>

      <div className="mt-5">
        <label htmlFor="contact-message" className="block text-sm font-medium text-white/80">
          Message <span className="text-cta">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us a bit about your question or feedback…"
          className={`${inputClassName} min-h-[8rem] resize-y`}
          disabled={status === "loading"}
        />
      </div>

      {status === "error" && errorMessage ? (
        <p className="mt-4 text-sm text-cta" role="alert">
          {errorMessage}{" "}
          <a
            href="mailto:support@occudule.com"
            className="font-medium text-white underline underline-offset-2 hover:text-accent"
          >
            Email us instead
          </a>
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 w-full rounded-full bg-cta px-6 py-3.5 text-base font-semibold text-white shadow-md transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-white/45">
        By submitting, you agree that we may use your details to respond. See our{" "}
        <Link
          href="/privacy"
          className="text-white/60 underline underline-offset-2 transition hover:text-accent"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
