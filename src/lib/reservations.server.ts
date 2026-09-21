/**
 * Server-only reservation logic. Never imported by client code.
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendEmail, getRestaurantEmail } from "@/lib/email.server";
import {
  customerConfirmedEmail,
  customerDeclinedEmail,
  customerPendingEmail,
  ownerNewRequestEmail,
  type ReservationEmailData,
} from "@/lib/reservation-emails.server";
import type { Database } from "@/integrations/supabase/types";

export type ReservationRow = Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationStatus = Database["public"]["Enums"]["reservation_status"];

export type NewReservationInput = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  special_requests?: string | null;
};

async function recordEmailError(id: string, message: string | null) {
  await supabaseAdmin.from("reservations").update({ email_error: message }).eq("id", id);
}

/** Save as pending, then notify customer + owner. Emails failing never loses the booking. */
export async function createReservation(input: NewReservationInput, siteOrigin: string) {
  const { data, error } = await supabaseAdmin
    .from("reservations")
    .insert({
      customer_name: input.customer_name,
      customer_email: input.customer_email.toLowerCase(),
      customer_phone: input.customer_phone,
      reservation_date: input.reservation_date,
      reservation_time: input.reservation_time,
      number_of_guests: input.number_of_guests,
      special_requests: input.special_requests?.trim() || null,
      status: "pending",
    })
    .select("*")
    .single();

  if (error || !data) {
    console.error("[reservations] insert failed", error);
    throw new Error("We couldn't save your reservation. Please try again or call us.");
  }

  const emailData = toEmailData(data);
  const confirmUrl = `${siteOrigin}/reservation/manage?token=${data.confirmation_token}&action=confirm`;
  const declineUrl = `${siteOrigin}/reservation/manage?token=${data.confirmation_token}&action=decline`;
  const dashboardUrl = `${siteOrigin}/admin`;

  const pending = customerPendingEmail(emailData);
  const owner = ownerNewRequestEmail(emailData, confirmUrl, declineUrl, dashboardUrl);

  const [customerResult, ownerResult] = await Promise.all([
    sendEmail({ to: data.customer_email, ...pending, replyTo: getRestaurantEmail() }),
    sendEmail({ to: getRestaurantEmail(), ...owner, replyTo: data.customer_email }),
  ]);

  const errors = [
    !customerResult.ok ? `customer: ${customerResult.error}` : null,
    !ownerResult.ok ? `owner: ${ownerResult.error}` : null,
  ].filter(Boolean);
  if (errors.length) await recordEmailError(data.id, errors.join(" | "));

  return {
    id: data.id,
    reservation_reference: data.reservation_reference,
    status: data.status,
    emailsSent: errors.length === 0,
  };
}

export async function getReservationByToken(token: string) {
  const { data } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .eq("confirmation_token", token)
    .maybeSingle();
  return data;
}

/**
 * Confirm or decline. Atomic: only flips rows that are still pending, so a
 * used email link (or a race) cannot change the outcome again.
 */
export async function decideReservation(
  where: { token: string } | { id: string },
  action: "confirm" | "decline",
) {
  const now = new Date().toISOString();
  const patch =
    action === "confirm"
      ? { status: "confirmed" as const, confirmed_at: now }
      : { status: "declined" as const, declined_at: now };

  let query = supabaseAdmin.from("reservations").update(patch).eq("status", "pending");
  query = "token" in where ? query.eq("confirmation_token", where.token) : query.eq("id", where.id);
  const { data, error } = await query.select("*").maybeSingle();

  if (error) {
    console.error("[reservations] decide failed", error);
    throw new Error("Could not update the reservation.");
  }
  if (!data) return { updated: false as const };

  const emailData = toEmailData(data);
  const mail = action === "confirm" ? customerConfirmedEmail(emailData) : customerDeclinedEmail(emailData);
  const result = await sendEmail({ to: data.customer_email, ...mail, replyTo: getRestaurantEmail() });
  await recordEmailError(data.id, result.ok ? null : `customer ${action}: ${result.error}`);

  return { updated: true as const, reservation: data, emailSent: result.ok };
}

export async function cancelReservation(id: string) {
  const { data, error } = await supabaseAdmin
    .from("reservations")
    .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
    .eq("id", id)
    .in("status", ["pending", "confirmed"])
    .select("*")
    .maybeSingle();
  if (error) throw new Error("Could not cancel the reservation.");
  return { updated: !!data };
}

export function toEmailData(r: ReservationRow): ReservationEmailData {
  return {
    reservation_reference: r.reservation_reference,
    customer_name: r.customer_name,
    customer_email: r.customer_email,
    customer_phone: r.customer_phone,
    reservation_date: r.reservation_date,
    reservation_time: r.reservation_time,
    number_of_guests: r.number_of_guests,
    special_requests: r.special_requests,
  };
}

/** Public-safe view of a reservation (used on the email-link landing page). */
export function toPublicView(r: ReservationRow) {
  return {
    reservation_reference: r.reservation_reference,
    customer_name: r.customer_name,
    customer_email: r.customer_email,
    customer_phone: r.customer_phone,
    reservation_date: r.reservation_date,
    reservation_time: r.reservation_time,
    number_of_guests: r.number_of_guests,
    special_requests: r.special_requests,
    status: r.status,
  };
}
