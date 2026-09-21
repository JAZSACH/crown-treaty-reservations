import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading, SiteLayout } from "@/components/site/SiteLayout";
import { PUB } from "@/content/pub";
import { pageHead } from "@/lib/seo";
import hero from "@/assets/wedding.jpg";
import panelled from "@/assets/interior-panelled.jpg";
import garden from "@/assets/garden.jpg";
import conservatory from "@/assets/conservatory.jpg";

export const Route = createFileRoute("/weddings")({
  head: () =>
    pageHead({
      title: "Wedding Venue in Uxbridge — Licensed for Civil Ceremonies",
      description:
        "Get married at The Crown & Treaty, Uxbridge. Historic Grade II* listed rooms licensed for civil wedding ceremonies, with spaces for receptions and celebrations.",
      path: "/weddings",
    }),
  component: Weddings,
});

const MAILTO = `mailto:${PUB.email}?subject=${encodeURIComponent("Wedding enquiry — The Crown & Treaty")}&body=${encodeURIComponent(
  "Hello,\n\nWe're planning our wedding and would love to know more about The Crown & Treaty.\n\nPreferred date(s):\nApproximate number of guests:\nCeremony, reception or both:\n\nNames:\nPhone:\n",
)}`;

function Weddings() {
  return (
    <SiteLayout>
      <PageHero image={hero} eyebrow="Weddings" title="Say 'I do' in historic surroundings" intro="Historic rooms licensed for civil wedding ceremonies in the heart of Uxbridge." />

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Ceremonies & receptions"
            title="A 16th-century setting for your day"
            intro={`${PUB.name} has historic rooms licensed for civil wedding ceremonies, so you can marry and celebrate in one place. From an intimate ceremony in a wood-panelled room to a reception that spills into the garden, our team will help shape a day that feels entirely yours.`}
          />
          <div className="grid grid-cols-2 gap-4">
            <img src={panelled} alt="Wood-panelled room set for a wedding" width={1600} height={1072} loading="lazy" className="col-span-2 aspect-[16/9] rounded-lg object-cover shadow-card" />
            <img src={garden} alt="The garden" width={1600} height={1072} loading="lazy" className="aspect-square rounded-lg object-cover shadow-card" />
            <img src={conservatory} alt="The conservatory" width={1600} height={1072} loading="lazy" className="aspect-square rounded-lg object-cover shadow-card" />
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Licensed ceremonies", "Historic rooms licensed for civil wedding ceremonies."],
            ["Receptions & parties", "Function rooms, the Charles Bar with its own terrace, and the garden."],
            ["Dedicated team", "We'll work with you on the details, from timings to menus."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-lg border border-border bg-card p-7 shadow-card">
              <h3 className="text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Every wedding is different — get in touch and we'll talk through options, availability and what's possible. See also our <Link to="/functions" className="text-primary underline-offset-4 hover:underline">function spaces</Link>.
        </p>
      </Section>

      <Section tone="green">
        <div className="text-center">
          <p className="eyebrow">Start planning</p>
          <h2 className="mt-3 text-4xl md:text-6xl">Plan your wedding</h2>
          <p className="mx-auto mt-4 max-w-xl opacity-85">Tell us about your day and we'll arrange a time to show you around.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="brass" size="xl"><a href={MAILTO}><Mail /> Plan your wedding</a></Button>
            <Button asChild variant="outline-light" size="xl"><a href={PUB.phoneHref}><Phone /> Call the pub</a></Button>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
