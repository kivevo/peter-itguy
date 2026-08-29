// server.js - Local Express API server for Resend Email handling
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Resend Email Endpoint
app.post("/api/send-email", async (req, res) => {
  const { to, from, subject, html, text, replyTo, apiKey, name, email, message } = req.body || {};

  const activeApiKey = apiKey || process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

  if (!activeApiKey) {
    return res.status(400).json({
      success: false,
      error: "No Resend API Key configured. Please enter your Resend API Key in Admin Settings or set RESEND_API_KEY in .env",
    });
  }

  const resend = new Resend(activeApiKey);

  const recipientTo = to || "xkivevo@gmail.com";
  const senderFrom = from || "Peter Kivevo <onboarding@resend.dev>";
  const emailSubject = subject || (name ? `New message from ${name}` : "New Website Notification");
  const emailHtml = html || `
    <h2>New Website Inquiry</h2>
    <p><strong>Name:</strong> ${name || "Visitor"}</p>
    <p><strong>Email:</strong> ${email || "Not provided"}</p>
    <p><strong>Message:</strong> ${message || "No text provided."}</p>
  `;

  try {
    const data = await resend.emails.send({
      from: senderFrom,
      to: Array.isArray(recipientTo) ? recipientTo : [recipientTo],
      subject: emailSubject,
      html: emailHtml,
      text: text || undefined,
      reply_to: replyTo || (email ? email : undefined),
    });

    console.log(`[Resend Server] Email successfully sent to ${recipientTo}:`, data);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    const errMsg = error?.message || String(error);
    console.error("[Resend Server Error]:", errMsg);
    return res.status(500).json({ success: false, error: errMsg });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 [Resend Email Server] Listening on http://localhost:${PORT}`);
});
