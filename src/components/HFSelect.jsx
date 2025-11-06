import React, { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import Select from "./Select";
import { Flex } from "@chakra-ui/react";
import tripsService from "../services/tripsService";
import { useParams } from "react-router-dom";

function HFSelect({
  control,
  name,
  value = "guid",
  options = [],
  size,
  table_slug = "",
  view_field = "name",
  disabled = false,
  props,
}) {
  const { id } = useParams();
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

  useEffect(() => {
    if (id) {
      getOptions();
    }
  }, [id]);

  return (
    <Flex {...props}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...field}
            options={table_slug ? Internaloptions : options}
            onChange={field.onChange}
            size={size}
            onClick={getOptions}
            isDisabled={disabled}
          />
        )}
      />
    </Flex>
  );
}

export default HFSelect;
