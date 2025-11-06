# Timezone Utilities Documentation

## Overview

This project uses `date-fns-tz` for timezone management with `utcToZonedTime` and `zonedTimeToUtc` functions. The utilities are set up to handle timezone conversions consistently across the application.

## Installation

The required package is already installed:

- `date-fns-tz` - Timezone support for date-fns

## Files Created/Updated

1. **`src/utils/dateFormats.js`** - Date formatting utilities with timezone support
2. **`src/utils/timezones.js`** - Timezone constants and helpers
3. **`src/hooks/useTimezone.js`** - React hook for timezone management

---

## Basic Usage

### Import Functions

```javascript
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
} from "./utils/dateFormats";
```

### Convert UTC to Timezone

```javascript
import {convertToTimezone} from "./utils/dateFormats";

// Convert UTC date to Phoenix time
const utcDate = "2024-01-15T20:30:00Z";
const phoenixDate = convertToTimezone(utcDate, "America/Phoenix");
console.log(phoenixDate); // Date object in Phoenix timezone
```

### Convert Timezone to UTC

```javascript
import {convertToUTC} from "./utils/dateFormats";

// Convert local time to UTC
const localDate = new Date("2024-01-15 13:30");
const utcDate = convertToUTC(localDate, "America/Phoenix");
console.log(utcDate); // Date object in UTC
```

---

## Formatting Functions

### 1. **formatDate** - Custom Format

```javascript
import {formatDate} from "./utils/dateFormats";

const utcDate = "2024-01-15T20:30:00Z";

// Default format
formatDate(utcDate);
// Output: "Mon, Jan 15, 13:30 MST"

// Custom format
formatDate(utcDate, "yyyy-MM-dd HH:mm");
// Output: "2024-01-15 13:30"

// Different timezone
formatDate(utcDate, "MM/dd/yyyy hh:mm a", "America/New_York");
// Output: "01/15/2024 03:30 PM"
```

### 2. **formatShortDate** - Short Date Format

```javascript
import {formatShortDate} from "./utils/dateFormats";

formatShortDate("2024-01-15T20:30:00Z");
// Output: "01/15/2024"
```

### 3. **formatLongDate** - Long Date Format

```javascript
import {formatLongDate} from "./utils/dateFormats";

formatLongDate("2024-01-15T20:30:00Z");
// Output: "January 15, 2024"
```

### 4. **formatDateTime** - Date and Time

```javascript
import {formatDateTime} from "./utils/dateFormats";

formatDateTime("2024-01-15T20:30:00Z");
// Output: "01/15/2024 01:30 PM"
```

### 5. **formatTime** - Time Only (12-hour)

```javascript
import {formatTime} from "./utils/dateFormats";

formatTime("2024-01-15T20:30:00Z");
// Output: "01:30 PM"
```

### 6. **formatTime24** - Time Only (24-hour)

```javascript
import {formatTime24} from "./utils/dateFormats";

formatTime24("2024-01-15T20:30:00Z");
// Output: "13:30"
```

---

## Timezone Constants

### Import Timezones

```javascript
import {
  US_TIMEZONES,
  WORLD_TIMEZONES,
  TIMEZONE_OPTIONS,
} from "./utils/timezones";
```

### Available Timezones

```javascript
// US Timezones
US_TIMEZONES.EASTERN; // "America/New_York"
US_TIMEZONES.CENTRAL; // "America/Chicago"
US_TIMEZONES.MOUNTAIN; // "America/Denver"
US_TIMEZONES.ARIZONA; // "America/Phoenix"
US_TIMEZONES.PACIFIC; // "America/Los_Angeles"
US_TIMEZONES.ALASKA; // "America/Anchorage"
US_TIMEZONES.HAWAII; // "Pacific/Honolulu"

// Use in code
const phoenixTime = convertToTimezone(utcDate, US_TIMEZONES.ARIZONA);
```

### Timezone Options for Dropdowns

