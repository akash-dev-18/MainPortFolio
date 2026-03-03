import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import nodemailer from "nodemailer";

// ----------------------------------------------------
// IN-MEMORY RATE LIMITER (per IP, max 3 requests / 5 min)
// ----------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 5 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

function getTransporter() {
  if (!process.env.MAIL_SERVER || !process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) return null;
  return nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: parseInt(process.env.MAIL_PORT || "587"),
    secure: process.env.MAIL_PORT === "465",
    auth: { user: process.env.MAIL_USERNAME, pass: process.env.MAIL_PASSWORD },
  });
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "RATE_LIMIT_EXCEEDED: Too many transmissions. Please wait 5 minutes." },
        { status: 429 }
      );
    }

    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const msgId = Date.now().toString();
    const dateStr = new Date().toISOString();

    // Save to Supabase
    const { error: dbError } = await supabase.from("messages").insert({
      id: msgId,
      name,
      email,
      message,
      date: dateStr,
    });

    if (dbError) {
      console.error("Supabase message insert error:", dbError);
      return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
    }

    // Send Emails
    const transporter = getTransporter();
    if (transporter) {
      const fromAddress = process.env.MAIL_FROM || process.env.MAIL_USERNAME!;

      // Notification to self
      try {
        await transporter.sendMail({
          from: fromAddress,
          to: process.env.MAIL_USERNAME,
          subject: `🔔 NEW PORTFOLIO TRANSMISSION: ${name}`,
          replyTo: email,
          html: `
            <div style="font-family: 'Courier New', monospace; background-color: #0a0a0a; color: #10b981; padding: 30px; border-radius: 8px; border: 1px solid #10b98133;">
              <h2 style="color: #f59e0b; margin-top: 0;">⚡ COMM_LINK RECEIVED</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #64748b; font-size: 12px;">SENDER</td><td style="padding: 8px 0; color: #fff;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; font-size: 12px;">RETURN_ADDRESS</td><td style="padding: 8px 0; color: #10b981;">${email}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748b; font-size: 12px;">TIMESTAMP</td><td style="padding: 8px 0; color: #fff;">${new Date().toLocaleString()}</td></tr>
              </table>
              <hr style="border-color: #10b981; opacity: 0.2; margin: 16px 0;" />
              <div style="background: #111; padding: 16px; border-radius: 6px; border-left: 3px solid #10b981;">
                <p style="white-space: pre-wrap; font-size: 14px; color: #e2e8f0; margin: 0;">${message}</p>
              </div>
            </div>
          `,
        });
      } catch (e) { console.error("Notification email error:", e); }

      // Auto-reply to sender
      try {
        await transporter.sendMail({
          from: `"Akash Kumar" <${fromAddress}>`,
          to: email,
          subject: `Thanks for reaching out, ${name}! 🚀`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); padding: 40px 30px; border-radius: 12px; border: 1px solid #10b98133;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #10b981; font-size: 24px; margin: 0; font-family: 'Courier New', monospace;">AKASH KUMAR</h1>
                  <p style="color: #64748b; font-size: 12px; letter-spacing: 3px; margin-top: 4px;">SECURITY-FOCUSED BACKEND ENGINEER</p>
                </div>
                <div style="background: #111827; padding: 24px; border-radius: 8px; border-left: 3px solid #10b981;">
                  <p style="color: #e2e8f0; font-size: 16px; line-height: 1.6; margin: 0;">Hey <strong style="color: #10b981;">${name}</strong>,</p>
                  <p style="color: #cbd5e1; font-size: 14px; line-height: 1.8; margin-top: 12px;">Thanks for reaching out! I've received your message and will get back to you as soon as possible.</p>
                </div>
                <div style="margin-top: 24px; padding: 16px; background: #0f172a; border-radius: 8px;">
                  <p style="color: #64748b; font-size: 11px; font-family: 'Courier New', monospace; margin: 0 0 8px 0;">YOUR_MESSAGE_RECEIVED:</p>
                  <p style="color: #94a3b8; font-size: 13px; font-style: italic; white-space: pre-wrap; margin: 0;">"${message}"</p>
                </div>
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #1e293b;">
                  <p style="color: #475569; font-size: 11px; margin: 0;">This is an automated response from <span style="color: #10b981;">akash.dev</span></p>
                </div>
              </div>
            </div>
          `,
        });
      } catch (e) { console.error("Auto-reply email error:", e); }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
