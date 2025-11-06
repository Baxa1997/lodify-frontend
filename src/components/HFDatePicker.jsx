import React from "react";
import { Controller } from "react-hook-form";
import { Input } from "@chakra-ui/react";

function HFDatePicker({ control, name }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Input
          type="date"
          border="1px solid #D5D7DA"
          {...field} />
      )}
    />
  );
}

export default HFDatePicker;
