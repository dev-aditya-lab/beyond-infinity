import { Resend } from "resend";
import { ENV } from "../../config/env.config.js";

/**
 * Initialize Resend
 */
const resend = new Resend(ENV.MAIL.API_KEY);

/**
 * Send Email Service
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Basic validation
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

    console.log(`📧 Email sent to ${to}`);

    return {
      success: true,
      id: response?.data?.id || null,
    };
  } catch (error) {
    console.error("❌ Email Error:", error.message);

    return {
      success: false,
      error: error.message,
    };
  }
};
