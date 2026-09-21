/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT ME — Pub details, opening hours, facilities & spaces
 *  Everything on the site reads from this one file.
 * ─────────────────────────────────────────────────────────────
 */

export const PUB = {
  name: "The Crown & Treaty",
  town: "Uxbridge",
  addressLine1: "90 Oxford Road",
  addressLine2: "Uxbridge",
  postcode: "UB8 1LU",
  phone: "020 3198 4186",
  phoneHref: "tel:+442031984186",
  email: "thecrowntreaty@gmail.com",
  /** Public site URL used for structured data / social previews */
  siteUrl: "https://id-preview--d05bf768-2128-5549-a1f1-07d5f8bdd9dd.lovable.app",
  /** Approximate coordinates for the map */
  lat: 51.5487,
  lng: -0.4869,
} as const;

export const FULL_ADDRESS = `${PUB.addressLine1}, ${PUB.addressLine2}, ${PUB.postcode}`;

export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${PUB.name}, ${FULL_ADDRESS}`,
)}`;

export const MAP_EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${PUB.lng - 0.008}%2C${PUB.lat - 0.004}%2C${PUB.lng + 0.008}%2C${PUB.lat + 0.004}&layer=mapnik&marker=${PUB.lat}%2C${PUB.lng}`;

export type DayHours = { day: string; open: string; close: string };

/** Bar opening hours */
export const OPENING_HOURS: DayHours[] = [
  { day: "Monday", open: "12:00 PM", close: "11:00 PM" },
  { day: "Tuesday", open: "12:00 PM", close: "11:00 PM" },
  { day: "Wednesday", open: "12:00 PM", close: "11:00 PM" },
  { day: "Thursday", open: "12:00 PM", close: "11:00 PM" },
  { day: "Friday", open: "12:00 PM", close: "1:00 AM" },
  { day: "Saturday", open: "12:00 PM", close: "1:00 AM" },
  { day: "Sunday", open: "12:00 PM", close: "11:00 PM" },
];

/** Kitchen / food service hours */
export const KITCHEN_HOURS: DayHours[] = [
  { day: "Monday", open: "12:00 PM", close: "9:30 PM" },
  { day: "Tuesday", open: "12:00 PM", close: "9:30 PM" },
  { day: "Wednesday", open: "12:00 PM", close: "9:30 PM" },
  { day: "Thursday", open: "12:00 PM", close: "9:30 PM" },
  { day: "Friday", open: "12:00 PM", close: "10:00 PM" },
  { day: "Saturday", open: "12:00 PM", close: "10:00 PM" },
  { day: "Sunday", open: "12:00 PM", close: "9:30 PM" },
];

/** Used for schema.org structured data (24h format) */
export const OPENING_HOURS_SCHEMA = [
  { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"], opens: "12:00", closes: "23:00" },
  { dayOfWeek: ["Friday", "Saturday"], opens: "12:00", closes: "01:00" },
];

export const FACILITIES = [
  "Parking",
  "Accessible facilities",
  "Free Wi-Fi",
  "Garden",
  "Dog friendly",
  "Card payments",
];

export const SPACES = [
  {
    slug: "charles-bar",
    name: "Charles Bar",
    summary: "With its own bar and terrace, the Charles Bar is a lively, self-contained space for events.",
    features: ["Private bar", "Own terrace", "Suitable for parties & receptions"],
  },
  {
    slug: "crown-room",
    name: "Crown Room",
    summary: "A historic wood-panelled function room, well suited to events and celebrations.",
    features: ["Historic wood panelling", "Events & celebrations", "Private dining"],
  },
  {
    slug: "treaty-room",
    name: "Treaty Room",
    summary: "A historic upstairs function room for smaller gatherings, meetings and celebrations.",
    features: ["Upstairs", "Meetings & smaller gatherings", "Celebrations"],
  },
  {
    slug: "conservatory",
    name: "Conservatory",
    summary: "A smaller, light-filled space for intimate gatherings.",
    features: ["Intimate gatherings", "Natural light", "Garden outlook"],
  },
];

export const EVENT_TYPES = [
  "Birthday parties",
  "Private dining",
  "Weddings",
  "Wedding receptions",
  "Business meetings",
  "Corporate events",
  "Celebrations",
  "Wakes",
  "Group dining",
];

/** Reservation form options */
export const RESERVATION = {
  minGuests: 1,
  maxGuests: 12,
  /** Bookable time slots (24h) */
  timeSlots: [
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00",
  ],
  largePartyNote: "For parties larger than 12, please call us or enquire about a private space.",
};
