// api/mpesa-callback.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const callbackData = req.body?.Body?.stkCallback || req.body;
    console.log("[Daraja Webhook Callback Received]:", JSON.stringify(callbackData, null, 2));

    const resultCode = callbackData?.ResultCode;
    const resultDesc = callbackData?.ResultDesc;
    const merchantRequestId = callbackData?.MerchantRequestID;
    const checkoutRequestId = callbackData?.CheckoutRequestID;

    // Item metadata extraction
    let mpesaReceiptNumber = "";
    let amount = 0;
    let phoneNumber = "";
    let transactionDate = "";

    const items = callbackData?.CallbackMetadata?.Item;
    if (Array.isArray(items)) {
      items.forEach((item: { Name: string; Value?: string | number }) => {
        if (item.Name === "MpesaReceiptNumber" && item.Value) mpesaReceiptNumber = String(item.Value);
        if (item.Name === "Amount" && item.Value !== undefined) amount = Number(item.Value);
        if (item.Name === "PhoneNumber" && item.Value) phoneNumber = String(item.Value);
        if (item.Name === "TransactionDate" && item.Value) transactionDate = String(item.Value);
      });
    }

    console.log(`[Daraja Payment Settled] Receipt: ${mpesaReceiptNumber}, Amount: ${amount}, Phone: ${phoneNumber}`);

    // Always acknowledge Safaricom immediately
    return res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Callback accepted successfully",
      data: {
        resultCode,
        resultDesc,
        merchantRequestId,
        checkoutRequestId,
        mpesaReceiptNumber,
        amount,
        phoneNumber,
        transactionDate,
      },
    });
  } catch (error) {
    console.error("[Daraja Callback Error]:", error);
    return res.status(200).json({ ResultCode: 0, ResultDesc: "Error logged." });
  }
}
