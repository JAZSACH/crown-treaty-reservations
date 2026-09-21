import { createFileRoute } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { BookButton } from "@/components/site/BookButton";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { KITCHEN_HOURS, PUB } from "@/content/pub";
import { MENU, MENU_PLACEHOLDER_NOTICE } from "@/content/menu";
import { pageHead } from "@/lib/seo";
import hero from "@/assets/food-roast.jpg";

export const Route = createFileRoute("/menu")({
  head: () =>
    pageHead({
      title: "Menu — Pub Food, Sunday Roast & Drinks",
      description:
        "Browse the menu at The Crown & Treaty, Uxbridge: comforting pub food, Sunday lunch, desserts, local ales, craft beers, wines and cocktails. Book a table online.",
      path: "/menu",
    }),
  component: Menu,
});

function Menu() {
  return (
    <SiteLayout>
      <PageHero image={hero} eyebrow="Food & Drink" title="Our Menu" intro="Comforting food, Sunday lunch, wines, local ales, craft beers and cocktails." />

      <div className="sticky top-18 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto px-5 py-3 md:px-8">
          <nav className="flex gap-5 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.18em]">
            {MENU.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="py-1 text-muted-foreground hover:text-primary">{s.title}</a>
            ))}
          </nav>
          <BookButton size="sm" className="hidden lg:inline-flex" />
        </div>
      </div>

      <Section>
        <p className="mx-auto mb-14 max-w-2xl rounded-md border border-brass/40 bg-brass/10 px-4 py-3 text-center text-sm">{MENU_PLACEHOLDER_NOTICE}</p>

        <div className="grid gap-20">
          {MENU.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-36">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl">{section.title}</h2>
                <span className="rule-brass mx-auto mt-4" />
                {section.note && <p className="mt-4 text-muted-foreground">{section.note}</p>}
              </div>
              <ul className="mx-auto mt-10 grid max-w-4xl gap-x-12 gap-y-6 md:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item.name} className="border-b border-border pb-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl">
                        {item.name}
                        {item.tags?.length ? (
                          <span className="ml-2 inline-flex gap-1 align-middle">
                            {item.tags.map((t) => (
                              <span key={t} title={t === "v" ? "Vegetarian" : t === "vg" ? "Vegan" : "Gluten free"} className="inline-flex items-center rounded-sm bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-primary">
                                {t === "v" ? <Leaf className="h-3 w-3" /> : t}
                              </span>
                            ))}
                          </span>
                        ) : null}
                      </h3>
                      {item.price && <span className="shrink-0 font-serif text-lg text-brass">{item.price}</span>}
                    </div>
                    {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-16 text-center text-sm text-muted-foreground">
          Please let us know about any allergies or dietary requirements when booking or ordering.
        </p>
      </Section>

      <Section tone="green">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Kitchen hours</p>
            <h2 className="mt-3 text-4xl">Food is served</h2>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {KITCHEN_HOURS.map((r) => (
                <li key={r.day} className="flex justify-between border-b border-primary-foreground/15 pb-1.5 text-sm">
                  <span className="opacity-80">{r.day}</span><span className="tabular-nums">{r.open} – {r.close}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg bg-background p-8 text-foreground shadow-lift">
            <h3 className="text-3xl">Join us for a meal</h3>
            <p className="mt-2 text-muted-foreground">Request a table and we'll confirm by email. For larger parties call {PUB.phone}.</p>
            <BookButton size="lg" className="mt-6 w-full" />
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
