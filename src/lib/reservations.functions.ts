import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { RESERVATION } from "@/content/pub";

/* ───────────── Validation (shared by the form & the server) ───────────── */

export const reservationSchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your full name").max(80),
  customer_email: z.string().trim().email("Please enter a valid email address").max(120),
  customer_phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
  reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date"),
  reservation_time: z.string().regex(/^\d{2}:\d{2}$/, "Please choose a time"),
  number_of_guests: z.coerce
    .number()
    .int()
    .min(RESERVATION.minGuests, "Please choose the number of guests")
    .max(RESERVATION.maxGuests, RESERVATION.largePartyNote),
  special_requests: z.string().trim().max(500, "Please keep requests under 500 characters").optional(),
});

export type ReservationFormValues = z.infer<typeof reservationSchema>;

function siteOrigin() {
  const req = getRequest();
  const url = new URL(req.url);
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? req.headers.get("host") ?? url.host;
  const proto = forwardedProto ?? (host.startsWith("localhost") ? "http" : "https");
  return process.env["SITE_URL"] || `${proto}://${host}`;
}

/* ───────────── Public: customer submits a request ───────────── */

export const submitReservation = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = reservationSchema.parse(input);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(parsed.reservation_date + "T00:00:00") < today) {
      throw new Error("Please choose today or a future date");
    }
    return parsed;
  })
  .handler(async ({ data }) => {
    const { createReservation } = await import("@/lib/reservations.server");
    return createReservation(data, siteOrigin());
  });

/* ───────────── Public: big party enquiry (21–150 guests, email only) ───────────── */

export const bigPartyEnquirySchema = z.object({
  customer_name: z.string().trim().min(2, "Please enter your full name").max(80),
  customer_email: z.string().trim().email("Please enter a valid email address").max(120),
  customer_phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a date"),
  number_of_guests: z.coerce
    .number()
    .int()
    .min(RESERVATION.bigPartyMin, `Big party enquiries start at ${RESERVATION.bigPartyMin} guests`)
    .max(RESERVATION.bigPartyMax, `For parties over ${RESERVATION.bigPartyMax}, please call us`),
  message: z.string().trim().max(500, "Please keep your message under 500 characters").optional(),
});

export type BigPartyEnquiryValues = z.infer<typeof bigPartyEnquirySchema>;

export const submitBigPartyEnquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = bigPartyEnquirySchema.parse(input);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(parsed.event_date + "T00:00:00") < today) {
      throw new Error("Please choose today or a future date");
    }
    return parsed;
  })
  .handler(async ({ data }) => {
    const { sendBigPartyEnquiry } = await import("@/lib/party-enquiry.server");
    return sendBigPartyEnquiry(data);
  });

/* ───────────── Public: email-link landing (token-secured) ───────────── */

const tokenSchema = z.object({ token: z.string().regex(/^[a-f0-9]{64}$/) });

export const getReservationForToken = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => tokenSchema.parse(input))
  .handler(async ({ data }) => {
    const { getReservationByToken, toPublicView } = await import("@/lib/reservations.server");
    const r = await getReservationByToken(data.token);
    return r ? toPublicView(r) : null;
  });

export const decideReservationByToken = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => tokenSchema.extend({ action: z.enum(["confirm", "decline"]) }).parse(input))
  .handler(async ({ data }) => {
    const { decideReservation, toPublicView } = await import("@/lib/reservations.server");
    const result = await decideReservation({ token: data.token }, data.action);
    if (!result.updated) return { updated: false as const };
    return { updated: true as const, emailSent: result.emailSent, reservation: toPublicView(result.reservation) };
  });

/* ───────────── Owner (signed in + admin role) ───────────── */

/**
 * Emails allowed to become admins. The first time one of these accounts signs
 * in, the admin role is granted automatically. EDIT to add more staff.
 */
const OWNER_EMAILS = ["thecrowntreaty@gmail.com"];

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden: admin access required");
}

export const getAdminStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = String((context.claims as { email?: string })?.email ?? "").toLowerCase();
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (data) return { isAdmin: true, email };

    const allowed = (process.env["OWNER_EMAILS"]?.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean) ?? OWNER_EMAILS);
    if (email && allowed.includes(email)) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("user_roles").insert({ user_id: context.userId, role: "admin" });
      if (!error) return { isAdmin: true, email };
    }
    return { isAdmin: false, email };
  });

export const listReservations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("reservations")
      .select(
        "id, reservation_reference, customer_name, customer_email, customer_phone, reservation_date, reservation_time, number_of_guests, special_requests, status, email_error, created_at, confirmed_at, declined_at, cancelled_at",
      )
      .order("reservation_date", { ascending: true })
      .order("reservation_time", { ascending: true })
      .limit(1000);
    if (error) throw new Error(error.message);
    return data;
  });

export const adminDecideReservation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid(), action: z.enum(["confirm", "decline", "cancel"]) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { decideReservation, cancelReservation } = await import("@/lib/reservations.server");
    if (data.action === "cancel") return cancelReservation(data.id);
    const result = await decideReservation({ id: data.id }, data.action);
    return { updated: result.updated, emailSent: result.updated ? result.emailSent : false };
  });
