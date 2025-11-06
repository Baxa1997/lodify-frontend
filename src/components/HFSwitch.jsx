import React from "react";
import { Controller } from "react-hook-form";
import { Switch } from "@chakra-ui/react";

function HFSwitch({ control, name, ...props }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Switch
          value={field.value}
          {...field}
          {...props}
          onChange={(e) => field.onChange(e.target.checked)}
        />
      )}
    />
  );
}

export default HFSwitch;
