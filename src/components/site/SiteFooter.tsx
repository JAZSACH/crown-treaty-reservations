import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIRECTIONS_URL, KITCHEN_HOURS, OPENING_HOURS, PUB } from "@/content/pub";
import { NAV } from "./SiteHeader";

export function SiteFooter() {
  return (
    <footer className="wood-texture text-charcoal-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl tracking-[0.12em] uppercase">The Crown &amp; Treaty</p>
          <p className="mt-1 text-[0.62rem] tracking-[0.42em] uppercase text-brass">Uxbridge</p>
          <p className="mt-5 max-w-xs text-sm leading-relaxed opacity-80">
            A historic Grade II* listed pub on Oxford Road, serving good food and great drinks in 16th-century surroundings.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="outline-light" size="sm"><a href={PUB.phoneHref}><Phone /> Call</a></Button>
            <Button asChild variant="outline-light" size="sm"><a href={`mailto:${PUB.email}`}><Mail /> Email</a></Button>
            <Button asChild variant="outline-light" size="sm"><a href={DIRECTIONS_URL} target="_blank" rel="noreferrer"><MapPin /> Directions</a></Button>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-4">Find us</p>
          <address className="not-italic text-sm leading-7 opacity-90">
            {PUB.addressLine1}<br />{PUB.addressLine2}<br />{PUB.postcode}
          </address>
          <p className="mt-4 text-sm leading-7">
            <a href={PUB.phoneHref} className="hover:text-brass">{PUB.phone}</a><br />
            <a href={`mailto:${PUB.email}`} className="hover:text-brass">{PUB.email}</a>
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">Opening hours</p>
          <HoursList rows={OPENING_HOURS} />
        </div>

        <div>
          <p className="eyebrow mb-4">Kitchen hours</p>
          <HoursList rows={KITCHEN_HOURS} />
        </div>
      </div>

      <div className="border-t border-sidebar-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs opacity-70 md:flex-row md:items-center md:justify-between md:px-8">
          <nav className="flex flex-wrap gap-x-5 gap-y-2 uppercase tracking-[0.18em]">
            {NAV.map((n) => <Link key={n.to} to={n.to} className="hover:text-brass">{n.label}</Link>)}
            <Link to="/admin" className="hover:text-brass">Owner login</Link>
          </nav>
          <p>© {new Date().getFullYear()} {PUB.name}, {PUB.town}.</p>
        </div>
      </div>
    </footer>
  );
}

function HoursList({ rows }: { rows: { day: string; open: string; close: string }[] }) {
  return (
    <ul className="space-y-1.5 text-sm">
      {rows.map((r) => (
        <li key={r.day} className="flex justify-between gap-4 border-b border-sidebar-border/60 pb-1.5">
          <span className="opacity-80">{r.day}</span>
          <span className="tabular-nums">{r.open} – {r.close}</span>
        </li>
      ))}
    </ul>
  );
}
