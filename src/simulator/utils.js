export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export const lerp = (a, b, t) => a + (b - a) * t;
export const rand = (a, b) => a + Math.random() * (b - a);
export const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function randn() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let ticket = Math.random() * total;
  for (const item of items) {
    ticket -= item.weight;
    if (ticket <= 0) return item.value;
  }
  return items[items.length - 1].value;
}

export function fmtMoney(value, digits = 2) {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function fmtPct(value, digits = 2) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}%`;
}

export function marketClockLabel(minuteOfDay) {
  const total = Math.floor(minuteOfDay);
  const minutes = 570 + total;
  const hh = Math.floor(minutes / 60);
  const mm = minutes % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function timeLabel(day, minuteOfDay, calendarDate = null) {
  const clock = marketClockLabel(minuteOfDay);
  if (calendarDate) return `${calendarDate} ${clock}`;
  return `Day ${day} - ${clock}`;
}

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}
