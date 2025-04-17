const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.RESET_EMAIL,
    pass: process.env.RESET_EMAIL_PASSWORD,
  },
});

/**
 * @param {string} toEmail
 * @param {string} link 
 */

const sendResetEmail = async (toEmail, link) => {
  await transporter.sendMail({
    from: `"ForzaHub Support" <${process.env.RESET_EMAIL}>`,
    to: toEmail,
    subject: "Reset Your ForzaHub Password",
    html: `
      <p>Hello,</p>
      <p>You requested to reset your password. Click the link below:</p>
      <a href="${link}">${link}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn’t request this, just ignore it.</p>
      <br/>
      <p>– ForzaHub Team</p>
    `,
  });
};

module.exports = { sendResetEmail };
