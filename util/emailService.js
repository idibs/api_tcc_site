// utils/emailService.js
import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("SMTP LOGIN =", process.env.MAILGUN_SMTP_LOGIN);
console.log("SMTP PASSWORD =", process.env.MAILGUN_SMTP_PASSWORD);

const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST || "smtp.mailgun.org",
  port: Number(process.env.MAILGUN_SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD,
  },
});

export async function sendVerificationEmail(toEmail, code) {
  const mailOptions = {
    from: process.env.MAIL_FROM, // ex: "Minha Loja <no-reply@seu-dominio.com>"
    to: toEmail,
    subject: "Código de verificação",
    html: `<p>Seu código de verificação é: <strong>${code}</strong></p>
           <p>Ele expira em 15 minutos.</p>`,
  };

  return transporter.sendMail(mailOptions);
}
