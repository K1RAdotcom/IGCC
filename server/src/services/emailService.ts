import nodemailer from "nodemailer";

/*
 * Password-reset email.
 *
 * Two providers are supported; SMTP wins if it is configured:
 *   1. SMTP  - SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_FROM
 *              (optional: SMTP_PORT, default 587; SMTP_SECURE=true for 465).
 *              Works with Gmail (use an App Password) and can send to any
 *              address without owning a domain.
 *   2. Resend - RESEND_API_KEY, MAIL_FROM (needs a verified domain to send
 *              to anyone other than the account owner).
 */

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildResetEmail(resetUrl: string) {
  const safeUrl = escapeHtml(resetUrl);

  return {
    subject: "IGCC password reset",
    text: [
      "We received a request to reset your IGCC account password.",
      "",
      "Use the link below to choose a new password:",
      resetUrl,
      "",
      "This link expires in 1 hour.",
      "If you did not request a password reset, you can safely ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto;">
        <h2 style="margin-bottom: 16px;">IGCC password reset</h2>
        <p>We received a request to reset your IGCC account password.</p>
        <p>
          Use the button below to choose a new password. This link expires in 1 hour.
        </p>
        <p style="margin: 24px 0;">
          <a
            href="${safeUrl}"
            style="display: inline-block; padding: 12px 18px; background: #0f5132; color: #ffffff; text-decoration: none; border-radius: 8px;"
          >
            Reset Password
          </a>
        </p>
        <p style="font-size: 14px; color: #64748b;">
          If the button does not work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; word-break: break-all;">
          ${safeUrl}
        </p>
        <p style="font-size: 14px; color: #64748b;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  };
}

type ResetEmail = ReturnType<typeof buildResetEmail>;

async function sendWithSmtp(recipientEmail: string, message: ResetEmail) {
  const host = getRequiredEnv("SMTP_HOST");
  const user = getRequiredEnv("SMTP_USER");
  const password = getRequiredEnv("SMTP_PASS");
  const from = process.env.MAIL_FROM?.trim() || user;

  const port = Number(process.env.SMTP_PORT?.trim() || "587");

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  const secure =
    process.env.SMTP_SECURE?.trim().toLowerCase() === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass: password },
    // Keep a stuck mail server from holding the request open.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  await transporter.sendMail({
    from,
    to: recipientEmail,
    subject: message.subject,
    text: message.text,
    html: message.html,
  });
}

async function sendWithResend(recipientEmail: string, message: ResetEmail) {
  const apiKey = getRequiredEnv("RESEND_API_KEY");

  const from = process.env.MAIL_FROM?.trim() || "onboarding@resend.dev";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [recipientEmail],
      subject: message.subject,
      text: message.text,
      html: message.html,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMessage =
      result?.message ||
      result?.error ||
      `Resend email request failed with status ${response.status}.`;

    throw new Error(errorMessage);
  }
}

export async function sendPasswordResetEmail(
  recipientEmail: string,
  resetUrl: string
) {
  const message = buildResetEmail(resetUrl);

  if (process.env.SMTP_HOST?.trim()) {
    return sendWithSmtp(recipientEmail, message);
  }

  if (process.env.RESEND_API_KEY?.trim()) {
    return sendWithResend(recipientEmail, message);
  }

  throw new Error(
    "Email is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS and MAIL_FROM (or RESEND_API_KEY)."
  );
}
