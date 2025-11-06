import { useState, useEffect } from "react";
import {
  convertToTimezone,
  convertToUTC,
  formatDate,
  formatDateTime,
  formatShortDate,
  formatLongDate,
  formatTime,
  formatTime24,
  DEFAULT_TIMEZONE,
} from "../utils/dateFormats";
import { getUserTimezone } from "../utils/timezones";

/**
 * Custom hook for timezone management
 * @param {string} defaultTimezone - Default timezone to use
 * @returns {object} - Timezone utilities
 */
export function useTimezone(defaultTimezone = DEFAULT_TIMEZONE) {
  const [timezone, setTimezone] = useState(defaultTimezone);
  const [userTimezone, setUserTimezone] = useState(null);

  useEffect(() => {
    // Get user's browser timezone on mount
    const browserTimezone = getUserTimezone();
    setUserTimezone(browserTimezone);
  }, []);

  /**
   * Convert UTC to selected timezone
   */
  const toTimezone = (date) => convertToTimezone(date, timezone);

  /**
   * Convert zoned time to UTC
   */
  const toUTC = (date) => convertToUTC(date, timezone);

  /**
   * Format date with current timezone
   */
  const format = (date, formatString) =>
    formatDate(date, formatString, timezone);

  /**
   * Format date and time
   */
  const formatAsDateTime = (date) => formatDateTime(date, timezone);

  /**
   * Format as short date
   */
  const formatAsShortDate = (date) => formatShortDate(date, timezone);

  /**
   * Format as long date
   */
  const formatAsLongDate = (date) => formatLongDate(date, timezone);

  /**
   * Format as time only
   */
  const formatAsTime = (date) => formatTime(date, timezone);

  /**
   * Format as 24-hour time
   */
  const formatAsTime24 = (date) => formatTime24(date, timezone);

  return {
    timezone,
    setTimezone,
    userTimezone,
    toTimezone,
    toUTC,
    format,
    formatAsDateTime,
    formatAsShortDate,
    formatAsLongDate,
    formatAsTime,
    formatAsTime24,
  };
}
