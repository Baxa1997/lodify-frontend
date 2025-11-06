import {format, parseISO, isValid} from "date-fns";

export function formatDate(dateString) {
  if (!dateString || dateString === "undefined" || dateString === "null") {
    return "";
  }

  const date = parseISO(dateString);
  if (!isValid(date)) {
    return "";
  }

  return format(date, "MMM dd, HH:mm zzz");
}

export const calculateTimeHoursDifferenceInTimeZone = (timestamp, timeZone) => {
  if (!timestamp) return "";
  const messageTime = new Date(timestamp);

  if (isNaN(messageTime.getTime())) {
    console.warn("Invalid timestamp format:", timestamp);
    return "";
  }

  const now = new Date();
  const diffMs = now - messageTime;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};
