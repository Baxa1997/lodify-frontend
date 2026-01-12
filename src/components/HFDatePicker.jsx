import React from "react";
import {Controller} from "react-hook-form";
import {Input} from "@chakra-ui/react";

function HFDatePicker({control, name, disabled}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({field}) => (
        <Input
          type="date"
          border="1px solid #D5D7DA"
          disabled={disabled}
          {...field}
        />
      )}
    />
  );
}

export default HFDatePicker;
