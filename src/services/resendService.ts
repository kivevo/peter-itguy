import { dataStorage, ResendSettings, SubscriberItem, InquiryLead, ReviewItem } from "./dataStorage";

export interface SendEmailPayload {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface BroadcastPayload {
  subject: string;
  previewText?: string;
  headline: string;
  bodyHtml: string;
  ctaText?: string;
  ctaUrl?: string;
  subscribers: SubscriberItem[];
}

export interface SendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  recipientCount?: number;
}

class ResendEmailService {
  /**
   * Base method to send an email via Resend API or local/serverless endpoint
   */
  public async sendEmail(payload: SendEmailPayload, overrideSettings?: Partial<ResendSettings>): Promise<SendResult> {
    const settings = { ...dataStorage.getResendSettings(), ...(overrideSettings || {}) };
    const apiKey = settings.apiKey?.trim();
    const from = payload.from || settings.fromEmail || "Peter Kivevo <onboarding@resend.dev>";

    // Try serverless / local API endpoint first (which has server-side Resend SDK)
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: payload.to,
          from,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
          replyTo: payload.replyTo,
          apiKey: apiKey || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, messageId: data.id || data.data?.id };
      }
    } catch {
      // Fall through to direct Resend API call if local endpoint isn't running
    }

    // Direct Resend API Fallback (useful if API key is provided directly in admin panel)
    if (!apiKey) {
      return {
        success: false,
        error: "Resend API Key is missing. Please add your Resend API Key in Admin Panel -> Email Broadcasts & Resend tab.",
      };
    }

    try {
      const toAddresses = Array.isArray(payload.to) ? payload.to : [payload.to];
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: toAddresses,
          subject: payload.subject,
          html: payload.html,
          text: payload.text,
          reply_to: payload.replyTo,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.message || data.error?.message || "Failed to send email via Resend API.",
        };
      }

      return { success: true, messageId: data.id };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      return { success: false, error: msg };
    }
  }

  /**
   * Send notification alert to Peter whenever a new inquiry arrives on the website
   */
  public async notifyNewInquiry(inquiry: InquiryLead): Promise<SendResult> {
    const settings = dataStorage.getResendSettings();
    if (!settings.notifyOnInquiry) {
      return { success: true, error: "Inquiry notifications are disabled in settings." };
    }

    const recipient = settings.recipientEmail || "peterkivevo001@gmail.com";
    const subject = `🚨 [New IT Lead] ${inquiry.name || "Visitor"} (${inquiry.service || "IT Support"})`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: #0d9488; color: #ffffff; padding: 24px; text-align: left; }
          .header h2 { margin: 0; font-size: 20px; font-weight: 800; }
          .header p { margin: 4px 0 0 0; opacity: 0.9; font-size: 13px; }
          .content { padding: 24px; }
          .field { margin-bottom: 16px; }
          .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.05em; margin-bottom: 4px; }
          .value { font-size: 15px; font-weight: 600; color: #0f172a; }
          .value-box { background: #f1f5f9; padding: 12px; border-radius: 8px; font-size: 14px; color: #334155; border-left: 4px solid #0d9488; }
          .cta-row { margin-top: 24px; display: flex; gap: 12px; }
          .btn-wa { display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: bold; font-size: 14px; margin-right: 10px; }
          .btn-call { display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: bold; font-size: 14px; }
          .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h2>🚀 New Business Inquiry Received</h2>
            <p>Direct from Peter Kivevo Website (${inquiry.source})</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Client Name</div>
              <div class="value">${inquiry.name || "Not provided"}</div>
            </div>

            <div class="field">
              <div class="label">Phone / WhatsApp</div>
              <div class="value">
                <a href="tel:${inquiry.phone}" style="color: #0d9488; text-decoration: none;">${inquiry.phone}</a>
              </div>
            </div>

            <div class="field">
              <div class="label">Service Required</div>
              <div class="value">${inquiry.service}</div>
            </div>

            ${inquiry.urgency ? `
            <div class="field">
              <div class="label">Urgency Level</div>
              <div class="value" style="color: #e11d48;">⚡ ${inquiry.urgency}</div>
            </div>` : ""}

            <div class="field">
              <div class="label">Client Message & Requirements</div>
              <div class="value-box">${inquiry.details || "No additional text entered."}</div>
            </div>

            <div class="cta-row">
              <a class="btn-wa" href="https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(inquiry.name || '')},%20Peter%20here%20following%20up%20on%20your%20IT%20inquiry." target="_blank">
                💬 Reply on WhatsApp
              </a>
              <a class="btn-call" href="tel:${inquiry.phone}">
                📞 Call Client Now
              </a>
            </div>
          </div>
          <div class="footer">
            Peter Kivevo IT Consultant • Nairobi, Kenya • Automated Alert Engine
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: recipient,
      subject,
      html,
    });
  }

  /**
   * Send an immediate confirmation email receipt to the client who submitted the inquiry
   */
  public async sendClientInquiryConfirmation(inquiry: InquiryLead, clientEmail: string): Promise<SendResult> {
    if (!clientEmail || !clientEmail.includes("@")) {
      return { success: false, error: "Invalid client email" };
    }

    const siteContent = dataStorage.getSiteContent();
    const siteInfo = siteContent.siteInfo;
    const clientName = inquiry.name?.trim() || "Valued Client";
    const ticketId = `TKT-${inquiry.id.replace(/[^0-9]/g, "").slice(-6) || Math.floor(100000 + Math.random() * 900000)}`;
    const subject = `✅ [Ticket #${ticketId} Received] Peter Kivevo IT Support & Engineering`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; background-color: #f8fafc; margin: 0; padding: 20px; }
          .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: #0f172a; color: #ffffff; padding: 30px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
          .header p { margin: 6px 0 0 0; color: #2dd4bf; font-size: 13px; font-family: monospace; }
          .badge { display: inline-block; background: rgba(45, 212, 191, 0.15); border: 1px solid rgba(45, 212, 191, 0.4); color: #2dd4bf; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-top: 10px; }
          .content { padding: 28px 24px; }
          .status-box { background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; padding: 18px; margin: 18px 0; color: #115e59; }
          .status-title { font-weight: 800; font-size: 15px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
          .field { margin-bottom: 14px; }
          .label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748b; letter-spacing: 0.05em; margin-bottom: 2px; }
          .value { font-size: 14px; font-weight: 600; color: #0f172a; }
          .btn-wa { display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 800; font-size: 14px; margin-top: 12px; }
          .footer { padding: 20px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>Peter Kivevo — IT Consultant</h1>
            <p>Direct Engineer Dispatch &amp; Support</p>
            <div class="badge">Ticket Assigned: #${ticketId}</div>
          </div>
          <div class="content">
            <p style="font-size: 16px; font-weight: 700; margin-top: 0; color: #0f172a;">
              Hi ${clientName},
            </p>
            <p style="color: #475569; font-size: 14px; margin-top: 4px;">
              Thank you for reaching out! Your IT service request has been received directly by Peter Kivevo and entered into our priority dispatch queue.
            </p>

            <div class="status-box">
              <div class="status-title">⚡ Engineer Status: On-Call &amp; Reviewing</div>
              <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.95;">
                Peter will review your requirements and call or WhatsApp you at <strong>${inquiry.phone || "your contact number"}</strong> shortly. Average direct response time is under 15 minutes.
              </p>
            </div>

            <div style="background: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; margin-top: 18px;">
              <div class="field">
                <div class="label">Requested Service</div>
                <div class="value">${inquiry.service}</div>
              </div>
              ${inquiry.urgency ? `
              <div class="field">
                <div class="label">Urgency SLA</div>
                <div class="value" style="color: #e11d48;">⚡ ${inquiry.urgency}</div>
              </div>` : ""}
              <div class="field" style="margin-bottom: 0;">
                <div class="label">Submitted Details</div>
                <div class="value" style="font-weight: normal; color: #334155; font-size: 13px;">${inquiry.details || "IT Assistance Request"}</div>
              </div>
            </div>

            <div style="text-align: center; margin-top: 24px;">
              <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">
                Need to speak with Peter right now? Connect directly on WhatsApp:
              </p>
              <a class="btn-wa" href="https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent(`Hi Peter, I just submitted Ticket #${ticketId} for ${inquiry.service}. Can we discuss?`)}" target="_blank">
                💬 Open WhatsApp Chat with Peter
              </a>
            </div>
          </div>
          <div class="footer">
            Peter Kivevo • Safaricom Dealer Tech Specialist • Nairobi, Kenya<br>
            Direct: ${siteInfo.phoneDisplay} | ${siteInfo.email}
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: clientEmail.trim(),
      subject,
      html,
    });
  }

  /**
   * Send notification alert to Peter when a new testimonial/review is posted
   */
  public async notifyNewReview(review: ReviewItem): Promise<SendResult> {
    const settings = dataStorage.getResendSettings();
    if (!settings.notifyOnReview) {
      return { success: true };
    }

    const recipient = settings.recipientEmail || "peterkivevo001@gmail.com";
    const subject = `⭐ [New Client Review] ${review.name} (${review.rating}/5 Stars)`;

    const html = `
      <div style="font-family: sans-serif; max-width: 540px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h3 style="color: #0d9488; margin-top: 0;">New Testimonial Submitted</h3>
        <p><strong>Client:</strong> ${review.name} (${review.role}, ${review.company})</p>
        <p><strong>Rating:</strong> ${"⭐".repeat(review.rating)} (${review.rating}/5)</p>
        <p><strong>Highlight:</strong> <em>"${review.highlight}"</em></p>
        <blockquote style="background: #f8fafc; padding: 12px; border-left: 4px solid #0d9488; margin: 12px 0;">
          ${review.content}
        </blockquote>
        <p style="font-size: 12px; color: #64748b;">Visit your Admin Panel to approve or edit this testimonial.</p>
      </div>
    `;

    return this.sendEmail({
      to: recipient,
      subject,
      html,
    });
  }

  /**
   * Send a welcome confirmation email to a new subscriber
   */
  public async sendWelcomeEmail(subscriber: { email: string; name?: string }): Promise<SendResult> {
    const settings = dataStorage.getResendSettings();
    if (!settings.welcomeEmailEnabled) {
      return { success: true };
    }

    const siteContent = dataStorage.getSiteContent();
    const siteInfo = siteContent.siteInfo;
    const name = subscriber.name?.trim() || "there";
    const subject = `Welcome to Peter Kivevo IT Insights & Priority Support`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; padding: 20px; }
          .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.04); }
          .header { background: #0f172a; color: #ffffff; padding: 30px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 22px; font-weight: 800; }
          .header p { margin: 6px 0 0 0; color: #2dd4bf; font-size: 13px; font-family: monospace; }
          .content { padding: 28px 24px; }
          .hero-box { background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 12px; padding: 16px; margin: 20px 0; color: #115e59; }
          .btn { display: inline-block; background: #0d9488; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 14px; margin-top: 15px; }
          .footer { padding: 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1>Peter Kivevo John</h1>
            <p>ENTERPRISE IT CONSULTANT &amp; WEB ARCHITECT</p>
          </div>
          <div class="content">
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Hi ${name}, welcome! 👋</h2>
            <p>Thank you for connecting with me. You are now on my priority channel for practical tech guides, fast IT troubleshooting tips, and updates on network engineering and high-speed web solutions in Kenya.</p>
            
            <div class="hero-box">
              <strong style="display: block; margin-bottom: 6px;">⚡ Need Urgent IT Help for Your Office or Website?</strong>
              You have direct access to my on-call WhatsApp line whenever your office Wi-Fi freezes, computers act up, or your website needs maintenance.
            </div>

            <p>Feel free to save my official direct contact details:</p>
            <ul style="padding-left: 20px; color: #334155; font-size: 14px;">
              <li><strong>WhatsApp / Direct Call:</strong> ${siteInfo.phoneDisplay}</li>
              <li><strong>Email:</strong> ${siteInfo.email}</li>
              <li><strong>Location:</strong> ${siteInfo.location}</li>
            </ul>

            <center>
              <a class="btn" href="https://wa.me/${siteInfo.whatsappNumber}?text=Hi%20Peter,%20saved%20your%20contact%20from%20the%20newsletter." target="_blank">
                💬 Say Hello on WhatsApp
              </a>
            </center>
          </div>
          <div class="footer">
            You received this email because you subscribed on peterkivevo.com or submitted an IT inquiry.<br>
            P.O. Box 79240-00200, Nairobi, Kenya.
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: subscriber.email,
      subject,
      html,
    });
  }

  /**
   * Broadcast an email newsletter / announcement to all active subscribers
   */
  public async sendBroadcast(
    payload: BroadcastPayload,
    onProgress?: (sent: number, total: number, currentEmail: string) => void
  ): Promise<{ success: boolean; sentCount: number; failedCount: number; logs: string[] }> {
    const activeSubscribers = payload.subscribers.filter((s) => s.status === "subscribed");
    const total = activeSubscribers.length;
    const logs: string[] = [];
    let sentCount = 0;
    let failedCount = 0;

    if (total === 0) {
      return {
        success: false,
        sentCount: 0,
        failedCount: 0,
        logs: ["No active subscribers found in list."],
      };
    }

    const siteContent = dataStorage.getSiteContent();
    const siteInfo = siteContent.siteInfo;

    for (let i = 0; i < total; i++) {
      const sub = activeSubscribers[i];
      const recipientName = sub.name?.trim() || "there";

      if (onProgress) {
        onProgress(i + 1, total, sub.email);
      }

      // Personalized HTML template for each subscriber
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; background: #f8fafc; margin: 0; padding: 20px; }
            .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.04); }
            .header { background: #0f172a; color: #ffffff; padding: 28px 24px; text-align: center; }
            .header h1 { margin: 0; font-size: 20px; font-weight: 800; }
            .header p { margin: 4px 0 0 0; color: #2dd4bf; font-size: 12px; font-family: monospace; }
            .content { padding: 28px 24px; }
            .headline { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 16px; line-height: 1.3; }
            .body-text { font-size: 15px; color: #334155; margin-bottom: 24px; line-height: 1.6; white-space: pre-wrap; }
            .cta-btn { display: inline-block; background: #0d9488; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 15px; }
            .footer { padding: 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>Peter Kivevo John</h1>
              <p>IT CONSULTANT &amp; DIGITAL SYSTEMS ARCHITECT</p>
            </div>
            <div class="content">
              <h2 class="headline">${payload.headline || payload.subject}</h2>
              <p style="font-size: 14px; color: #64748b; margin-top: -8px; margin-bottom: 18px;">Hi ${recipientName},</p>
              
              <div class="body-text">${payload.bodyHtml}</div>

              ${payload.ctaText && payload.ctaUrl ? `
              <div style="text-align: center; margin: 30px 0 10px 0;">
                <a class="cta-btn" href="${payload.ctaUrl}" target="_blank">
                  ${payload.ctaText}
                </a>
              </div>` : ""}
            </div>
            <div class="footer">
              Sent by Peter Kivevo John • Nairobi, Kenya • Direct: ${siteInfo.phoneDisplay}<br>
              You are receiving this update because you are subscribed to Peter Kivevo IT updates.
            </div>
          </div>
        </body>
        </html>
      `;

      const res = await this.sendEmail({
        to: sub.email,
        subject: payload.subject,
        html,
      });

      if (res.success) {
        sentCount++;
        logs.push(`✅ [${i + 1}/${total}] Sent successfully to ${sub.email}`);
      } else {
        failedCount++;
        logs.push(`❌ [${i + 1}/${total}] Failed for ${sub.email}: ${res.error || "Unknown error"}`);
      }

      // Small delay between sends to respect rate limits
      if (i < total - 1) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    }

    // Save to broadcast history in dataStorage
    dataStorage.addBroadcastItem({
      subject: payload.subject,
      previewText: payload.previewText,
      headline: payload.headline,
      body: payload.bodyHtml,
      ctaText: payload.ctaText,
      ctaUrl: payload.ctaUrl,
      recipientCount: sentCount,
      status: failedCount === total ? "failed" : "sent",
      logs: logs.join("\n"),
    });

    return {
      success: sentCount > 0,
      sentCount,
      failedCount,
      logs,
    };
  }

  /**
   * Diagnostic connection test to verify Resend API key and sender address
   */
  public async testConnection(apiKey: string, fromEmail: string, toEmail: string): Promise<SendResult> {
    if (!apiKey.trim()) {
      return { success: false, error: "Please provide a Resend API key to test." };
    }
    if (!toEmail.trim() || !toEmail.includes("@")) {
      return { success: false, error: "Please provide a valid recipient test email." };
    }

    const testSubject = `🧪 Resend Connection Test from Peter Kivevo Website`;
    const testHtml = `
      <div style="font-family: sans-serif; padding: 24px; border: 1px solid #14b8a6; border-radius: 12px; max-width: 500px; margin: auto;">
        <h2 style="color: #0f766e; margin-top: 0;">🎉 Resend is Connected &amp; Working!</h2>
        <p>This is a live test email sent from your Peter Kivevo IT Admin Dashboard.</p>
        <p><strong>Configured Sender:</strong> ${fromEmail || "onboarding@resend.dev"}</p>
        <p><strong>Delivered to:</strong> ${toEmail}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;">
        <p style="font-size: 12px; color: #64748b;">Your website can now dispatch automated alerts and broadcast emails to subscribers!</p>
      </div>
    `;

    return this.sendEmail(
      {
        to: toEmail,
        from: fromEmail,
        subject: testSubject,
        html: testHtml,
      },
      { apiKey, fromEmail, recipientEmail: toEmail }
    );
  }
}

export const resendService = new ResendEmailService();
