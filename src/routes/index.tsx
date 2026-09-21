import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookButton } from "@/components/site/BookButton";
import { ContactButtons, Section, SectionHeading, SiteLayout } from "@/components/site/SiteLayout";
import { FULL_ADDRESS, KITCHEN_HOURS, OPENING_HOURS, PUB } from "@/content/pub";
import { WHATS_ON } from "@/content/whats-on";
import { pageHead } from "@/lib/seo";

import hero from "@/assets/hero-exterior.jpg";
import roast from "@/assets/food-roast.jpg";
import drinks from "@/assets/drinks.jpg";
import garden from "@/assets/garden.jpg";
import panelled from "@/assets/interior-panelled.jpg";
import wedding from "@/assets/wedding.jpg";
import bar from "@/assets/bar-interior.jpg";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Historic Pub, Gastropub Dining & Sunday Roast",
      description:
        "The Crown & Treaty, Uxbridge: a Grade II* listed 16th-century pub on Oxford Road serving good food, great drinks and Sunday roasts, with a garden, private function rooms and weddings.",
      path: "/",
    }),
  component: Index,
});

const FEATURES = [
  { title: "Food & Dining", text: "Comforting, well-cooked pub food served in historic wood-panelled rooms.", image: roast, to: "/menu" },
  { title: "Drinks", text: "Local ales, craft beers, carefully chosen wines and classic cocktails.", image: drinks, to: "/menu" },
  { title: "Sunday Lunch", text: "Traditional roasts every Sunday from midday until the kitchen closes.", image: roast, to: "/menu" },
  { title: "The Garden", text: "Eat and drink outdoors in our garden, close to the Grand Union Canal.", image: garden, to: "/gallery" },
  { title: "Private Functions", text: "The Charles Bar, Crown Room, Treaty Room and Conservatory for your event.", image: panelled, to: "/functions" },
  { title: "Weddings & Celebrations", text: "Historic rooms licensed for civil ceremonies, receptions and parties.", image: wedding, to: "/weddings" },
] as const;

function Index() {
  return (
    <SiteLayout transparentHeader>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden text-center text-primary-foreground">
        <img
          src={hero}
          alt="The Crown & Treaty pub exterior at dusk"
          width={1920}
          height={1088}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 pt-24 pb-28 animate-fade-up">
          <p className="eyebrow">Est. 16th Century · Grade II* Listed</p>
          <h1 className="mt-5 text-6xl leading-[0.95] tracking-[0.06em] uppercase sm:text-7xl md:text-8xl">
            The Crown<br />&amp; Treaty
          </h1>
          <p className="mt-3 text-sm tracking-[0.5em] uppercase text-brass">Uxbridge</p>
          <p className="mx-auto mt-8 max-w-xl font-serif text-2xl italic md:text-3xl">
            Good Food. Great Drinks. Historic Surroundings.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BookButton variant="brass" size="xl" className="w-full sm:w-auto" />
            <Button asChild variant="outline-light" size="xl" className="w-full sm:w-auto">
              <Link to="/menu">View menu</Link>
            </Button>
          </div>
          <p className="mt-10 inline-flex items-center gap-2 text-sm tracking-wide opacity-90">
            <MapPin className="h-4 w-4 text-brass" /> {FULL_ADDRESS}
          </p>
        </div>
      </section>

      {/* INTRO */}
      <Section tone="light">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Welcome"
              title="A historic Uxbridge pub with a warm welcome"
              intro={`${PUB.name} is a historic pub on Oxford Road, Uxbridge, close to Denham and the Grand Union Canal. Dating back to the 16th century and Grade II* listed, it brings together characterful wood-panelled rooms, a garden and conservatory, and modern gastropub dining — a place for a quiet pint, Sunday lunch with family, or a celebration to remember.`}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild><Link to="/about">Our story <ArrowRight /></Link></Button>
              <BookButton variant="outline" />
            </div>
          </div>
          <div className="relative">
            <img src={bar} alt="Inside the bar at The Crown & Treaty" width={1600} height={1072} loading="lazy" className="rounded-lg shadow-lift" />
            <img src={panelled} alt="Wood-panelled dining room" width={1600} height={1072} loading="lazy" className="absolute -bottom-8 -left-6 hidden w-2/5 rounded-lg border-4 border-background shadow-lift md:block" />
          </div>
        </div>
      </Section>

      {/* FEATURE GRID */}
      <Section tone="cream">
        <SectionHeading eyebrow="At the Crown & Treaty" title="Food, drink, garden and gatherings" align="center" />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Link
              key={f.title}
              to={f.to}
              className="group overflow-hidden rounded-lg bg-card shadow-card transition-all duration-500 hover:-translate-y-1 hover:shadow-lift"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={f.image} alt={f.title} width={1600} height={1072} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Discover <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* SUNDAY LUNCH BANNER */}
      <section className="relative overflow-hidden">
        <img src={roast} alt="Sunday roast" width={1600} height={1072} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="relative mx-auto max-w-7xl px-5 py-28 text-primary-foreground md:px-8">
          <div className="max-w-xl">
            <p className="eyebrow">Every Sunday</p>
            <h2 className="mt-3 text-5xl md:text-6xl">Sunday Lunch in Uxbridge</h2>
            <p className="mt-5 text-lg opacity-90">
              Traditional roasts served from 12pm every Sunday. Tables fill quickly — booking ahead is recommended.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton variant="brass" size="lg">Book Sunday lunch</BookButton>
              <Button asChild variant="outline-light" size="lg"><Link to="/menu">View menu</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT'S ON */}
      <Section tone="light">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <SectionHeading eyebrow="What's On" title="Events & entertainment" intro="From Sunday lunch to live entertainment and private celebrations, there's always something happening." />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {WHATS_ON.map((e) => (
              <div key={e.title} className="rounded-lg border border-border bg-card p-6 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">{e.when}</p>
                <h3 className="mt-2 text-2xl">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* HOURS + CONTACT */}
      <Section tone="green">
        <div className="grid gap-12 lg:grid-cols-3">
          <div>
            <p className="eyebrow">Visit us</p>
            <h2 className="mt-3 text-4xl">Opening hours</h2>
            <span className="rule-brass mt-5" />
            <address className="mt-6 not-italic leading-7 opacity-90">
              {PUB.addressLine1}<br />{PUB.addressLine2}<br />{PUB.postcode}
            </address>
            <p className="mt-3 font-semibold">{PUB.phone}</p>
            <div className="mt-6"><ContactButtons light /></div>
          </div>
          <Hours title="Bar" rows={OPENING_HOURS} />
          <Hours title="Kitchen" rows={KITCHEN_HOURS} />
        </div>
      </Section>
    </SiteLayout>
  );
}

function Hours({ title, rows }: { title: string; rows: { day: string; open: string; close: string }[] }) {
  return (
    <div>
      <h3 className="text-2xl">{title}</h3>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.day} className="flex justify-between border-b border-primary-foreground/15 pb-2 text-sm">
            <span className="opacity-80">{r.day}</span>
            <span className="tabular-nums">{r.open} – {r.close}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
