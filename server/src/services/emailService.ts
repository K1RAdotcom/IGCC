import nodemailer from "nodemailer";

function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

export async function sendPasswordResetEmail(
  recipientEmail: string,
  resetUrl: string
) {
  const host = getRequiredEnv("SMTP_HOST");
  const user = getRequiredEnv("SMTP_USER");
  const password = getRequiredEnv("SMTP_PASS");
  const from = getRequiredEnv("MAIL_FROM");

  const port = Number(process.env.SMTP_PORT ?? "587");

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }

  const secure =
    process.env.SMTP_SECURE?.trim().toLowerCase() === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password,
    },
  });

  await transporter.sendMail({
    from,
    to: recipientEmail,
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
            href="${resetUrl}"
            style="display: inline-block; padding: 12px 18px; background: #0f5132; color: #ffffff; text-decoration: none; border-radius: 8px;"
          >
            Reset Password
          </a>
        </p>
        <p style="font-size: 14px; color: #64748b;">
          If the button does not work, copy and paste this link into your browser:
        </p>
        <p style="font-size: 14px; word-break: break-all;">
          ${resetUrl}
        </p>
        <p style="font-size: 14px; color: #64748b;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}