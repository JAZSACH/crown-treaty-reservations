import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BookButton } from "@/components/site/BookButton";
import { PageHero, Section, SectionHeading, SiteLayout } from "@/components/site/SiteLayout";
import { PUB } from "@/content/pub";
import { pageHead } from "@/lib/seo";
import hero from "@/assets/interior-panelled.jpg";
import exterior from "@/assets/hero-exterior.jpg";
import bar from "@/assets/bar-interior.jpg";
import conservatory from "@/assets/conservatory.jpg";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About — A 16th-Century Grade II* Listed Pub",
      description:
        "Discover the history of The Crown & Treaty, a Grade II* listed pub in Uxbridge with origins in the 16th century, historic wood-panelled rooms, a garden and conservatory.",
      path: "/about",
    }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHero image={hero} eyebrow="Our story" title="About The Crown & Treaty" intro="Centuries of history on Oxford Road, Uxbridge." />

      <Section>
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Heritage"
            title="A historic venue with origins in the 16th century"
            intro={`${PUB.name} is a historic pub in Uxbridge whose origins date back to the 16th century. The building is Grade II* listed — a designation reserved for particularly important buildings of more than special interest — and retains its historic wood-panelled rooms.`}
          />
          <div className="space-y-5 text-lg leading-relaxed opacity-85 lg:pt-16">
            <p>
              Today the pub combines that history with modern gastropub dining and a warm, welcoming atmosphere. Inside you'll find characterful panelled rooms; outside, a garden and conservatory that come into their own in the warmer months.
            </p>
            <p>
              Close to Denham and the Grand Union Canal, it's a natural stopping point for a meal, a drink or a Sunday lunch — and with dedicated function and event spaces, a memorable setting for weddings, parties and business gatherings.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <BookButton />
              <Button asChild variant="outline"><Link to="/functions">Functions & events</Link></Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { img: exterior, cap: "The historic exterior on Oxford Road" },
            { img: bar, cap: "The bar — ales, wines and cocktails" },
            { img: conservatory, cap: "The conservatory and garden" },
          ].map((p) => (
            <figure key={p.cap} className="overflow-hidden rounded-lg bg-card shadow-card">
              <img src={p.img} alt={p.cap} width={1600} height={1072} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <figcaption className="p-4 text-sm text-muted-foreground">{p.cap}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ["16th Century", "Origins of the building"],
            ["Grade II*", "Listed status"],
            ["4 Spaces", "Charles Bar, Crown Room, Treaty Room, Conservatory"],
          ].map(([big, small]) => (
            <div key={big} className="text-center md:text-left">
              <p className="font-serif text-5xl text-brass">{big}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] opacity-80">{small}</p>
            </div>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
