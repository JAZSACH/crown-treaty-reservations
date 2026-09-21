/**
 * Branded HTML emails for the reservation flow.
 * Wording follows the owner's spec; styling matches the pub branding.
 */
import { PUB } from "@/content/pub";
import { formatReservationDate, formatReservationTime } from "@/lib/reservation-format";

export type ReservationEmailData = {
  reservation_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  special_requests: string | null;
};

const C = {
  green: "#1f4a37",
  charcoal: "#2b2823",
  cream: "#f6f2ea",
  brass: "#b8934a",
  text: "#2b2823",
  muted: "#6b665d",
  border: "#e4dccd",
};

function esc(s: string | null | undefined) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function detailRows(rows: [string, string][]) {
  return rows
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid ${C.border};color:${C.muted};font-size:13px;letter-spacing:.08em;text-transform:uppercase;width:42%;vertical-align:top">${esc(k)}</td>
        <td style="padding:10px 0;border-bottom:1px solid ${C.border};color:${C.text};font-size:16px;vertical-align:top">${esc(v)}</td>
      </tr>`,
    )
    .join("");
}

function button(label: string, href: string, bg: string) {
  return `<a href="${href}" style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:.14em;text-transform:uppercase;padding:16px 28px;border-radius:6px;margin:6px 6px 6px 0">${esc(label)}</a>`;
}

