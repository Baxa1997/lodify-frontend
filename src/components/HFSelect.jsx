import React, {useEffect, useState, useRef, useCallback} from "react";
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
  const isLoadingRef = useRef(false);

  const getOptions = async () => {
    if (Internaloptions.length > 0) {
      return;
    }

    if (!table_slug || isLoadingRef.current) {
      return;
    }

    isLoadingRef.current = true;

    try {
      const response = params
        ? await tripsService.getSelectOptionsWithData(table_slug, params)
        : await tripsService.getSelectOptions(table_slug);
      setInternalOptions(
        response.data?.response?.map((item) => ({
          label: view_fields?.map((field) => item[field]).join(" "),
          value: item?.[value] ?? item.guid,
        }))
      );
    } catch (error) {
      console.error("Error fetching options:", error);
    } finally {
      isLoadingRef.current = false;
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