```javascript
import {TIMEZONE_OPTIONS} from "./utils/timezones";

// Use in a select component
<Select options={TIMEZONE_OPTIONS} />;

// TIMEZONE_OPTIONS structure:
[
  {label: "Eastern Time (ET)", value: "America/New_York"},
  {label: "Central Time (CT)", value: "America/Chicago"},
  {label: "Mountain Time (MT)", value: "America/Denver"},
  {label: "Arizona Time (MST)", value: "America/Phoenix"},
  {label: "Pacific Time (PT)", value: "America/Los_Angeles"},
  {label: "Alaska Time (AKT)", value: "America/Anchorage"},
  {label: "Hawaii Time (HT)", value: "Pacific/Honolulu"},
];
```

### Helper Functions

```javascript
import {getUserTimezone, getTimezoneAbbreviation} from "./utils/timezones";

// Get user's browser timezone
const userTz = getUserTimezone();
console.log(userTz); // e.g., "America/New_York"

// Get timezone abbreviation
const abbr = getTimezoneAbbreviation("America/Phoenix");
console.log(abbr); // "MST"
```

---

## React Hook: useTimezone

### Basic Usage

```javascript
import {useTimezone} from "./hooks/useTimezone";

function MyComponent() {
  const {timezone, setTimezone, formatAsDateTime, toUTC} = useTimezone();

  const handleDateSubmit = (localDate) => {
    // Convert local date to UTC before sending to API
    const utcDate = toUTC(localDate);
    console.log("Sending to API:", utcDate);
  };

  return (
    <div>
      <p>Current timezone: {timezone}</p>
      <p>Formatted: {formatAsDateTime("2024-01-15T20:30:00Z")}</p>
    </div>
  );
}
```

### Hook API

```javascript
const {
  timezone, // Current timezone (string)
  setTimezone, // Function to change timezone
  userTimezone, // User's browser timezone
  toTimezone, // Convert UTC to timezone
  toUTC, // Convert timezone to UTC
  format, // Custom format
  formatAsDateTime, // Format as date and time
  formatAsShortDate, // Format as short date
  formatAsLongDate, // Format as long date
  formatAsTime, // Format as time (12-hour)
  formatAsTime24, // Format as time (24-hour)
} = useTimezone("America/Phoenix");
```

### Advanced Example

```javascript
import {useTimezone} from "./hooks/useTimezone";
import {US_TIMEZONES} from "./utils/timezones";

function TripScheduler() {
  const {timezone, setTimezone, formatAsDateTime, toUTC} = useTimezone(
    US_TIMEZONES.ARIZONA
  );

  const handlePickupTimeChange = (selectedDate) => {
    // User selects a date in their local timezone
    console.log("User selected:", selectedDate);

    // Convert to UTC before saving to database
    const utcTime = toUTC(selectedDate);
    console.log("Saving to DB:", utcTime.toISOString());

    // Save to API
    saveTripData({pickup_time: utcTime.toISOString()});
  };

  const displayPickupTime = (utcTimeFromAPI) => {
    // Display UTC time from API in user's timezone
    return formatAsDateTime(utcTimeFromAPI);
  };

  return (
    <div>
      <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
        <option value={US_TIMEZONES.EASTERN}>Eastern</option>
        <option value={US_TIMEZONES.CENTRAL}>Central</option>
        <option value={US_TIMEZONES.ARIZONA}>Arizona</option>
        <option value={US_TIMEZONES.PACIFIC}>Pacific</option>
      </select>

      <DateTimePicker onChange={handlePickupTimeChange} />

      <p>Pickup: {displayPickupTime("2024-01-15T20:30:00Z")}</p>
    </div>
  );
}
```

---

## Integration with HFDateTimePicker

### Timezone-Aware DateTimePicker

