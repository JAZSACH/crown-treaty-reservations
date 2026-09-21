import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";
import exterior from "@/assets/hero-exterior.jpg";
import bar from "@/assets/bar-interior.jpg";
import panelled from "@/assets/interior-panelled.jpg";
import roast from "@/assets/food-roast.jpg";
import drinks from "@/assets/drinks.jpg";
import garden from "@/assets/garden.jpg";
import conservatory from "@/assets/conservatory.jpg";
import wedding from "@/assets/wedding.jpg";

/**
 * EDIT ME — Gallery
 * Replace the imported images above with the pub's own photographs
 * (drop them into src/assets and update the imports + list below).
 */
const GALLERY = [
  { src: exterior, category: "Exterior", alt: "The pub exterior" },
  { src: bar, category: "Interior", alt: "The bar" },
  { src: panelled, category: "Function rooms", alt: "Wood-panelled function room" },
  { src: roast, category: "Food", alt: "Sunday roast" },
  { src: drinks, category: "Drinks", alt: "Cocktails and ale" },
  { src: garden, category: "Garden", alt: "The garden" },
  { src: conservatory, category: "Conservatory", alt: "The conservatory" },
  { src: wedding, category: "Events", alt: "Wedding ceremony set-up" },
];

const CATEGORIES = ["All", ...Array.from(new Set(GALLERY.map((g) => g.category)))];

export const Route = createFileRoute("/gallery")({
  head: () =>
    pageHead({
      title: "Gallery — Inside The Crown & Treaty",
      description: "Photos of The Crown & Treaty, Uxbridge: the historic exterior, wood-panelled interiors, food, drinks, garden, function rooms, conservatory and events.",
      path: "/gallery",
    }),
  component: Gallery,
});

function Gallery() {
  const [active, setActive] = useState("All");
  const items = active === "All" ? GALLERY : GALLERY.filter((g) => g.category === active);

  return (
    <SiteLayout>
      <PageHero image={garden} eyebrow="Gallery" title="A look around" intro="The exterior, interiors, food, drinks, garden and event spaces." />
      <Section>
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors",
                active === c ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>figure]:mb-5 [&>figure]:break-inside-avoid">
          {items.map((g, i) => (
            <figure key={g.alt} className="group relative overflow-hidden rounded-lg shadow-card animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <img src={g.src} alt={g.alt} width={1600} height={1072} loading="lazy" className={cn("w-full object-cover transition-transform duration-700 group-hover:scale-105", i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]")} />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/80 to-transparent p-4 text-primary-foreground">
                <p className="text-[0.62rem] uppercase tracking-[0.24em] text-brass">{g.category}</p>
                <p className="font-serif text-lg">{g.alt}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
