import { FULL_ADDRESS, OPENING_HOURS_SCHEMA, PUB } from "@/content/pub";

export function pageHead(opts: { title: string; description: string; path?: string }) {
  const title = `${opts.title} | ${PUB.name}, Uxbridge`;
  return {
    meta: [
      { title },
      { name: "description", content: opts.description },
      { property: "og:title", content: title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: PUB.name },
      { property: "og:locale", content: "en_GB" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: opts.description },
      { name: "geo.region", content: "GB-HIL" },
      { name: "geo.placename", content: "Uxbridge" },
    ],
    links: opts.path ? [{ rel: "canonical", href: `${PUB.siteUrl}${opts.path}` }] : [],
  };
}

export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["BarOrPub", "Restaurant"],
  name: PUB.name,
  description:
    "Historic Grade II* listed 16th-century pub in Uxbridge offering gastropub dining, Sunday lunch, garden, private function rooms and licensed wedding ceremonies.",
  url: PUB.siteUrl,
  telephone: "+44 20 3198 4186",
  email: PUB.email,
  servesCuisine: ["British", "Gastropub"],
  address: {
    "@type": "PostalAddress",
    streetAddress: PUB.addressLine1,
    addressLocality: PUB.addressLine2,
    postalCode: PUB.postcode,
    addressCountry: "GB",
  },
  geo: { "@type": "GeoCoordinates", latitude: PUB.lat, longitude: PUB.lng },
  openingHoursSpecification: OPENING_HOURS_SCHEMA.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.dayOfWeek,
    opens: h.opens,
    closes: h.closes,
  })),
  acceptsReservations: "True",
  amenityFeature: ["Parking", "Wheelchair accessible", "Free Wi-Fi", "Garden", "Dog friendly", "Card payments"].map(
    (name) => ({ "@type": "LocationFeatureSpecification", name, value: true }),
  ),
  hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${PUB.name} ${FULL_ADDRESS}`)}`,
};
