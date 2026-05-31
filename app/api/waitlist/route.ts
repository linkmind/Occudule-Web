import { getNotifyEmail, sendPostmarkEmail } from "@/lib/postmark";
import { isValidEmail, normalizeEmail } from "@/lib/validate-email";
import { NextResponse } from "next/server";

type WaitlistPayload = {
  email?: string;
  name?: string;
  website?: string;
};

function waitlistSignupText(email: string, name: string) {
  return [
    "New waitlist signup from occudule.com",
    "",
    `Email: ${email}`,
    `Name: ${name || "—"}`,
    `Submitted: ${new Date().toISOString()}`,
  ].join("\n");
}

async function notifyViaPostmark(email: string, name: string) {
  const notifyTo = process.env.WAITLIST_NOTIFY_EMAIL ?? getNotifyEmail();

  const teamSent = await sendPostmarkEmail({
    to: notifyTo,
    subject: `New Occudule waitlist signup: ${email}`,
    textBody: waitlistSignupText(email, name),
    replyTo: email,
  });

  if (!teamSent) return false;

  const greeting = name ? `Hi ${name},` : "Hi there,";
  await sendPostmarkEmail({
    to: email,
    subject: "You're on the Occudule waitlist",
    textBody: [
      greeting,
      "",
      "Thanks for joining the Occudule waitlist. We'll email you when early access opens—with founding-member pricing and a short guide to get started.",
      "",
      "Occudule helps busy parents triage school email, draft replies, and stay on top of family logistics without living in the inbox.",
      "",
      "Questions? Reply to this email or contact support@occudule.com.",
      "",
      "— The Occudule team",
      "Outvblue Technology Inc.",
    ].join("\n"),
  });

  return true;
}

async function notifyViaWebhook(email: string, name: string) {
  const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;
  if (!webhookUrl) return false;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      name: name || null,
      source: "occudule-web-waitlist",
      submittedAt: new Date().toISOString(),
    }),
  });

  return response.ok;
}

async function notifyViaFormspree(email: string, name: string) {
  const formId = process.env.FORMSPREE_WAITLIST_FORM_ID;
  if (!formId) return false;

  const response = await fetch(`https://formspree.io/f/${formId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      name: name || undefined,
      _subject: "Occudule waitlist signup",
    }),
  });

  return response.ok;
}

async function notifyViaResend(email: string, name: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const to = process.env.WAITLIST_NOTIFY_EMAIL ?? "support@occudule.com";
  const from =
    process.env.WAITLIST_FROM_EMAIL ?? "Occudule Waitlist <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `New Occudule waitlist signup: ${email}`,
      text: waitlistSignupText(email, name),
    }),
  });

  return response.ok;
}

export async function POST(request: Request) {
  let body: WaitlistPayload;

  try {
    body = (await request.json()) as WaitlistPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const email = normalizeEmail(body.email ?? "");
  const name = (body.name ?? "").trim().slice(0, 120);

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const delivered =
    (await notifyViaPostmark(email, name)) ||
    (await notifyViaWebhook(email, name)) ||
    (await notifyViaFormspree(email, name)) ||
    (await notifyViaResend(email, name));

  if (!delivered) {
    return NextResponse.json(
      {
        error:
          "Waitlist is not fully configured yet. Please email support@occudule.com to join.",
        fallbackMailto: true,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
