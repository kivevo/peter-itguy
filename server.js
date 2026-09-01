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

// M-Pesa Helper functions
function formatKenyanPhone(phone) {
  let clean = String(phone).replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) clean = "254" + clean.slice(1);
  else if (clean.length === 9 && (clean.startsWith("7") || clean.startsWith("1"))) clean = "254" + clean;
  return clean;
}

function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// M-Pesa STK Push Endpoint
app.post("/api/mpesa-stk", async (req, res) => {
  try {
    const {
      phone,
      amount,
      accountReference = "Krenovate Systems",
      transactionDesc = "IT Services Payment",
      consumerKey: customKey,
      consumerSecret: customSecret,
      passkey: customPasskey,
      shortcode: customShortcode,
      environment: customEnv,
      callbackUrl: customCallback,
    } = req.body || {};

    if (!phone || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, error: "Valid phone and amount required." });
    }

    const formattedPhone = formatKenyanPhone(phone);
    const envMode = customEnv || process.env.MPESA_ENV || "sandbox";
    const isProd = envMode === "production";

    const consumerKey = customKey || process.env.MPESA_CONSUMER_KEY || (isProd ? "" : "g7zYFf6eKzK1xAqT00d0XhQJb26qG4O1");
    const consumerSecret = customSecret || process.env.MPESA_CONSUMER_SECRET || (isProd ? "" : "8z8n6d8d9f10d938");
    const shortcode = customShortcode || process.env.MPESA_SHORTCODE || (isProd ? "3053097" : "174379");
    const passkey = customPasskey || process.env.MPESA_PASSKEY || (isProd ? "" : "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919");

    if (isProd && (!consumerKey || !consumerSecret || !passkey)) {
      return res.status(400).json({
        success: false,
        error: "Production M-Pesa credentials missing. Set MPESA_CONSUMER_KEY and MPESA_PASSKEY.",
      });
    }

    const baseUrl = isProd ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
    const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${authHeader}` },
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return res.status(401).json({ success: false, error: `Daraja Auth Failed: ${err}` });
    }

    const { access_token } = await tokenRes.json();
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
    const callbackUrl = customCallback || `https://peter-itguy-mu.vercel.app/api/mpesa-callback`;

    const isTill = shortcode.length >= 6 && (shortcode.startsWith("3") || shortcode.startsWith("8"));
    const transactionType = isTill ? "CustomerBuyGoodsOnline" : "CustomerPayBillOnline";

    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: transactionType,
      Amount: Math.round(Number(amount)),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: accountReference.slice(0, 12),
      TransactionDesc: transactionDesc.slice(0, 30),
    };

    const stkRes = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const stkData = await stkRes.json();
    if (!stkRes.ok || stkData.ResponseCode !== "0") {
      return res.status(400).json({ success: false, error: stkData.errorMessage || stkData.ResponseDescription || "Rejected by Safaricom." });
    }

    return res.status(200).json({
      success: true,
      checkoutRequestId: stkData.CheckoutRequestID,
      merchantRequestId: stkData.MerchantRequestID,
      responseCode: stkData.ResponseCode,
      responseDescription: stkData.ResponseDescription,
      customerMessage: stkData.CustomerMessage,
      phone: formattedPhone,
      amount: Math.round(Number(amount)),
      timestamp,
      environment: envMode,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || String(error) });
  }
});

// M-Pesa Query Endpoint
app.post("/api/mpesa-query", async (req, res) => {
  try {
    const { checkoutRequestId, environment: customEnv } = req.body || {};
    if (!checkoutRequestId) return res.status(400).json({ success: false, error: "CheckoutRequestID required." });

    const envMode = customEnv || process.env.MPESA_ENV || "sandbox";
    const isProd = envMode === "production";
    const consumerKey = process.env.MPESA_CONSUMER_KEY || (isProd ? "" : "g7zYFf6eKzK1xAqT00d0XhQJb26qG4O1");
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET || (isProd ? "" : "8z8n6d8d9f10d938");
    const shortcode = process.env.MPESA_SHORTCODE || (isProd ? "3053097" : "174379");
    const passkey = process.env.MPESA_PASSKEY || (isProd ? "" : "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919");

    const baseUrl = isProd ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";
    const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    const tokenRes = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: { Authorization: `Basic ${authHeader}` },
    });

    if (!tokenRes.ok) return res.status(401).json({ success: false, error: "Auth failed." });
    const { access_token } = await tokenRes.json();
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const queryRes = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    const queryData = await queryRes.json();
    return res.status(200).json({ success: true, resultCode: queryData.ResultCode, resultDesc: queryData.ResultDesc, raw: queryData });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || String(error) });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 [Resend Email Server] Listening on http://localhost:${PORT}`);
});
