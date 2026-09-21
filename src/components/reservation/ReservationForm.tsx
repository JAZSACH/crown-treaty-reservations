import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PUB, RESERVATION } from "@/content/pub";
import { reservationSchema, submitReservation, type ReservationFormValues } from "@/lib/reservations.functions";
import { formatReservationTime } from "@/lib/reservation-format";

function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

type Props = { compact?: boolean; onSuccess?: () => void };

export function ReservationForm({ compact, onSuccess }: Props) {
  const submit = useServerFn(submitReservation);
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      reservation_date: "",
      reservation_time: "",
      number_of_guests: 2,
      special_requests: "",
    },
  });

  const { register, handleSubmit, setValue, watch, formState } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const res = await submit({ data: values });
      setResult({ reference: res.reservation_reference });
      onSuccess?.();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again or call us.");
    }
  });

  if (result) {
    return (
      <div className="animate-fade-up py-4 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h3 className="mt-4 text-3xl">Reservation request received</h3>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Your reservation request has been received and is currently pending confirmation from {PUB.name}. You
          will receive another email once your reservation has been confirmed or declined.
        </p>
        <p className="mt-5 text-sm">
          Reference <span className="font-semibold text-primary">#{result.reference}</span>
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Please note: your table is <strong className="text-foreground">not confirmed yet</strong>.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <a href={PUB.phoneHref}>Call the pub</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className={compact ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Full name" error={errors.customer_name?.message} className="sm:col-span-2">
          <Input placeholder="Jane Smith" autoComplete="name" inputMode="text" {...register("customer_name")} />
        </Field>
        <Field label="Email address" error={errors.customer_email?.message}>
          <Input type="email" placeholder="jane@example.com" autoComplete="email" inputMode="email" {...register("customer_email")} />
        </Field>
        <Field label="Phone number" error={errors.customer_phone?.message}>
          <Input type="tel" placeholder="07700 900000" autoComplete="tel" inputMode="tel" {...register("customer_phone")} />
        </Field>
        <Field label="Date" error={errors.reservation_date?.message}>
          <Input type="date" min={todayISO()} {...register("reservation_date")} />
        </Field>
        <Field label="Time" error={errors.reservation_time?.message}>
          <Select value={watch("reservation_time")} onValueChange={(v) => setValue("reservation_time", v, { shouldValidate: true })}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Choose a time" /></SelectTrigger>
            <SelectContent>
              {RESERVATION.timeSlots.map((t) => (
                <SelectItem key={t} value={t}>{formatReservationTime(t)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Number of guests" error={errors.number_of_guests?.message} className="sm:col-span-2">
          <Select
            value={String(watch("number_of_guests"))}
            onValueChange={(v) => setValue("number_of_guests", Number(v), { shouldValidate: true })}
          >
            <SelectTrigger className="h-11"><SelectValue placeholder="Guests" /></SelectTrigger>
            <SelectContent>
              {Array.from({ length: RESERVATION.maxGuests - RESERVATION.minGuests + 1 }, (_, i) => i + RESERVATION.minGuests).map((n) => (
                <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "guest" : "guests"}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-1.5 text-xs text-muted-foreground">{RESERVATION.largePartyNote}</p>
        </Field>
        <Field label="Special requests (optional)" error={errors.special_requests?.message} className="sm:col-span-2">
          <Textarea rows={3} placeholder="Allergies, high chair, a birthday, a preferred room…" {...register("special_requests")} />
        </Field>
      </div>

      {serverError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{serverError}</p>
      )}

      <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        {isSubmitting ? "Sending request…" : "Request a table"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Requests are reviewed by the team. Your table is only confirmed once you receive a confirmation email.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
