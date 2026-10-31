require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Error connecting to email server:", error);
  } else {
    console.log("Email server is ready to send messages");
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger";

  const text =
    `Hello ${name},\n\n` +
    `Thank you for registering at Backend Ledger. We're excited to have you on board!\n\n` +
    `Best regards,\nThe Backend Ledger Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #1e293b; margin-top: 0;">Welcome to Backend Ledger</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="margin-bottom: 0;">Best regards,<br><strong>The Backend Ledger Team</strong></p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(
  userEmail,
  name,
  amount,
  toAccount,
  timestamp = new Date(),
) {
  // Format date and time in IST (Asia/Kolkata)
  const formattedTimestamp = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(timestamp);

  const subject = `Transaction Alert: ₹${amount} Transferred`;

  const text =
    `Hello ${name},\n\n` +
    `Your transfer of ₹${amount} to account ${toAccount} has been successfully processed.\n\n` +
    `Date & Time: ${formattedTimestamp}\n\n` +
    `If you did not initiate this transaction, please contact our support team immediately.\n\n` +
    `Best regards,\nThe Backend Ledger Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #0f172a; margin-top: 0;">Transaction Confirmation</h2>
      <p>Hello,</p>
      <p>Your transfer of <strong style="color: #059669;">₹${amount}</strong> to account <strong>${toAccount}</strong> has been successfully processed.</p>
      
      <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #475569;">
          <strong>Date & Time:</strong> ${formattedTimestamp}
        </p>
      </div>

      <p style="font-size: 13px; color: #dc2626;">If you did not initiate this transaction, please contact our support team immediately.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="margin-bottom: 0;">Best regards,<br><strong>The Backend Ledger Team</strong></p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(
  userEmail,
  name,
  amount,
  toAccount,
  timestamp = new Date(),
) {
  // Format date and time in IST (Asia/Kolkata)
  const formattedTimestamp = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(timestamp);

  const subject = `Transaction Failed: ₹${amount}`;

  const text =
    `Hello ${name},\n\n` +
    `Your transfer of ₹${amount} to account ${toAccount} could not be processed.\n\n` +
    `Date & Time: ${formattedTimestamp}\n\n` +
    `If you have any questions or need assistance, please contact our support team.\n\n` +
    `Best regards,\nThe Backend Ledger Team`;

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #dc2626; margin-top: 0;">Transaction Failed</h2>
      <p>Hello,</p>
      <p>Your transfer of <strong style="color: #0f172a;">₹${amount}</strong> to account <strong>${toAccount}</strong> could not be processed.</p>
      
      <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #475569;">
          <strong>Date & Time:</strong> ${formattedTimestamp}
        </p>
      </div>

      <p style="font-size: 13px; color: #475569;">If you have any questions or need assistance, please contact our support team.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
      <p style="margin-bottom: 0;">Best regards,<br><strong>The Backend Ledger Team</strong></p>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransactionEmail,
  sendTransactionFailureEmail,
};
