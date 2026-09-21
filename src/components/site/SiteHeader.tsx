import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookButton } from "./BookButton";
import { PUB } from "@/content/pub";
import { cn } from "@/lib/utils";

export const NAV = [
  { to: "/about", label: "About" },
  { to: "/menu", label: "Menu" },
  { to: "/functions", label: "Functions" },
  { to: "/weddings", label: "Weddings" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        solid ? "surface-dark shadow-lift" : "bg-transparent text-primary-foreground",
      )}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/" className="group flex flex-col leading-none" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl tracking-[0.12em] uppercase md:text-2xl">The Crown &amp; Treaty</span>
          <span className="mt-1 text-[0.6rem] tracking-[0.42em] uppercase text-brass">Uxbridge · Est. 16th C.</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-[0.78rem] font-semibold tracking-[0.2em] uppercase opacity-85 transition-opacity hover:opacity-100 [&.active]:text-brass [&.active]:opacity-100"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="ghost" size="sm" className="text-inherit hover:bg-primary-foreground/10 hover:text-inherit">
            <a href={PUB.phoneHref}><Phone /> {PUB.phone}</a>
          </Button>
          <BookButton variant="brass" size="sm" />
        </div>

        <button
          className="rounded-md p-2 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="surface-dark border-t border-sidebar-border px-5 pb-8 pt-4 lg:hidden animate-fade-in">
          <nav className="flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="border-b border-sidebar-border py-4 font-serif text-2xl [&.active]:text-brass"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 grid gap-3">
            <BookButton variant="brass" size="lg" className="w-full" />
            <Button asChild variant="outline-light" size="lg" className="w-full">
              <a href={PUB.phoneHref}><Phone /> Call the pub</a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
