import { Resend } from "resend";
import { ENV } from "../../config/env.config.js";

/**
 * Initialize Resend
 */
if (!ENV.MAIL?.API_KEY) {
  throw new Error("Resend API key missing in ENV");
}

const resend = new Resend(ENV.MAIL.API_KEY);

/**
 * Send Generic Email
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    if (!to || !subject) {
      throw new Error("Missing required fields: to, subject");
    }

    if (!html && !text) {
      throw new Error("Email must contain either text or html");
    }

    const response = await resend.emails.send({
      from: ENV.MAIL.FROM,
      to,
      subject,
      text,
      html,
    });

    console.log(`📧 Email sent to ${to} | ID: ${response?.data?.id}`);

    return {
      success: true,
      message: "Email sent successfully",
      id: response?.data?.id || null,
    };
  } catch (error) {
    console.error("❌ Email Error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * OTP EMAIL HELPER
 */
export const sendOTPEmail = async (to, otp) => {
  const subject = "Your OTP Code";

  const html = `
    <div style="font-family: Arial, sans-serif;">
      <h2>🔐 OTP Verification</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This OTP will expire in <b>5 minutes</b>.</p>
      <p>If you didn't request this, ignore this email.</p>
    </div>
  `;

  return sendEmail({ to, subject, html });
};
