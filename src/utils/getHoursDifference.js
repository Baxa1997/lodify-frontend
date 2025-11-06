import { differenceInMinutes, isValid } from "date-fns";

export function getHoursMinutesDifference(dateTimeA, dateTimeB) {
  // Validate input dates
  if (!dateTimeA || !dateTimeB) {
    return "Invalid dates";
  }

  const d1 = new Date(dateTimeA);
  const d2 = new Date(dateTimeB);

  // Check if dates are valid
  if (!isValid(d1) || !isValid(d2)) {
    return "Invalid dates";
  }

  const totalMinutes = Math.abs(differenceInMinutes(d1, d2));

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
}
