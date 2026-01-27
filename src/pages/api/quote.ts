import type { APIRoute } from "astro";
import { Resend } from "resend";

const ADMIN_EMAIL = "gerry.m@rocksteadymechanical.com";
const FROM_EMAIL_ADDRESS = import.meta.env.RESEND_FROM_EMAIL ?? "info@rocksteadymechanical.com";
const FROM_EMAIL = `Rocksteady Mechanical <${FROM_EMAIL_ADDRESS}>`;
const SITE_URL = import.meta.env.PUBLIC_SITE_URL ?? "https://rocksteadymechanical.com";
const CONTACT_EMAIL = "info@rocksteadymechanical.com";
const CONTACT_PHONE = "(604) 785-4466";
const CONTACT_PHONE_LINK = "tel:6047854466";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
	const apiKey = import.meta.env.RESEND_API_KEY;
	if (!apiKey) {
		return new Response(JSON.stringify({ error: "Missing RESEND_API_KEY." }), { status: 500 });
	}

	const resend = new Resend(apiKey);

	let payload: {
		name?: string;
		email?: string;
		phone?: string;
		services?: string[];
		message?: string;
	} = {};

	try {
		const form = await request.formData();
		if (form && [...form.keys()].length > 0) {
			payload = {
				name: String(form.get("name") ?? ""),
				email: String(form.get("email") ?? ""),
				phone: String(form.get("phone") ?? ""),
				services: form.getAll("services").map((entry) => String(entry)),
				message: String(form.get("message") ?? ""),
			};
		} else {
			const rawBody = await request.text();
			if (rawBody) {
				payload = JSON.parse(rawBody);
			} else {
				return new Response(JSON.stringify({ error: "Empty request payload." }), { status: 400 });
			}
		}
	} catch {
		return new Response(JSON.stringify({ error: "Invalid request payload." }), { status: 400 });
	}

	const name = payload.name?.trim() ?? "";
	const email = payload.email?.trim() ?? "";
	const phone = payload.phone?.trim() ?? "";
	const services = payload.services ?? [];
	const message = payload.message?.trim() ?? "";

	if (!name || !email || !phone || services.length === 0) {
		return new Response(JSON.stringify({ error: "Please complete all required fields." }), { status: 400 });
	}

	const serviceList = services.length ? services.join(", ") : "Not provided";
	const safeMessage = message || "(No message provided)";

	const escapeHtml = (value: string) =>
		value
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#39;");

	const siteOrigin = SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;
	const logoUrl = `${siteOrigin.replace(/\/+$/, "")}/logo.png`;
	const safeName = escapeHtml(name);
	const safeEmail = escapeHtml(email);
	const safePhone = escapeHtml(phone);
	const safeServices = escapeHtml(serviceList);
	const safeMessageHtml = escapeHtml(safeMessage).replace(/\\n/g, "<br />");
	const safeMessageText = safeMessage;

	const adminHtml = `
    <div style="background:#efefef;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#111111;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e5e5;">
        <tr>
          <td style="padding:28px 32px 22px;text-align:center;">
            <img src="${logoUrl}" alt="Rocksteady Mechanical" style="display:block;height:40px;margin:0 auto;" />
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #e5e5e5;"></td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;">
            <h2 style="margin:0 0 18px;font-size:20px;font-weight:700;color:#111111;">New Quote Request</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:18px;">
              <tr>
                <td style="width:50%;padding:0 12px 14px 0;vertical-align:top;">
                  <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#666666;margin-bottom:6px;">Name</div>
                  <div style="font-size:15px;color:#111111;">${safeName}</div>
                </td>
                <td style="width:50%;padding:0 0 14px 12px;vertical-align:top;">
                  <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#666666;margin-bottom:6px;">Email</div>
                  <div style="font-size:15px;color:#d11f1f;">
                    <a href="mailto:${safeEmail}" style="color:#d11f1f;text-decoration:none;">${safeEmail}</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="width:50%;padding:0 12px 14px 0;vertical-align:top;">
                  <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#666666;margin-bottom:6px;">Phone</div>
                  <div style="font-size:15px;color:#111111;">${safePhone}</div>
                </td>
                <td style="width:50%;padding:0 0 14px 12px;vertical-align:top;">
                  <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#666666;margin-bottom:6px;">Services</div>
                  <div style="font-size:15px;color:#111111;">${safeServices}</div>
                </td>
              </tr>
            </table>
            <div style="font-size:12px;letter-spacing:0.06em;text-transform:uppercase;color:#666666;margin-bottom:8px;">Project Brief</div>
            <div style="font-size:15px;line-height:1.6;color:#111111;">${safeMessageHtml}</div>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #eeeeee;"></td>
        </tr>
        <tr>
          <td style="padding:18px 32px 24px;font-size:12px;color:#888888;">
            Sent from <a href="${SITE_URL}" style="color:#888888;text-decoration:none;">Rocksteady Mechanical</a>
          </td>
        </tr>
      </table>
    </div>
  `;

	const adminText = `New Quote Request\\n\\nName: ${name}\\nEmail: ${email}\\nPhone: ${phone}\\nServices: ${serviceList}\\n\\nMessage:\\n${safeMessageText}`;

	const userHtml = `
    <div style="background:#efefef;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#111111;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e5e5;">
        <tr>
          <td style="padding:28px 32px 22px;text-align:center;">
            <img src="${logoUrl}" alt="Rocksteady Mechanical" style="display:block;height:40px;margin:0 auto;" />
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #e5e5e5;"></td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">Hello ${safeName},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
              Thank you for reaching out to Rocksteady Mechanical! We're excited to learn about your project and
              help bring it to life. Our team is reviewing your request and will get back to you shortly with a
              personalized quote.
            </p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
              If you have any additional information or questions, please contact us at
              <a href="mailto:${CONTACT_EMAIL}" style="color:#d11f1f;text-decoration:none;">${CONTACT_EMAIL}</a>
              or <a href="${CONTACT_PHONE_LINK}" style="color:#d11f1f;text-decoration:none;">${CONTACT_PHONE}</a>.
              We're committed to delivering exceptional service and look forward to collaborating with you.
            </p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">Warm regards,<br />The Rocksteady Mechanical Team</p>
            <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:#666666;">
              --<br />
              This email is a receipt for your quote request on our website (${SITE_URL}). If that was not you,
              please ignore this message.
            </p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #eeeeee;"></td>
        </tr>
        <tr>
          <td style="padding:18px 32px 24px;font-size:12px;color:#888888;">
            Sent from <a href="${SITE_URL}" style="color:#888888;text-decoration:none;">Rocksteady Mechanical</a>
          </td>
        </tr>
      </table>
    </div>
  `;

	const userText = `Hello ${name},\\n\\nThank you for reaching out to Rocksteady Mechanical! \\n\\nIf you have any additional information or questions, please contact us at ${CONTACT_EMAIL} or ${CONTACT_PHONE}.\\n\\nWarm regards,\\nThe Rocksteady Mechanical Team\\n\\n--\\nThis email is a receipt for your quote request on our website (${SITE_URL}). If that was not you, please ignore this message.`;

	try {
		await Promise.all([
			resend.emails.send({
				from: FROM_EMAIL,
				to: ADMIN_EMAIL,
				subject: `New Quote Request - ${name}`,
				html: adminHtml,
				text: adminText,
				replyTo: email,
			}),
			resend.emails.send({
				from: FROM_EMAIL,
				to: email,
				subject: "We received your quote request",
				html: userHtml,
				text: userText,
			}),
		]);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error("Resend error:", error);
		return new Response(JSON.stringify({ error: "Unable to send email right now." }), { status: 500 });
	}
};
