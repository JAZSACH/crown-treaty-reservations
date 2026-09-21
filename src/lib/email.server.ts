/**
 * Server-only email sender (Resend via the Lovable connector gateway).
 *
 * Configuration (Project → Secrets / connector):
 *  - RESEND_API_KEY      injected when the Resend connector is linked
 *  - LOVABLE_API_KEY     injected automatically
 *  - RESTAURANT_EMAIL    where owner notifications go (default below)
 *  - EMAIL_FROM          the sender address. Defaults to Resend's shared test
 *                        sender "onboarding@resend.dev" (no domain required).
 */
import { PUB } from "@/content/pub";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

export const DEFAULT_RESTAURANT_EMAIL = "thecrowntreaty@gmail.com";

export function getRestaurantEmail() {
  return process.env["RESTAURANT_EMAIL"] || DEFAULT_RESTAURANT_EMAIL;
}

export function getFromAddress() {
  const from = process.env["EMAIL_FROM"] || "onboarding@resend.dev";
  return `${PUB.name} <${from}>`;
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type SendEmailResult = { ok: true; id?: string | undefined } | { ok: false; error: string };

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const LOVABLE_API_KEY = process.env["LOVABLE_API_KEY"];
  const RESEND_API_KEY = process.env["RESEND_API_KEY"];

  if (!RESEND_API_KEY || !LOVABLE_API_KEY) {
    const error = "Email is not configured yet (Resend connection missing).";
    console.warn(`[email] ${error}`);
    return { ok: false, error };
  }

  try {
    const response = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: getFromAddress(),
        to: [input.to],
        subject: input.subject,
        html: input.html,
        text: input.text,
        reply_to: input.replyTo,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[email] send failed [${response.status}] to ${input.to}: ${body}`);
      return { ok: false, error: `Email provider error ${response.status}: ${body.slice(0, 300)}` };
    }

    const data = (await response.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[email] send threw for ${input.to}: ${message}`);
    return { ok: false, error: message };
  }
}
