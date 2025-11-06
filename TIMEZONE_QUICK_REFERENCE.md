# Timezone Quick Reference Guide

## 🚀 Quick Start

### 1. Import What You Need

```javascript
// For basic formatting
import {formatDateTime, formatShortDate} from "./utils/dateFormats";

// For conversions
import {convertToTimezone, convertToUTC} from "./utils/dateFormats";

// For React components
import {useTimezone} from "./hooks/useTimezone";
```

### 2. Display API Date (UTC → Local)

```javascript
// API returns: "2024-01-15T20:30:00Z"
formatDateTime(apiDate);
// Output: "01/15/2024 01:30 PM" (in Phoenix time)
```

### 3. Send Date to API (Local → UTC)

```javascript
const localDate = new Date("2024-01-15 13:30");
const utcDate = convertToUTC(localDate);

// Send to API
const payload = {
  pickup_time: utcDate.toISOString(), // "2024-01-15T20:30:00Z"
};
```

---

## 📋 Common Functions

| Function            | Input             | Output      | Use Case             |
| ------------------- | ----------------- | ----------- | -------------------- |
| `formatDateTime`    | UTC string/Date   | String      | Display date & time  |
| `formatShortDate`   | UTC string/Date   | String      | Display date only    |
| `formatTime`        | UTC string/Date   | String      | Display time only    |
| `convertToTimezone` | UTC string/Date   | Date object | Convert UTC to local |
| `convertToUTC`      | Local string/Date | Date object | Convert local to UTC |

---

## 🎯 Common Use Cases

### Case 1: Display Trip Pickup Time

```javascript
// API Response
const trip = {
  pickup_time: "2024-01-15T20:30:00Z", // UTC
};

// Display
<Text>{formatDateTime(trip.pickup_time)}</Text>;
// Shows: "01/15/2024 01:30 PM"
```

### Case 2: Create Trip with DateTimePicker

```javascript
import {useForm} from "react-hook-form";
import {convertToUTC} from "./utils/dateFormats";
import HFDateTimePicker from "./components/HFDateTimePicker";

function CreateTrip() {
  const {control, handleSubmit} = useForm();

  const onSubmit = (data) => {
    const payload = {
      pickup_time: convertToUTC(data.pickup_date)?.toISOString(),
    };
    // Send payload to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HFDateTimePicker
        control={control}
        name="pickup_date"
        label="Pickup Time"
      />
      <button type="submit">Create</button>
    </form>
  );
}
```

### Case 3: Use Timezone Hook

```javascript
import {useTimezone} from "./hooks/useTimezone";

function TripDetails() {
  const {formatAsDateTime, toUTC} = useTimezone();

  // Display UTC date
  const pickupDisplay = formatAsDateTime("2024-01-15T20:30:00Z");

  // Convert local to UTC
  const handleSave = (localDate) => {
    const utc = toUTC(localDate)?.toISOString();
    // Save to API
  };

  return <Text>{pickupDisplay}</Text>;
}
```

---

## 🌍 Timezone Constants

```javascript
import {US_TIMEZONES} from "./utils/timezones";

US_TIMEZONES.EASTERN; // "America/New_York"
US_TIMEZONES.CENTRAL; // "America/Chicago"
US_TIMEZONES.MOUNTAIN; // "America/Denver"
US_TIMEZONES.ARIZONA; // "America/Phoenix" (default)
US_TIMEZONES.PACIFIC; // "America/Los_Angeles"
```

---

## 📝 Format Patterns

```javascript
formatDate(date, "MM/dd/yyyy"); // 01/15/2024
formatDate(date, "MMM dd, yyyy"); // Jan 15, 2024
formatDate(date, "hh:mm a"); // 01:30 PM
formatDate(date, "MM/dd/yyyy hh:mm a"); // 01/15/2024 01:30 PM
```

---

## ⚠️ Important Rules

1. **Always store UTC in database**
2. **Convert to local only for display**
3. **Convert back to UTC before API calls**
4. **Use `.toISOString()` for API requests**

---

## 🔧 Debugging

```javascript
const utcDate = "2024-01-15T20:30:00Z";
const local = convertToTimezone(utcDate);

console.log("UTC:", utcDate);
console.log("Local Date Object:", local);
console.log("Formatted:", formatDateTime(utcDate));
```

---

## 📦 Complete Example

```javascript
import {useForm} from "react-hook-form";
import {useTimezone} from "./hooks/useTimezone";
import HFDateTimePicker from "./components/HFDateTimePicker";

function TripForm({initialData}) {
  const {control, handleSubmit} = useForm({
    defaultValues: {
      pickup_date: initialData?.pickup_time
        ? new Date(initialData.pickup_time)
        : null,
    },
  });

  const {formatAsDateTime, toUTC} = useTimezone();

  const onSubmit = (data) => {
    const payload = {
      pickup_time: toUTC(data.pickup_date)?.toISOString(),
    };
    console.log("Sending to API:", payload);
    // API call here
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Display existing time */}
      {initialData?.pickup_time && (
        <p>Current: {formatAsDateTime(initialData.pickup_time)}</p>
      )}

      {/* Edit time */}
      <HFDateTimePicker
        control={control}
        name="pickup_date"
        label="Pickup Time"
      />

      <button type="submit">Save</button>
    </form>
  );
}
```

---

## 💡 Tips

- **Default timezone is Arizona (MST)** - Change in `src/utils/dateFormats.js`
- **Use hook for components** - `useTimezone()` provides all utilities
- **Direct imports for utils** - Import from `utils/dateFormats.js` directly
- **Test with different timezones** - Use browser DevTools to change timezone