function layout(opts: { preheader: string; heading: string; intro: string; body: string; footerNote?: string }) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(opts.heading)}</title></head>
<body style="margin:0;padding:0;background:${C.cream};font-family:Georgia,'Times New Roman',serif;">
<span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${esc(opts.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:32px 12px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid ${C.border}">
  <tr><td style="background:${C.green};padding:34px 32px;text-align:center">
    <div style="color:${C.brass};font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:.34em;text-transform:uppercase;margin-bottom:10px">Est. 16th Century · Uxbridge</div>
    <div style="color:#ffffff;font-size:30px;letter-spacing:.06em;text-transform:uppercase;font-weight:400">${esc(PUB.name)}</div>
  </td></tr>
  <tr><td style="padding:36px 32px 8px">
    <h1 style="margin:0 0 14px;font-size:26px;font-weight:400;color:${C.text}">${esc(opts.heading)}</h1>
    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${C.text}">${opts.intro}</p>
    ${opts.body}
  </td></tr>
  <tr><td style="padding:8px 32px 34px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:${C.muted}">
    ${opts.footerNote ? `<p style="margin:0 0 18px">${opts.footerNote}</p>` : ""}
    <p style="margin:0;color:${C.text}"><strong>${esc(PUB.name)}</strong><br>${esc(PUB.addressLine1)}<br>${esc(PUB.addressLine2)}<br>${esc(PUB.postcode)}</p>
    <p style="margin:10px 0 0"><a href="${PUB.phoneHref}" style="color:${C.green};text-decoration:none;font-weight:700">${esc(PUB.phone)}</a><br><a href="mailto:${PUB.email}" style="color:${C.green};text-decoration:none">${esc(PUB.email)}</a></p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function baseRows(r: ReservationEmailData): [string, string][] {
  return [
    ["Date", formatReservationDate(r.reservation_date)],
    ["Time", formatReservationTime(r.reservation_time)],
    ["Guests", String(r.number_of_guests)],
  ];
}

/* ───────────── Customer: request received (pending) ───────────── */
export function customerPendingEmail(r: ReservationEmailData) {
  const subject = `Reservation Request Received — ${PUB.name}`;
  const rows = detailRows([
    ...baseRows(r),
    ...(r.special_requests ? ([["Special requests", r.special_requests]] as [string, string][]) : []),
    ["Reference", r.reservation_reference],
  ]);
  const html = layout({
    preheader: "Your table is not confirmed yet — we'll email you once it's been reviewed.",
    heading: `Hi ${esc(r.customer_name)},`,
    intro: `Thank you for your reservation request at ${esc(PUB.name)}.<br><br>Your request has been received and is currently <strong>PENDING</strong> confirmation.`,
    body: `
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:${C.brass}">Reservation details</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px">${rows}</table>
      <div style="background:${C.cream};border-left:4px solid ${C.brass};padding:14px 16px;border-radius:4px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:${C.text}">
        We will send you another email once ${esc(PUB.name)} has confirmed or declined your reservation.<br><strong>Please note that your table is NOT confirmed yet.</strong>
      </div>`,
  });
  const text = `Hi ${r.customer_name},\n\nThank you for your reservation request at ${PUB.name}.\n\nYour request has been received and is currently PENDING confirmation.\n\nReservation details:\nDate: ${formatReservationDate(r.reservation_date)}\nTime: ${formatReservationTime(r.reservation_time)}\nGuests: ${r.number_of_guests}\nReference: ${r.reservation_reference}\n\nWe will send you another email once ${PUB.name} has confirmed or declined your reservation.\n\nPlease note that your table is NOT confirmed yet.\n\n${PUB.name}`;
  return { subject, html, text };
}

/* ───────────── Owner: new request with action buttons ───────────── */
export function ownerNewRequestEmail(r: ReservationEmailData, confirmUrl: string, declineUrl: string, dashboardUrl: string) {
  const subject = `New Reservation Request — ${formatReservationDate(r.reservation_date)} at ${formatReservationTime(r.reservation_time)}`;
  const rows = detailRows([
    ["Customer", r.customer_name],
    ["Email", r.customer_email],
    ["Phone", r.customer_phone],
    ...baseRows(r),
    ["Special requests", r.special_requests || "None"],
    ["Reference", r.reservation_reference],
    ["Status", "PENDING"],
  ]);
  const html = layout({
    preheader: `${r.customer_name} · ${r.number_of_guests} guests · ${formatReservationDate(r.reservation_date)} ${formatReservationTime(r.reservation_time)}`,
    heading: "New reservation request",
    intro: `A customer has requested a table. Review the details and confirm or decline below.`,
    body: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px">${rows}</table>
      <div style="text-align:center;margin-bottom:10px">
        ${button("Confirm reservation", confirmUrl, C.green)}
        ${button("Decline reservation", declineUrl, "#8a3a2e")}
      </div>
      <p style="text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${C.muted};margin:8px 0 0">Or manage all bookings in the <a href="${dashboardUrl}" style="color:${C.green}">owner dashboard</a>.</p>`,
    footerNote: "These links are unique to this reservation and stop working once it has been confirmed or declined.",
  });
  const text = `NEW RESERVATION REQUEST\n\nCustomer: ${r.customer_name}\nEmail: ${r.customer_email}\nPhone: ${r.customer_phone}\nDate: ${formatReservationDate(r.reservation_date)}\nTime: ${formatReservationTime(r.reservation_time)}\nGuests: ${r.number_of_guests}\nSpecial requests: ${r.special_requests || "None"}\nReference: ${r.reservation_reference}\nStatus: PENDING\n\nConfirm: ${confirmUrl}\nDecline: ${declineUrl}\nDashboard: ${dashboardUrl}`;
  return { subject, html, text };
}

/* ───────────── Customer: confirmed ───────────── */
export function customerConfirmedEmail(r: ReservationEmailData) {
  const subject = `Reservation Confirmed — ${PUB.name}`;
  const rows = detailRows([
    ["Name", r.customer_name],
    ...baseRows(r),
    ...(r.special_requests ? ([["Special requests", r.special_requests]] as [string, string][]) : []),
    ["Reservation reference", r.reservation_reference],
  ]);
  const html = layout({
    preheader: `Your table is booked! Reservation ${r.reservation_reference}`,
    heading: `Hi ${esc(r.customer_name)}, your table is booked!`,
    intro: `Your reservation at ${esc(PUB.name)} has been <strong>CONFIRMED</strong>.`,
    body: `
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:${C.brass}">Reservation details</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px">${rows}</table>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${C.text}">We look forward to seeing you.</p>`,
    footerNote: "If your plans change, please call us so we can offer the table to another guest.",
  });
  const text = `Hi ${r.customer_name},\n\nYour table is booked! Your reservation at ${PUB.name} has been CONFIRMED.\n\nReservation details:\nDate: ${formatReservationDate(r.reservation_date)}\nTime: ${formatReservationTime(r.reservation_time)}\nGuests: ${r.number_of_guests}\nReservation reference: ${r.reservation_reference}\n\nWe look forward to seeing you.\n\n${PUB.name}\n${PUB.addressLine1}\n${PUB.addressLine2}\n${PUB.postcode}\n${PUB.phone}`;
  return { subject, html, text };
}

/* ───────────── Customer: declined ───────────── */
export function customerDeclinedEmail(r: ReservationEmailData) {
  const subject = `Reservation Update — ${PUB.name}`;
  const rows = detailRows([...baseRows(r), ["Reference", r.reservation_reference]]);
  const html = layout({
    preheader: "Unfortunately we could not confirm your requested reservation.",
    heading: `Hi ${esc(r.customer_name)},`,
    intro: `Unfortunately, your reservation request at ${esc(PUB.name)} could not be confirmed.`,
    body: `
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:${C.brass}">Requested reservation</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:22px">${rows}</table>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:${C.text}">Please contact ${esc(PUB.name)} if you would like to try another date or time.</p>`,
  });
  const text = `Hi ${r.customer_name},\n\nUnfortunately, your reservation request at ${PUB.name} could not be confirmed.\n\nRequested reservation:\nDate: ${formatReservationDate(r.reservation_date)}\nTime: ${formatReservationTime(r.reservation_time)}\nGuests: ${r.number_of_guests}\n\nPlease contact ${PUB.name} if you would like to try another date or time.\n\n${PUB.name}\n${PUB.phone}`;
  return { subject, html, text };
}
