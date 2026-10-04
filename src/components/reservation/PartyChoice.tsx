import { Users, Sparkles } from "lucide-react";
import { RESERVATION } from "@/content/pub";

export type PartyMode = "small" | "big";

export function PartyChoice({ onChoose }: { onChoose: (mode: PartyMode) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onChoose("small")}
        className="group rounded-lg border border-border bg-card p-6 text-left shadow-card transition hover:border-primary/50 hover:shadow-lift"
      >
        <Users className="h-8 w-8 text-primary" />
        <h3 className="mt-4 text-2xl">Small party</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Book a table for up to {RESERVATION.maxGuests} guests. We'll review your request and confirm by email.
        </p>
        <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">
          Book a table →
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChoose("big")}
        className="group rounded-lg border border-border bg-card p-6 text-left shadow-card transition hover:border-primary/50 hover:shadow-lift"
      >
        <Sparkles className="h-8 w-8 text-primary" />
        <h3 className="mt-4 text-2xl">Big party</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Planning a celebration or event for {RESERVATION.bigPartyMin}–{RESERVATION.bigPartyMax} guests? Send us an enquiry and we'll be in touch.
        </p>
        <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">
          Enquire about a big party →
        </span>
      </button>
    </div>
  );
}
