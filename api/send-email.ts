// api/send-email.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, from, subject, html, text, replyTo, apiKey, name, email, message } = req.body || {};

  const activeApiKey = apiKey || process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;

  if (!activeApiKey) {
    return res.status(400).json({ 
      success: false, 
      error: "No Resend API Key configured. Please set RESEND_API_KEY environment variable or supply apiKey in request." 
    });
  }

  const resend = new Resend(activeApiKey);

  // If simple contact form format was sent
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
    const result = await resend.emails.send({
      from: senderFrom,
      to: Array.isArray(recipientTo) ? recipientTo : [recipientTo],
      subject: emailSubject,
      html: emailHtml,
      text: text || undefined,
      replyTo: replyTo || (email ? email : undefined),
    });

    if (result.error) {
      const errMsg = result.error.message || "Failed to send email via Resend.";
      console.error("Resend API rejected email:", errMsg);
      return res.status(400).json({ success: false, error: errMsg });
    }

    return res.status(200).json({ success: true, id: result.data?.id, data: result.data });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("Resend server error:", errMessage);
    return res.status(500).json({ success: false, error: errMessage });
  }
}
