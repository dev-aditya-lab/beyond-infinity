import { Resend } from "resend";
import { config } from "../../config/config.js";

const resend = new Resend(config.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verifyLink = `${config.CLIENT_URL}/verify/${token}`;

  try {
    await resend.emails.send({
      from: "Your App <onboarding@resend.dev>", // Replace with your verified domain in production
      to: email,
      subject: "Confirm your email address",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 40px; border: 1px solid #e0e0e0; border-radius: 8px; }
            .logo { font-size: 24px; font-weight: bold; color: #4F46E5; margin-bottom: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #4F46E5; 
              color: #ffffff !important; 
              text-decoration: none; 
              border-radius: 5px; 
              font-weight: 600;
              margin: 20px 0;
            }
            .footer { font-size: 12px; color: #888; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
            .link-alt { word-break: break-all; color: #4F46E5; font-size: 13px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">YourApp</div>
            <h2>Verify your email address</h2>
            <p>Thanks for signing up! To get started, please confirm your email address by clicking the button below.</p>
            
            <a href="${verifyLink}" class="button">Confirm Email Address</a>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p class="link-alt">${verifyLink}</p>
            
            <div class="footer">
              <p>This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
              <p>&copy; ${new Date().getFullYear()} YourApp Inc. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Email delivery failed");
  }
};
