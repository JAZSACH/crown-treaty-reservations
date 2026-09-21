import { format, parseISO } from "date-fns";

/** "2026-10-04" → "Sunday 4 October 2026" */
export function formatReservationDate(isoDate: string) {
  try {
    return format(parseISO(isoDate), "EEEE d MMMM yyyy");
  } catch {
    return isoDate;
  }
}

/** "19:30:00" → "7:30 PM" */
export function formatReservationTime(time: string) {
  const [h, m] = time.split(":").map(Number) as [number, number];
  if (h === undefined || m === undefined || Number.isNaN(h) || Number.isNaN(m)) return time;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  declined: "Declined",
  cancelled: "Cancelled",
};
