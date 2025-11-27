import React, {useEffect, useState} from "react";
import {Controller} from "react-hook-form";
import Select from "./Select";
import {Flex} from "@chakra-ui/react";
import tripsService from "../services/tripsService";
import {useParams} from "react-router-dom";

function HFSelect({
  control,
  name,
  value = "guid",
  options = [],
  size,
  table_slug = "",
  view_fields = ["name"],
  disabled = false,
  props,
  params = null,
}) {
  const {id} = useParams();
  const [Internaloptions, setInternalOptions] = useState([]);
  const getOptions = async () => {
    if (table_slug) {
      const response = params
        ? await tripsService.getSelectOptionsWithData(table_slug, params)
        : await tripsService.getSelectOptions(table_slug);
      return setInternalOptions(
        response.data?.response?.map((item) => ({
          label: view_fields?.map((field) => item[field]).join(" "),
          value: item?.[value] ?? item.guid,
        }))
      );
    }
  };

  useEffect(() => {
    if (table_slug && (id || params)) {
      getOptions();
    }
  }, [id, JSON.stringify(params), table_slug]);

  return (
    <Flex {...props}>
      <Controller
        control={control}
        name={name}
        render={({field}) => (
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
