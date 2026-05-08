require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

module.exports = transporter;

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Vertex Bank" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

//Registration Email service
async function sendingRegistrationEmail(userEmail, name) {
    const subject = "Welcome to Vertex Bank!";

    const text = `Hi ${name}, your registration was successful.`;

    const html = `
        <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #2c3e50;">Account Registration Successful</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Welcome to Vertex Bank! Your digital profile is now active.</p>
            <ul>
                <li><strong>Username:</strong> ${name}</li>
                <li><strong>Status:</strong> Active</li>
            </ul>
            <p style="color: #e74c3c;"><strong>Security Reminder:</strong> Never share your password or OTP with anyone.</p>
            <p>Best regards,<br>The Vertex Bank Team</p>
        </div>`;

    //to trigger the email sending
    await sendEmail(userEmail, subject, text, html);

}

//Login Email Service

async function sendingLoginEmail(userEmail, name) {
    const subject = "Login Successfull - Vertex Bank";
    const text = `Hi ${name}, a new login was detected on your Vertex Bank account at  ${Date.now()}.`;

    const html = `
<div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px;">
  <h2 style="color: #2c3e50;">Security Alert: New Login</h2>
  <p>Hi <strong>${name}</strong>,</p>
  <p>Your  account login suceessfully!</p>

  <p>If this was you, you can safely ignore this email. If you do not recognize this activity, please <strong>freeze your account</strong> immediately via our mobile app.</p>
  
  <p style="color: #e74c3c;"><strong>Security Reminder:</strong> Our team will never ask for your password over email or phone.</p>
  
  <p>Best regards,<br>The Vertex Bank Team</p>
</div>`;

    // trigger the email sending
    await sendEmail(userEmail, subject, text, html);
}



module.exports = {
    sendingRegistrationEmail,
    sendingLoginEmail
};

