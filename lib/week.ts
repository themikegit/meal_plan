import { DAY_KEYS, type DayKey } from "./types";

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function currentWeekDates(): Record<DayKey, Date> {
  const today = new Date();
  const jsDay = today.getDay(); // 0 = Sun ... 6 = Sat
  const mondayOffset = jsDay === 0 ? -6 : 1 - jsDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  const dates = {} as Record<DayKey, Date>;
  DAY_KEYS.forEach((key, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates[key] = d;
  });
  return dates;
}

export function formatWeekRange(dates: Record<DayKey, Date>): string {
  const mon = dates.mon;
  const sun = dates.sun;
  return `${MONTH_ABBR[mon.getMonth()]} ${mon.getDate()} – ${MONTH_ABBR[sun.getMonth()]} ${sun.getDate()}`;
}
