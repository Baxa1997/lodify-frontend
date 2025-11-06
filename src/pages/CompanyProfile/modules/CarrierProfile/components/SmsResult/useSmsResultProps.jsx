import { useState } from "react";
import { useGetSmsResult } from "../../../../services/companyInfo.service";

export const useSmsResultProps = () => {
  const [enabled, setEnabled] = useState(false);
  const [filter, setFilter] = useState("");

  const filterOptions = [
    {
      label: "Unsafe Driving",
      value: "Unsafe Driving",
    },
    {
      label: "Hours-of-Service Compliance",
      value: "Hours-of-Service Compliance",
    },
    {
      label: "Vehicle Maintenance",
      value: "Vehicle Maintenance",
    },
    {
      label: "Controlled Substances & Alcohol",
      value: "Controlled Substances/&#8203;Alcohol",
    },
    {
      label: "Hazardous Materials Compliance",
      value: "Hazardous Materials Compliance",
    },
    {
      label: "Driver Fitness",
      value: "Driver Fitness",
    },
  ];

  const { data } = useGetSmsResult({
    enabled,
  }, { basic_desc: filter });

  const onAccordionChange = () => {
    setEnabled(true);
  };

  const handleFilter = (value) => setFilter(value);

  const headData = [
    {
      label: "Inspection Date",
      key: "insp_date",
    },
    {
      label: "Report Number",
      key: "report_number",
    },
    {
      label: "Report State",
      key: "report_state",
    },
    {
      label: "Violation",
      key: "section_desc",
    },
    {
      label: "Vehicle Plate Number",
      key: "unit_license",
    },
    {
      label: "Vehicle Plate State",
      key: "unit_license_state",
    },
    {
      label: "Vehicle Type",
      key: "unit_type_desc",
    },
    {
      label: "Severity Weight",
      key: "severity_weight",
    },
    {
      label: "Time Weight",
      key: "time_weight",
    },
  ];

  return {
    enabled,
    headData,
    bodyData: data?.response,
    onAccordionChange,
    filterOptions,
    handleFilter,
    filter,
  };
};
