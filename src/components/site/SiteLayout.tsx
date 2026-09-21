import type { ReactNode } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIRECTIONS_URL, PUB } from "@/content/pub";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BookButton } from "./BookButton";

export function SiteLayout({ children, transparentHeader = false }: { children: ReactNode; transparentHeader?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader transparent={transparentHeader} />
      <main className={transparentHeader ? "flex-1" : "flex-1 pt-18"}>{children}</main>
      <SiteFooter />
      {/* Sticky mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <BookButton size="lg" className="w-full" />
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}

/** Page hero used on inner pages */
export function PageHero({ image, eyebrow, title, intro }: { image: string; eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative flex min-h-[52vh] items-end overflow-hidden">
      <img src={image} alt="" width={1600} height={1072} className="absolute inset-0 h-full w-full object-cover animate-slow-zoom" />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-40 text-primary-foreground md:px-8 animate-fade-up">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-5xl md:text-7xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg opacity-90">{intro}</p>}
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
  tone = "light",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark" | "green" | "cream";
  id?: string;
}) {
  const tones = {
    light: "bg-background",
    cream: "bg-cream-deep/50",
    dark: "surface-dark",
    green: "surface-green",
  };
  return (
    <section id={id} className={`${tones[tone]} py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">{children}</div>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, intro, align = "left" }: { eyebrow: string; title: string; intro?: string; align?: "left" | "center" }) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-4xl md:text-5xl">{title}</h2>
      <span className={`rule-brass mt-5 ${align === "center" ? "mx-auto" : ""}`} />
      {intro && <p className="mt-5 text-lg leading-relaxed opacity-85">{intro}</p>}
    </div>
  );
}

export function ContactButtons({ light = false }: { light?: boolean }) {
  const variant = light ? "outline-light" : "outline";
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild variant={variant}><a href={PUB.phoneHref}><Phone /> Call the pub</a></Button>
      <Button asChild variant={variant}><a href={`mailto:${PUB.email}`}><Mail /> Email us</a></Button>
      <Button asChild variant={variant}><a href={DIRECTIONS_URL} target="_blank" rel="noreferrer"><MapPin /> Get directions</a></Button>
    </div>
  );
}
