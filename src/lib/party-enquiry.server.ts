/**
 * Server-only big-party enquiry logic. Never imported by client code.
 * Big parties (21–150 guests) are emailed to the owner as an enquiry —
 * no reservation is created and nothing is auto-confirmed.
 */
import { sendEmail, getRestaurantEmail } from "@/lib/email.server";
import { PUB } from "@/content/pub";

export type BigPartyEnquiryInput = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  event_date: string;
  number_of_guests: number;
  message?: string | null | undefined;
};

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function sendBigPartyEnquiry(input: BigPartyEnquiryInput) {
  const rows: Array<[string, string]> = [
    ["Name", input.customer_name],
    ["Email", input.customer_email],
    ["Phone", input.customer_phone],
    ["Preferred date", input.event_date],
    ["Number of guests", String(input.number_of_guests)],
    ["Message", input.message?.trim() || "—"],
  ];
  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:14px;vertical-align:top;">${k}</td><td style="padding:6px 0;font-size:14px;">${esc(v)}</td></tr>`,
    )
    .join("");
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const ownerHtml = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1c2b23;">
      <h1 style="font-size:22px;">New Big Party Enquiry</h1>
      <p style="font-size:14px;color:#444;">A customer has enquired about a big party booking at ${esc(PUB.name)}. Please reply to them directly to discuss arrangements.</p>
      <table style="border-collapse:collapse;margin-top:12px;">${htmlRows}</table>
    </div>`;

  const customerHtml = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1c2b23;">
      <h1 style="font-size:22px;">Big Party Enquiry Received — ${esc(PUB.name)}</h1>
      <p style="font-size:14px;color:#444;">Thank you, ${esc(input.customer_name)}. We've received your enquiry for a party of ${input.number_of_guests} on ${esc(input.event_date)}. Our team will be in touch to discuss your event — nothing is booked yet.</p>
      <p style="font-size:14px;color:#444;">Prefer to talk? Call us on ${esc(PUB.phone)}.</p>
    </div>`;

  const [ownerResult, customerResult] = await Promise.all([
    sendEmail({
      to: getRestaurantEmail(),
      subject: `Big Party Enquiry — ${input.number_of_guests} guests on ${input.event_date} — ${PUB.name}`,
      html: ownerHtml,
      text: `New big party enquiry\n\n${text}`,
      replyTo: input.customer_email,
    }),
    sendEmail({
      to: input.customer_email,
      subject: `Big Party Enquiry Received — ${PUB.name}`,
      html: customerHtml,
      text: `Thank you, ${input.customer_name}. We've received your enquiry for a party of ${input.number_of_guests} on ${input.event_date}. Our team will be in touch — nothing is booked yet.\n\nPrefer to talk? Call us on ${PUB.phone}.`,
      replyTo: getRestaurantEmail(),
    }),
  ]);

  if (!ownerResult.ok) {
    console.error("[big-party] owner email failed", ownerResult.error);
    throw new Error("We couldn't send your enquiry. Please try again or call us.");
  }
  if (!customerResult.ok) console.error("[big-party] customer email failed", customerResult.error);

  return { sent: true as const };
}
