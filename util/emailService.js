// utils/emailService.js
import dotenv from "dotenv";
dotenv.config();

import formData from "form-data";
import Mailgun from "mailgun.js";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;
const MAIL_FROM = process.env.MAIL_FROM; // ex: "Minha Loja <no-reply@seu-dominio.com>"

if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !MAIL_FROM) {
  console.warn(
    "Mailgun configuration missing. Please set MAILGUN_API_KEY, MAILGUN_DOMAIN and MAIL_FROM in your .env"
  );
}

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: "api", key: MAILGUN_API_KEY });

export async function sendVerificationEmail(toEmail, code) {
  try {
    const data = await mg.messages.create(MAILGUN_DOMAIN, {
      from: MAIL_FROM,
      to: toEmail,
      subject: "Código de verificação",
      html: `<p>Seu código de verificação é: <strong>${code}</strong></p><p>Ele expira em 15 minutos.</p>`,
    });

    return data; // Mailgun returns an object with id and message
  } catch (err) {
    const message = err?.message || err?.toString() || err;
    throw new Error(`Mailgun SDK send error: ${JSON.stringify(message)}`);
  }
}
