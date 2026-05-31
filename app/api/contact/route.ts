import { getNotifyEmail, sendPostmarkEmail } from "@/lib/postmark";
import { isValidEmail, normalizeEmail } from "@/lib/validate-email";
import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string;
};

const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;
const MAX_NAME = 120;

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const email = normalizeEmail(body.email ?? "");
  const name = (body.name ?? "").trim().slice(0, MAX_NAME);
  const subject = (body.subject ?? "").trim().slice(0, MAX_SUBJECT);
  const message = (body.message ?? "").trim().slice(0, MAX_MESSAGE);

  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!subject) {
    return NextResponse.json({ error: "Please enter a subject." }, { status: 400 });
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Please enter a message of at least 10 characters." },
      { status: 400 },
    );
  }

  const sent = await sendPostmarkEmail({
    to: getNotifyEmail(),
    subject: `Occudule contact: ${subject}`,
    replyTo: email,
    textBody: [
      "New message from occudule.com/contact",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      "",
      "Message:",
      message,
      "",
      `Submitted: ${new Date().toISOString()}`,
    ].join("\n"),
  });

  if (!sent) {
    return NextResponse.json(
      {
        error:
          "We could not send your message right now. Please email support@occudule.com directly.",
        fallbackMailto: true,
      },
      { status: 503 },
    );
  }

  await sendPostmarkEmail({
    to: email,
    subject: "We received your message — Occudule",
    textBody: [
      `Hi ${name},`,
      "",
      "Thanks for contacting Occudule. We've received your message and will get back to you as soon as we can—usually within one business day.",
      "",
      "For urgent help, you can also use live chat on our Contact page when available.",
      "",
      "— The Occudule team",
      "Outvblue Technology Inc.",
    ].join("\n"),
  });

  return NextResponse.json({ ok: true });
}
