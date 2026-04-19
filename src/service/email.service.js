require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

/**
 * 1. Configure the Google OAuth2 Client
 */
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://google.com" // Ensure this matches your Google Cloud Console redirect URI
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  });

  try {
    // Request a fresh access token using the refresh token
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          reject("Failed to create access token: " + err.message);
        }
        resolve(token);
      });
    });

    // Create and return the Nodemailer transporter
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.error("Transporter Creation Error:", error);
    throw error;
  }
};

/**
 * 2. Internal function to execute the mail sending
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    // We await the creation of the transporter to ensure the token is valid
    const transporter = await createTransporter();

    const info = await transporter.sendMail({
      from: `"Secure Bank" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('✅ Email sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error in sendEmail function:', error);
    throw error; 
  }
};

/**
 * 3. Exported function used in your Registration Controller
 */
async function sendRegistrationMail(userEmail, name) {
  try {
    const subject = "Welcome to Secure Bank – Your account is ready!";

    const text = `Hi ${name},

Welcome to Secure Bank! We are thrilled to have you with us. Your account has been successfully created.

To get started, please log in to your dashboard to set up your security preferences and explore our features.

Best regards,
The Secure Bank Team.`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1a73e8; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0;">Secure Bank</h1>
      </div>
      <div style="padding: 30px; line-height: 1.6; color: #333333;">
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for choosing <strong>Secure Bank</strong>. We’re excited to help you manage your finances with peace of mind.</p>
        <p>Your registration is complete. You can now access your online banking portal to:</p>
        <ul>
          <li>View your balance in real-time</li>
          <li>Set up multi-factor authentication</li>
          <li>Transfer funds securely</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://Sucurebank.com" style="background-color: #1a73e8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to Your Account</a>
        </div>
      </div>
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 0.8em; color: #888888;">
        &copy; ${new Date().getFullYear()} Secure Bank Inc.
      </div>
    </div>`;

    await sendEmail(userEmail, subject, text, html);
  } catch (error) {
    console.error('❌ sendRegistrationMail failed:', error);
    // We throw the error so the controller knows the email failed
    throw error; 
  }
}

module.exports = {
  sendRegistrationMail
};
