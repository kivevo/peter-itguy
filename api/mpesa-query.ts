// api/mpesa-query.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed. Use POST." });
  }

  try {
    const {
      checkoutRequestId,
      consumerKey: customKey,
      consumerSecret: customSecret,
      passkey: customPasskey,
      shortcode: customShortcode,
      environment: customEnv,
    } = req.body || {};

    if (!checkoutRequestId) {
      return res.status(400).json({ success: false, error: "CheckoutRequestID is required." });
    }

    const envMode = customEnv || process.env.MPESA_ENV || "sandbox";
    const isProd = envMode === "production";

    const consumerKey =
      customKey ||
      process.env.MPESA_CONSUMER_KEY ||
      (isProd ? "" : "g7zYFf6eKzK1xAqT00d0XhQJb26qG4O1");

    const consumerSecret =
      customSecret ||
      process.env.MPESA_CONSUMER_SECRET ||
      (isProd ? "" : "8z8n6d8d9f10d938");

    const shortcode =
      customShortcode ||
      process.env.MPESA_SHORTCODE ||
      (isProd ? "3053097" : "174379");

    const passkey =
      customPasskey ||
      process.env.MPESA_PASSKEY ||
      (isProd
        ? ""
        : "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919");

    const baseUrl = isProd
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

    // 1. Fetch OAuth Token
    const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const tokenResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: "GET",
      headers: { Authorization: `Basic ${authHeader}` },
    });

    if (!tokenResponse.ok) {
      return res.status(401).json({ success: false, error: "Authentication failed with Safaricom." });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Query STK Push status
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");

    const queryPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const queryResponse = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(queryPayload),
    });

    const queryData = await queryResponse.json();

    return res.status(200).json({
      success: true,
      resultCode: queryData.ResultCode,
      resultDesc: queryData.ResultDesc,
      raw: queryData,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ success: false, error: errMsg });
  }
}
