const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for others
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send OTP email for account verification
 */
const sendOtpEmail = async ({ to, name, otp }) => {
  const transporter = createTransporter();

  const html = `
    <div style="font-family: Arial, sans-serif; background:#001F3D; padding:40px; border-radius:12px; max-width:520px; margin:auto;">
      <h1 style="color:#ED985F; text-align:center; margin:0 0 8px;">🍽️ Mess Collect</h1>
      <p style="color:#ccc; text-align:center; margin:0 0 30px; font-size:14px;">Hostel Mess Fee Management</p>
      <div style="background:rgba(255,255,255,0.07); border-radius:10px; padding:30px;">
        <h2 style="color:#fff; margin-top:0;">Hello, ${name}!</h2>
        <p style="color:#ccc;">Your OTP for account verification is:</p>
        <div style="background:#ED985F; border-radius:8px; padding:18px; text-align:center; margin:20px 0;">
          <span style="font-size:36px; font-weight:bold; color:#001F3D; letter-spacing:10px;">${otp}</span>
        </div>
        <p style="color:#ccc;">This OTP will expire in <strong style="color:#F7B980;">5 minutes</strong>.</p>
        <p style="color:#ccc; font-size:13px;">If you did not request this, please ignore this email.</p>
      </div>
      <p style="color:#555; text-align:center; font-size:12px; margin-top:20px;">© 2025 Mess Collect. All rights reserved.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Mess Collect" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🔐 Your Mess Collect OTP Verification Code',
      html,
    });
  } catch (error) {
    console.error('----------------------------------------------------');
    console.error('⚠️ EMAIL SENDING FAILED (Likely invalid credentials)');
    console.error('⚠️ MOCKING OTP DELIVERY FOR DEVELOPMENT PURPOSE:');
    console.error(`➡️ YOUR OTP FOR ${to} IS: ${otp}`);
    console.error('----------------------------------------------------');
  }
};

/**
 * Send receipt email after successful payment
 */
const sendReceiptEmail = async ({ to, receiptHtml, studentName, month, year }) => {
  const transporter = createTransporter();

  try {
    await transporter.sendMail({
      from: `"Mess Collect" <${process.env.EMAIL_USER}>`,
      to,
      subject: `✅ Mess Fee Payment Receipt – ${month} ${year}`,
      html: receiptHtml,
    });
  } catch (error) {
    console.error('----------------------------------------------------');
    console.error('⚠️ RECEIPT EMAIL SENDING FAILED (Likely invalid credentials or offline)');
    console.error('⚠️ ERROR:', error.message);
    console.error('----------------------------------------------------');
  }
};

module.exports = { sendOtpEmail, sendReceiptEmail };
