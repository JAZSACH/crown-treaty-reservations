import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading, SiteLayout } from "@/components/site/SiteLayout";
import { EVENT_TYPES, PUB, SPACES } from "@/content/pub";
import { pageHead } from "@/lib/seo";
import hero from "@/assets/interior-panelled.jpg";
import bar from "@/assets/bar-interior.jpg";
import panelled from "@/assets/interior-panelled.jpg";
import wedding from "@/assets/wedding.jpg";
import conservatory from "@/assets/conservatory.jpg";

export const Route = createFileRoute("/functions")({
  head: () =>
    pageHead({
      title: "Function Rooms & Private Events in Uxbridge",
      description:
        "Hire a function room in Uxbridge at The Crown & Treaty: the Charles Bar with its own bar and terrace, the historic Crown Room and Treaty Room, and the Conservatory for intimate gatherings.",
      path: "/functions",
    }),
  component: Functions,
});

const SPACE_IMAGES: Record<string, string> = {
  "charles-bar": bar,
  "crown-room": panelled,
  "treaty-room": wedding,
  conservatory: conservatory,
};

export const ENQUIRY_MAILTO = `mailto:${PUB.email}?subject=${encodeURIComponent("Event enquiry — The Crown & Treaty")}&body=${encodeURIComponent(
  "Hello,\n\nI'd like to enquire about holding an event at The Crown & Treaty.\n\nType of event:\nPreferred date:\nNumber of guests:\nPreferred space (if known):\n\nName:\nPhone:\n",
)}`;

function Functions() {
  return (
    <SiteLayout>
      <PageHero image={hero} eyebrow="Private hire" title="Functions & Events" intro="Multiple historic spaces for parties, private dining, meetings and celebrations." />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <SectionHeading
            eyebrow="Celebrate with us"
            title="Spaces for every occasion"
            intro={`${PUB.name} has multiple spaces suitable for gatherings large and small — from a birthday in the Charles Bar to a business meeting in the Treaty Room. Tell us about your event and we'll help you find the right room.`}
          />
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 self-end text-sm">
            {EVENT_TYPES.map((t) => (
              <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-brass" /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="mt-10">
          <Button asChild variant="brass" size="xl"><a href={ENQUIRY_MAILTO}><Mail /> Enquire about an event</a></Button>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-8 md:grid-cols-2">
          {SPACES.map((s) => (
            <article key={s.slug} className="overflow-hidden rounded-lg bg-card shadow-card transition-all hover:shadow-lift">
              <img src={SPACE_IMAGES[s.slug]} alt={s.name} width={1600} height={1072} loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="p-7">
                <p className="eyebrow">Function space</p>
                <h3 className="mt-2 text-3xl uppercase tracking-[0.06em]">{s.name}</h3>
                <p className="mt-3 text-muted-foreground">{s.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.features.map((f) => (
                    <li key={f} className="rounded-full border border-border px-3 py-1 text-xs uppercase tracking-[0.12em]">{f}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="eyebrow">Planning an event?</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Let's talk about your occasion</h2>
            <p className="mt-3 max-w-xl opacity-80">Call us on {PUB.phone} or send an enquiry and a member of the team will get back to you. Planning a wedding? See our <Link to="/weddings" className="text-brass underline-offset-4 hover:underline">weddings page</Link>.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="brass" size="lg"><a href={ENQUIRY_MAILTO}><Mail /> Enquire about an event</a></Button>
            <Button asChild variant="outline-light" size="lg"><a href={PUB.phoneHref}><Phone /> Call the pub</a></Button>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
