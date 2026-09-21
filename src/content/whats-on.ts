/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT ME — What's On
 *  Add, edit or remove events below. Keep dates as plain text.
 * ─────────────────────────────────────────────────────────────
 */

export type WhatsOnItem = {
  title: string;
  when: string;
  description: string;
};

export const WHATS_ON: WhatsOnItem[] = [
  {
    title: "Sunday Lunch",
    when: "Every Sunday, from 12pm",
    description: "Traditional roasts served in our historic dining rooms and the garden.",
  },
  {
    title: "Live Music & Entertainment",
    when: "Selected evenings — ask the team",
    description: "Regular live entertainment in the bar. Follow us or call for the latest line-up.",
  },
  {
    title: "Private Celebrations",
    when: "Available all year round",
    description: "Birthdays, anniversaries and gatherings in our function rooms and conservatory.",
  },
];
