/**
 * Whether an event is upcoming, on today, or over.
 *
 * This lives apart from events.ts, which pulls in every event image, so that
 * browser scripts can import it as well. The site is only rebuilt when someone
 * pushes to main, so a status worked out at build time goes stale once an
 * event's date passes. Anything that shows a status therefore re-checks it in
 * the visitor's browser with this same function.
 *
 * "Today" means the same calendar day in London, wherever the build machine or
 * the visitor happens to be. There is no end-time field on events, so an
 * event's duration is unknown — "today" is as precise as the data allows, and
 * we do not guess a run length.
 */
export type EventStatus = "upcoming" | "today" | "past";

const londonDay = (date: Date) =>
  date.toLocaleDateString("en-GB", { timeZone: "Europe/London" });

export const statusAt = (iso: string, now = new Date()): EventStatus => {
  const start = new Date(iso);
  if (londonDay(start) === londonDay(now)) return "today";
  return start.getTime() > now.getTime() ? "upcoming" : "past";
};

export const statusLabel = (status: EventStatus) =>
  status === "upcoming" ? "Upcoming" : status === "today" ? "Today" : "Recap";
