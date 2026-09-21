import { createFileRoute } from "@tanstack/react-router";
import { Accessibility, Car, CreditCard, Dog, Mail, MapPin, Phone, TreePine, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookButton } from "@/components/site/BookButton";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { DIRECTIONS_URL, FACILITIES, FULL_ADDRESS, KITCHEN_HOURS, MAP_EMBED_URL, OPENING_HOURS, PUB } from "@/content/pub";
import { pageHead } from "@/lib/seo";
import hero from "@/assets/hero-exterior.jpg";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Location, Contact & Opening Hours",
      description: `Find The Crown & Treaty at ${FULL_ADDRESS}. Call 020 3198 4186, get directions, and see bar and kitchen opening hours. Parking, garden, dog friendly, free Wi-Fi.`,
      path: "/contact",
    }),
  component: Contact,
});

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Parking: Car,
  "Accessible facilities": Accessibility,
  "Free Wi-Fi": Wifi,
  Garden: TreePine,
  "Dog friendly": Dog,
  "Card payments": CreditCard,
};

function Contact() {
  return (
    <SiteLayout>
      <PageHero image={hero} eyebrow="Find us" title="Location & Contact" intro="On Oxford Road in Uxbridge, close to Denham and the Grand Union Canal." />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-4xl uppercase tracking-[0.06em]">{PUB.name}</h2>
            <span className="rule-brass mt-4" />
            <address className="mt-6 text-lg not-italic leading-8">
              {PUB.addressLine1}<br />{PUB.addressLine2}<br />{PUB.postcode}
            </address>
            <p className="mt-5 text-2xl font-semibold"><a href={PUB.phoneHref} className="hover:text-primary">{PUB.phone}</a></p>
            <p className="mt-1 text-lg"><a href={`mailto:${PUB.email}`} className="text-primary underline-offset-4 hover:underline">{PUB.email}</a></p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button asChild variant="brass" size="lg"><a href={DIRECTIONS_URL} target="_blank" rel="noreferrer"><MapPin /> Get directions</a></Button>
              <BookButton size="lg" />
              <Button asChild variant="outline" size="lg"><a href={PUB.phoneHref}><Phone /> Call the pub</a></Button>
              <Button asChild variant="outline" size="lg"><a href={`mailto:${PUB.email}`}><Mail /> Email us</a></Button>
            </div>

            <h3 className="mt-12 text-2xl">Facilities</h3>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {FACILITIES.map((f) => {
                const Icon = ICONS[f] ?? MapPin;
                return (
                  <li key={f} className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-sm shadow-card">
                    <Icon className="h-4 w-4 text-brass" /> {f}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="overflow-hidden rounded-lg border border-border shadow-lift">
            <iframe
              title={`Map showing ${PUB.name}, ${FULL_ADDRESS}`}
              src={MAP_EMBED_URL}
              className="h-[420px] w-full lg:h-full lg:min-h-[560px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>

      <Section tone="green">
        <div className="grid gap-12 md:grid-cols-2">
          <HoursBlock title="Opening hours" rows={OPENING_HOURS} />
          <HoursBlock title="Kitchen hours" rows={KITCHEN_HOURS} />
        </div>
      </Section>
    </SiteLayout>
  );
}

function HoursBlock({ title, rows }: { title: string; rows: { day: string; open: string; close: string }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      <ul className="mt-5 space-y-2.5">
        {rows.map((r) => (
          <li key={r.day} className="flex justify-between border-b border-primary-foreground/15 pb-2 text-base">
            <span className="opacity-85">{r.day}</span><span className="tabular-nums">{r.open} – {r.close}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
