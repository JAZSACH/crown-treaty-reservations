import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ReservationForm } from "@/components/reservation/ReservationForm";
import { BigPartyForm } from "@/components/reservation/BigPartyForm";
import { PartyChoice, type PartyMode } from "@/components/reservation/PartyChoice";
import { Section, SiteLayout } from "@/components/site/SiteLayout";
import { KITCHEN_HOURS, PUB } from "@/content/pub";
import { pageHead } from "@/lib/seo";
import bar from "@/assets/bar-interior.jpg";

export const Route = createFileRoute("/book")({
  head: () =>
    pageHead({
      title: "Book a Table",
      description: "Request a table at The Crown & Treaty, Uxbridge. Choose your date, time and party size — we'll confirm your reservation by email.",
      path: "/book",
    }),
  component: Book,
});

function Book() {
  const [mode, setMode] = useState<PartyMode | null>(null);
  return (
    <SiteLayout>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">Reservations</p>
            <h1 className="mt-3 text-5xl md:text-6xl">Book a table</h1>
            <span className="rule-brass mt-5" />
            <p className="mt-5 text-lg text-muted-foreground">
              Tell us when you'd like to visit and we'll review your request. You'll receive an email as soon as your table is confirmed.
            </p>
            <img src={bar} alt="The bar" width={1600} height={1072} loading="lazy" className="mt-8 hidden rounded-lg shadow-card lg:block" />
            <div className="mt-8 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Kitchen hours</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1">
                {KITCHEN_HOURS.map((r) => <li key={r.day} className="flex justify-between"><span>{r.day.slice(0, 3)}</span><span>{r.open}–{r.close}</span></li>)}
              </ul>
              <p className="mt-4">Prefer to talk? Call <a href={PUB.phoneHref} className="text-primary">{PUB.phone}</a>.</p>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-6 shadow-lift md:p-8">
            {mode === null ? (
              <PartyChoice onChoose={setMode} />
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setMode(null)}
                  className="mb-4 text-sm font-semibold text-primary hover:underline"
                >
                  ← Back to party size
                </button>
                <h2 className="mb-5 text-3xl">{mode === "big" ? "Big party enquiry" : "Book a table"}</h2>
                {mode === "small" ? <ReservationForm /> : <BigPartyForm />}
              </>
            )}
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