```javascript
import {useForm} from "react-hook-form";
import {useTimezone} from "./hooks/useTimezone";
import HFDateTimePicker from "./components/HFDateTimePicker";

function AddTripForm() {
  const {control, handleSubmit} = useForm();
  const {toUTC, formatAsDateTime} = useTimezone();

  const onSubmit = (data) => {
    // Convert local dates to UTC before sending to API
    const formData = {
      ...data,
      pickup_date: toUTC(data.pickup_date)?.toISOString(),
      delivery_date: toUTC(data.delivery_date)?.toISOString(),
    };

    console.log("Sending to API:", formData);
    // API call here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HFDateTimePicker
        control={control}
        name="pickup_date"
        label="Pickup Date & Time"
        placeholder="Select pickup date and time"
      />

      <HFDateTimePicker
        control={control}
        name="delivery_date"
        label="Delivery Date & Time"
        placeholder="Select delivery date and time"
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Common Use Cases

### 1. Display API Date in User's Timezone

```javascript
import {formatDateTime} from "./utils/dateFormats";

// API returns UTC
const apiDate = "2024-01-15T20:30:00Z";

// Display in Phoenix time
const displayDate = formatDateTime(apiDate, "America/Phoenix");
console.log(displayDate); // "01/15/2024 01:30 PM"
```

### 2. Send Local Time to API as UTC

```javascript
import {convertToUTC} from "./utils/dateFormats";

// User selects date in their timezone
const userDate = new Date("2024-01-15 13:30");

// Convert to UTC for API
const utcDate = convertToUTC(userDate, "America/Phoenix");
const apiPayload = {
  pickup_time: utcDate.toISOString(),
};
```

### 3. Show Relative Times

```javascript
import {formatRelative} from "date-fns";
import {convertToTimezone} from "./utils/dateFormats";

const utcDate = "2024-01-15T20:30:00Z";
const localDate = convertToTimezone(utcDate, "America/Phoenix");

const relativeTime = formatRelative(localDate, new Date());
console.log(relativeTime); // "yesterday at 1:30 PM"
```

### 4. Calculate Time Differences

```javascript
import {differenceInHours} from "date-fns";
import {convertToTimezone} from "./utils/dateFormats";

const pickupUTC = "2024-01-15T20:30:00Z";
const deliveryUTC = "2024-01-16T08:30:00Z";

const pickup = convertToTimezone(pickupUTC);
const delivery = convertToTimezone(deliveryUTC);

const hours = differenceInHours(delivery, pickup);
console.log(`Transit time: ${hours} hours`);
```

---

## Date Format Patterns

Common format patterns for use with `formatDate`:

| Pattern                  | Example Output         |
| ------------------------ | ---------------------- |
| `MM/dd/yyyy`             | 01/15/2024             |
| `yyyy-MM-dd`             | 2024-01-15             |
| `MMM dd, yyyy`           | Jan 15, 2024           |
| `MMMM dd, yyyy`          | January 15, 2024       |
| `EEE, MMM dd, yyyy`      | Mon, Jan 15, 2024      |
| `hh:mm a`                | 01:30 PM               |
| `HH:mm`                  | 13:30                  |
| `MM/dd/yyyy hh:mm a`     | 01/15/2024 01:30 PM    |
| `EEE, MMM dd, HH:mm`     | Mon, Jan 15, 13:30     |
| `EEE, MMM dd, HH:mm zzz` | Mon, Jan 15, 13:30 MST |

---

## Best Practices

1. **Always store dates in UTC** in your database
2. **Convert to user's timezone** only for display
3. **Convert back to UTC** before sending to API
4. **Use ISO 8601 format** for API communication (`.toISOString()`)
5. **Handle null/invalid dates** gracefully
6. **Be consistent** with timezone across your app

---

## Troubleshooting

### Issue: Date shows wrong time

**Solution**: Make sure you're converting UTC to timezone for display

```javascript
// ❌ Wrong - displaying UTC directly
<p>{apiDate}</p>;

// ✅ Correct - convert to timezone first
<p>{formatDateTime(apiDate)}</p>;
```

### Issue: Saving wrong time to database

**Solution**: Convert local time to UTC before saving

```javascript
// ❌ Wrong - sending local time
const payload = {date: selectedDate};

// ✅ Correct - convert to UTC
const payload = {date: toUTC(selectedDate).toISOString()};
```

---

## Resources

- [date-fns-tz Documentation](https://github.com/marnusw/date-fns-tz)
- [date-fns Documentation](https://date-fns.org/)
- [IANA Timezone Database](https://www.iana.org/time-zones)
