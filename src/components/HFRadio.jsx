import React from "react";
import { Controller } from "react-hook-form";
import { Radio } from "@chakra-ui/react";

function HFRadio({ control, name, array = false, ...props }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Radio
          {...field}
          {...props}
          isChecked={
            array
              ? field.value?.[0] === props.value
              : field.value === props.value
          }
          onChange={(e) =>
            field.onChange(array ? [e.target.value] : e.target.value)
          }
        />
      )}
    />
  );
}

export default HFRadio;
