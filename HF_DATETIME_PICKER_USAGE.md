# HFDateTimePicker Component Usage Guide

## Overview

`HFDateTimePicker` is a custom DateTimePicker component built with Mantine's DateTimePicker and integrated with React Hook Form for seamless form management.

## Installation

The following packages have been installed:

- `@mantine/core` - Mantine core library
- `@mantine/hooks` - Mantine hooks library
- `@mantine/dates` - Mantine date components (already installed)

## Setup

The `MantineProvider` has been added to `src/main.jsx` to enable Mantine components throughout the app.

## Basic Usage

```jsx
import HFDateTimePicker from "./components/HFDateTimePicker";
import {useForm} from "react-hook-form";

function MyComponent() {
  const {control, handleSubmit} = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <HFDateTimePicker
        control={control}
        name="pickup_date"
        label="Pickup Date & Time"
        placeholder="Select date and time"
        required
      />
    </form>
  );
}
```

## Props

| Prop          | Type    | Default                | Description                      |
| ------------- | ------- | ---------------------- | -------------------------------- |
| `control`     | object  | **required**           | React Hook Form control object   |
| `name`        | string  | **required**           | Field name for form registration |
| `placeholder` | string  | `"Pick date and time"` | Placeholder text                 |
| `label`       | string  | `undefined`            | Label text above the input       |
| `required`    | boolean | `false`                | Shows required indicator         |
| `disabled`    | boolean | `false`                | Disables the input               |
| `clearable`   | boolean | `true`                 | Shows clear button               |
| `valueFormat` | string  | `"MM/DD/YYYY hh:mm A"` | Display format for selected date |
| `minDate`     | Date    | `undefined`            | Minimum selectable date          |
| `maxDate`     | Date    | `undefined`            | Maximum selectable date          |

## Examples

### 1. Basic DateTimePicker

```jsx
<HFDateTimePicker
  control={control}
  name="appointment_date"
  placeholder="Select date and time"
/>
```

### 2. With Label and Required

```jsx
<HFDateTimePicker
  control={control}
  name="pickup_date"
  label="Pickup Date & Time"
  placeholder="Select pickup time"
  required
/>
```

### 3. Custom Format

```jsx
<HFDateTimePicker
  control={control}
  name="delivery_date"
  label="Delivery Date"
  valueFormat="YYYY-MM-DD HH:mm"
  placeholder="YYYY-MM-DD HH:mm"
/>
```

### 4. With Date Range Restrictions

```jsx
<HFDateTimePicker
  control={control}
  name="scheduled_date"
  label="Schedule Pickup"
  minDate={new Date()} // Today onwards
  maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // Next 30 days
  clearable={false}
/>
```

### 5. Disabled State

```jsx
<HFDateTimePicker
  control={control}
  name="completed_date"
  label="Completion Date"
  disabled
/>
```

## Date Formats

Common date format options:

- `"MM/DD/YYYY hh:mm A"` - 12/31/2023 03:30 PM
- `"DD/MM/YYYY HH:mm"` - 31/12/2023 15:30
- `"YYYY-MM-DD HH:mm"` - 2023-12-31 15:30
- `"MMM DD, YYYY hh:mm A"` - Dec 31, 2023 03:30 PM

## Form Integration Example

```jsx
import {useForm} from "react-hook-form";
import {Box, Button, VStack} from "@chakra-ui/react";
import HFDateTimePicker from "./components/HFDateTimePicker";

function TripForm() {
  const {control, handleSubmit} = useForm({
    defaultValues: {
      pickup_date: null,
      delivery_date: null,
    },
  });

  const onSubmit = (data) => {
    console.log("Pickup:", data.pickup_date);
    console.log("Delivery:", data.delivery_date);
  };

  return (
    <Box p="24px">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="24px" align="stretch">
          <HFDateTimePicker
            control={control}
            name="pickup_date"
            label="Pickup Date & Time"
            placeholder="Select pickup date and time"
            required
          />

          <HFDateTimePicker
            control={control}
            name="delivery_date"
            label="Delivery Date & Time"
            placeholder="Select delivery date and time"
            minDate={new Date()}
            required
          />

          <Button type="submit" colorScheme="orange">
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
```

## Styling

The component comes with custom styles that match your existing design system:

- Border: 1px solid #D5D7DA
- Border radius: 8px
- Height: 40px
- Focus color: #FF6B35 (Orange)
- Label color: #414651

## Notes

- The component automatically handles form validation through React Hook Form
- All Mantine DateTimePicker props are supported via the `...rest` spread
- The component is fully styled to match your Chakra UI design system
- Error messages from React Hook Form validation are automatically displayed

## Resources

- [Mantine DateTimePicker Docs](https://mantine.dev/dates/date-time-picker/)
- [React Hook Form Docs](https://react-hook-form.com/)
