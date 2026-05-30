type PostmarkEmailOptions = {
  to: string;
  subject: string;
  textBody: string;
  replyTo?: string;
};

export async function sendPostmarkEmail(options: PostmarkEmailOptions): Promise<boolean> {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  const from = process.env.POSTMARK_FROM_EMAIL;
  if (!token || !from) return false;

  const response = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": token,
    },
    body: JSON.stringify({
      From: from,
      To: options.to,
      Subject: options.subject,
      TextBody: options.textBody,
      ReplyTo: options.replyTo,
      MessageStream: process.env.POSTMARK_MESSAGE_STREAM ?? "outbound",
    }),
  });

  return response.ok;
}

export function getNotifyEmail(): string {
  return (
    process.env.CONTACT_NOTIFY_EMAIL ??
    process.env.WAITLIST_NOTIFY_EMAIL ??
    "support@occudule.com"
  );
}
