"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { isValidEmail } from "@/lib/validate-email";

type FormStatus = "idle" | "loading" | "success" | "error";

const inputClassName =
  "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-accent/40 focus:ring-2 focus:ring-accent/20 disabled:opacity-60";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          website: formData.get("website"),
        }),
      });

      const data = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data.error ?? "Something went wrong. Please try again or email us directly.",
        );
        return;
      }

      setSubmittedEmail(email);
      setStatus("success");
      setEmail("");
      setName("");
    } catch {
      setStatus("error");
      setErrorMessage(
        "We could not submit your request. Please email support@occudule.com to join the waitlist.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className="glass-card border-success/30 bg-success/10 p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-lg font-semibold text-white">You&apos;re on the list!</p>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Thanks for joining. We&apos;ll reach out at{" "}
          <span className="font-medium text-white">{submittedEmail}</span> when early access
          opens—usually with founding-member pricing and a short onboarding guide.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-accent underline decoration-accent/30 underline-offset-2 transition hover:text-white hover:decoration-white/50"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8" noValidate>
      <p className="text-xs font-medium tracking-wide text-white/45">[ JOIN THE WAITLIST ]</p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-white">Save your spot</h2>
      <p className="mt-2 text-sm text-white/55">
        We&apos;ll email you when early access opens.
      </p>

      <div className="sr-only" aria-hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-6">
        <label htmlFor="waitlist-email" className="block text-sm font-medium text-white/80">
          Email address <span className="text-cta">*</span>
        </label>
        <input
          id="waitlist-email"
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
        <label htmlFor="waitlist-name" className="block text-sm font-medium text-white/80">
          First name <span className="font-normal text-white/45">(optional)</span>
        </label>
        <input
          id="waitlist-name"
          name="name"
          type="text"
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Alex"
          className={inputClassName}
          disabled={status === "loading"}
        />
      </div>

      {status === "error" && errorMessage ? (
        <p className="mt-4 text-sm text-cta" role="alert">
          {errorMessage}{" "}
          <a
            href="mailto:support@occudule.com?subject=Occudule%20waitlist"
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
        {status === "loading" ? "Joining…" : "Join the waitlist"}
      </button>

      <p className="mt-4 text-xs leading-relaxed text-white/45">
        No spam—just launch updates and early access. By joining, you agree to our{" "}
        <Link
          href="/privacy"
          className="text-white/60 underline underline-offset-2 transition hover:text-accent"
        >
          Privacy Policy
        </Link>
        . You can unsubscribe anytime.
      </p>
    </form>
  );
}
