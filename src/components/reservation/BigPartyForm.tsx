import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PUB, RESERVATION } from "@/content/pub";
import { bigPartyEnquirySchema, submitBigPartyEnquiry, type BigPartyEnquiryValues } from "@/lib/reservations.functions";

function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function BigPartyForm() {
  const submit = useServerFn(submitBigPartyEnquiry);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<BigPartyEnquiryValues>({
    resolver: zodResolver(bigPartyEnquirySchema),
    defaultValues: {
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      event_date: "",
      number_of_guests: RESERVATION.bigPartyMin,
      message: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await submit({ data: values });
      setSent(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again or call us.");
    }
  });

  if (sent) {
    return (
      <div className="animate-fade-up py-4 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
        <h3 className="mt-4 text-3xl">Enquiry sent</h3>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Thank you — your big party enquiry has been sent to {PUB.name}. Our team will be in touch to discuss
          your event. Nothing is booked yet.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <a href={PUB.phoneHref}>Call the pub</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.customer_name?.message} className="sm:col-span-2">
          <Input placeholder="Jane Smith" autoComplete="name" {...register("customer_name")} />
        </Field>
        <Field label="Email address" error={errors.customer_email?.message}>
          <Input type="email" placeholder="jane@example.com" autoComplete="email" inputMode="email" {...register("customer_email")} />
        </Field>
        <Field label="Phone number" error={errors.customer_phone?.message}>
          <Input type="tel" placeholder="07700 900000" autoComplete="tel" inputMode="tel" {...register("customer_phone")} />
        </Field>
        <Field label="Preferred date" error={errors.event_date?.message}>
          <Input type="date" min={todayISO()} {...register("event_date")} />
        </Field>
        <Field label={`Number of guests (${RESERVATION.bigPartyMin}–${RESERVATION.bigPartyMax})`} error={errors.number_of_guests?.message}>
          <Input
            type="number"
            min={RESERVATION.bigPartyMin}
            max={RESERVATION.bigPartyMax}
            inputMode="numeric"
            {...register("number_of_guests")}
          />
        </Field>
        <Field label="Tell us about your event (optional)" error={errors.message?.message} className="sm:col-span-2">
          <Textarea rows={3} placeholder="Birthday, wedding reception, wake, corporate event…" {...register("message")} />
        </Field>
      </div>

      {serverError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">{serverError}</p>
      )}

      <Button type="submit" size="xl" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        {isSubmitting ? "Sending enquiry…" : "Send big party enquiry"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Big parties are arranged directly with our team — nothing is booked until we've spoken with you.
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
  error?: string | undefined;
  className?: string | undefined;
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
