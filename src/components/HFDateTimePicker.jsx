import React from "react";
import { Controller } from "react-hook-form";
import { DateTimePicker } from "@mantine/dates";
import { Box } from "@chakra-ui/react";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

function HFDateTimePicker({
  control,
  name,
  placeholder = "Pick date and time",
  label,
  required = false,
  disabled = false,
  clearable = true,
  valueFormat = "MM/DD/YYYY hh:mm A",
  minDate,
  maxDate,
  ...rest
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Box w="100%">
          <DateTimePicker
            {...field}
            {...rest}
            placeholder={placeholder}
            label={label}
            required={required}
            disabled={disabled}
            clearable={clearable}
            valueFormat={valueFormat}
            minDate={minDate}
            maxDate={maxDate}
            error={error?.message}
            styles={{
              input: {
                border: "1px solid #D5D7DA",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "14px",
                height: "40px",
                "&:focus": {
                  borderColor: "#FF6B35",
                  outline: "none",
                },
              },
              label: {
                fontSize: "14px",
                fontWeight: "500",
                color: "#414651",
                marginBottom: "6px",
              },
              error: {
                fontSize: "12px",
                marginTop: "4px",
              },
            }}
          />
        </Box>
      )}
    />
  );
}

export default HFDateTimePicker;
