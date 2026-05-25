import nodemailer from "nodemailer";

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

export const sendMail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html
  });
};

export const sendPasswordResetOtp = async ({ to, name, otp }) => {
  await sendMail({
    to,
    subject: "StudyHub password reset OTP",
    text: `Hello ${name}, your StudyHub password reset OTP is ${otp}. It expires soon.`,
    html: `<p>Hello ${name},</p><p>Your StudyHub password reset OTP is <strong>${otp}</strong>.</p><p>This OTP expires soon.</p>`
  });
};

export const sendEmailVerificationOtp = async ({ to, name, otp }) => {
  await sendMail({
    to,
    subject: "Verify your StudyHub account",
    text: `Hello ${name}, your StudyHub verification OTP is ${otp}. It expires soon.`,
    html: `<p>Hello ${name},</p><p>Your StudyHub verification OTP is <strong>${otp}</strong>.</p><p>Enter this code to activate your account.</p>`
  });
};
