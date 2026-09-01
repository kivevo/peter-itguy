// api/mpesa-stk.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

interface STKPushRequestBody {
  phone: string;
  amount: number;
  accountReference?: string;
  transactionDesc?: string;
  consumerKey?: string;
  consumerSecret?: string;
  passkey?: string;
  shortcode?: string;
  environment?: "sandbox" | "production";
  callbackUrl?: string;
}

// Format Kenyan phone number to 2547XXXXXXXX or 2541XXXXXXXX
function formatKenyanPhone(phone: string): string {
  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "254" + clean.slice(1);
  } else if (clean.length === 9 && (clean.startsWith("7") || clean.startsWith("1"))) {
    clean = "254" + clean;
  }
  return clean;
}

// Generate Daraja Timestamp: YYYYMMDDHHmmss
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
  // CORS Headers
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
    } = (req.body || {}) as STKPushRequestBody;

    if (!phone || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: "Valid phone number and positive amount are required.",
      });
    }

    const formattedPhone = formatKenyanPhone(phone);
    if (formattedPhone.length < 12) {
      return res.status(400).json({
        success: false,
        error: `Invalid Kenyan phone number format: ${phone}. Expected format: 07XXXXXXXX or 2547XXXXXXXX.`,
      });
    }

    // Resolve Daraja Credentials
    const envMode = customEnv || process.env.MPESA_ENV || "sandbox";
    const isProd = envMode === "production";

    // Sandbox standard defaults if keys not configured
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

    // If in production without keys, return helpful error
    if (isProd && (!consumerKey || !consumerSecret || !passkey)) {
      return res.status(400).json({
        success: false,
        error:
          "Production M-Pesa credentials not found. Please provide MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, and MPESA_PASSKEY in your environment or Admin Settings.",
      });
    }

    const baseUrl = isProd
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";

    // 1. Fetch OAuth Access Token
    const authHeader = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const tokenResponse = await fetch(
      `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    if (!tokenResponse.ok) {
      const tokenErr = await tokenResponse.text();
      console.error("[Daraja Token Error]:", tokenErr);
      return res.status(401).json({
        success: false,
        error: `Failed to authenticate with Safaricom Daraja (${tokenResponse.status}): ${tokenErr}`,
      });
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Build STK Push Payload
    const timestamp = getTimestamp();
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
    const hostUrl = req.headers.host ? `https://${req.headers.host}` : "https://peter-itguy-mu.vercel.app";
    const callbackUrl = customCallback || `${hostUrl}/api/mpesa-callback`;

    // Paybill vs Buy Goods (Till) transaction type
    // If 6-7 digit shortcode starting with 3/8 -> BuyGoods, otherwise CustomerPayBillOnline
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

    console.log(`[Daraja STK Push] Sending KES ${amount} prompt to ${formattedPhone}...`);

    // 3. Dispatch STK Push to Safaricom
    const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(stkPayload),
    });

    const stkData = await stkResponse.json();

    if (!stkResponse.ok || stkData.ResponseCode !== "0") {
      console.error("[Daraja STK Rejected]:", stkData);
      return res.status(400).json({
        success: false,
        error: stkData.errorMessage || stkData.ResponseDescription || "Safaricom rejected the STK Push request.",
        details: stkData,
      });
    }

    console.log("[Daraja STK Dispatched Successfully]:", stkData);

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
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("[Daraja Handler Exception]:", errMsg);
    return res.status(500).json({
      success: false,
      error: `Internal Server Error: ${errMsg}`,
    });
  }
}
