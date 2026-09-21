import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PUB } from "@/content/pub";
import { decideReservationByToken, getReservationForToken } from "@/lib/reservations.functions";
import { formatReservationDate, formatReservationTime, STATUS_LABEL } from "@/lib/reservation-format";
import { pageHead } from "@/lib/seo";

const searchSchema = z.object({
  token: z.string().optional(),
  action: z.enum(["confirm", "decline"]).optional(),
});

export const Route = createFileRoute("/reservation/manage")({
  validateSearch: searchSchema,
  head: () => ({
    ...pageHead({ title: "Manage reservation", description: "Confirm or decline a table reservation request at The Crown & Treaty." }),
    meta: [...pageHead({ title: "Manage reservation", description: "Confirm or decline a reservation." }).meta, { name: "robots", content: "noindex" }],
  }),
  component: ManageReservation,
});

function ManageReservation() {
  const { token, action } = Route.useSearch();
  const getFn = useServerFn(getReservationForToken);
  const decideFn = useServerFn(decideReservationByToken);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<null | { action: "confirm" | "decline"; emailSent: boolean }>(null);
  const [error, setError] = useState<string | null>(null);

  const valid = !!token && /^[a-f0-9]{64}$/.test(token);
  const { data, isLoading } = useQuery({
    queryKey: ["reservation-token", token],
    queryFn: () => getFn({ data: { token: token! } }),
    enabled: valid,
  });

  async function decide(a: "confirm" | "decline") {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const res = await decideFn({ data: { token, action: a } });
      if (!res.updated) {
        setError("This reservation has already been confirmed or declined and can't be changed from this link.");
        qc.invalidateQueries({ queryKey: ["reservation-token", token] });
      } else {
        setDone({ action: a, emailSent: res.emailSent });
        qc.invalidateQueries({ queryKey: ["reservation-token", token] });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream-deep/40 px-4 py-12">
      <div className="mx-auto max-w-lg">
        <div className="surface-green rounded-t-lg px-8 py-7 text-center">
          <p className="text-[0.62rem] tracking-[0.4em] uppercase text-brass">Owner reservation review</p>
          <p className="mt-2 font-serif text-3xl tracking-[0.08em] uppercase">{PUB.name}</p>
        </div>
        <div className="rounded-b-lg border border-t-0 border-border bg-card p-8 shadow-lift">
          {!valid ? (
            <Empty title="Invalid link" text="This reservation link is not valid." />
          ) : isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : !data ? (
            <Empty title="Reservation not found" text="We couldn't find a reservation for this link." />
          ) : done ? (
            <div className="text-center">
              {done.action === "confirm" ? <CheckCircle2 className="mx-auto h-12 w-12 text-success" /> : <XCircle className="mx-auto h-12 w-12 text-destructive" />}
              <h1 className="mt-4 text-3xl">
                {done.action === "confirm" ? "Reservation confirmed successfully." : "Reservation declined successfully."}
              </h1>
              <p className="mt-3 text-muted-foreground">
                {done.emailSent
                  ? `${data.customer_name} has been emailed.`
                  : `The status was saved, but the email to ${data.customer_name} could not be sent. Please contact them on ${data.customer_phone}.`}
              </p>
              <Button asChild variant="outline" className="mt-6"><Link to="/admin">Open dashboard</Link></Button>
            </div>
          ) : (
            <>
              <p className="eyebrow">Reservation #{data.reservation_reference}</p>
              <h1 className="mt-2 text-3xl">{data.customer_name}</h1>
              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <Dt>Date</Dt><dd>{formatReservationDate(data.reservation_date)}</dd>
                <Dt>Time</Dt><dd>{formatReservationTime(data.reservation_time)}</dd>
                <Dt>Guests</Dt><dd>{data.number_of_guests}</dd>
                <Dt>Phone</Dt><dd><a href={`tel:${data.customer_phone}`} className="text-primary">{data.customer_phone}</a></dd>
                <Dt>Email</Dt><dd className="break-all">{data.customer_email}</dd>
                <Dt>Requests</Dt><dd>{data.special_requests || "—"}</dd>
                <Dt>Status</Dt><dd className="font-semibold uppercase tracking-wider">{STATUS_LABEL[data.status] ?? data.status}</dd>
              </dl>

              {data.status !== "pending" ? (
                <p className="mt-6 rounded-md bg-muted px-4 py-3 text-sm">
                  This reservation is already <strong>{(STATUS_LABEL[data.status] ?? data.status).toLowerCase()}</strong> and can no longer be changed from this link.
                </p>
              ) : (
                <div className="mt-8 grid gap-3">
                  {action && (
                    <p className="text-center text-sm text-muted-foreground">
                      You chose to <strong>{action}</strong> this reservation. Please confirm below.
                    </p>
                  )}
                  <Button size="xl" onClick={() => decide("confirm")} disabled={busy} className={action === "decline" ? "opacity-70" : ""}>
                    {busy ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Confirm reservation
                  </Button>
                  <Button size="xl" variant="destructive" onClick={() => decide("decline")} disabled={busy} className={action === "confirm" ? "opacity-70" : ""}>
                    {busy ? <Loader2 className="animate-spin" /> : <XCircle />} Decline reservation
                  </Button>
                  {error && <p className="text-center text-sm text-destructive">{error}</p>}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Dt({ children }: { children: React.ReactNode }) {
  return <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{children}</dt>;
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="py-6 text-center">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-2 text-muted-foreground">{text}</p>
      <Button asChild variant="outline" className="mt-6"><Link to="/">Back to site</Link></Button>
    </div>
  );
}
