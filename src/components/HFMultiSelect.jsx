import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Flex } from "@chakra-ui/react";
import tripsService from "../services/tripsService";
import MultiSelect from "./MultiSelect";

function HFMultiSelect({
  control,
  name,
  value = "guid",
  options = [],
  size,
  table_slug = "",
  view_field = "name",
  props,
}) {
  const [Internaloptions, setInternalOptions] = useState([]);
  const getOptions = async () => {
    if (table_slug) {
      const response = await tripsService.getSelectOptions(table_slug);
      return setInternalOptions(
        response.data?.response?.map((item) => ({
          label: item[view_field],
          value: item?.[value] ?? item.guid,
        })),
      );
    }
  };

  return (
    <Flex {...props}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <MultiSelect
            {...field}
            options={table_slug ? Internaloptions : options}
            onChange={field.onChange}
            size={size}
            onClick={getOptions}
          />
        )}
      />
    </Flex>
  );
}

export default HFMultiSelect;
