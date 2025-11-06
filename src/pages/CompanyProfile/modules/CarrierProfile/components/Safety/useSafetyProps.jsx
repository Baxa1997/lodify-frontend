import { useState } from "react";
import { useGetSmsResult } from "../../../../services/companyInfo.service";

export const useSafetyProps = () => {
  const [enabled, setEnabled] = useState(true);
  const [filter, setFilter] = useState("Unsafe Driving");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filterOptions = [ "Unsafe Driving", "Hours-of-Service Compliance","Vehicle Maintenance","Controlled Substances & Alcohol", "Driver Fitness"];

  const { data } = useGetSmsResult({
    enabled,
  }, { basic_desc: filter, offset: (page - 1) * limit, limit });

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
      thProps: {
        width: "480px",
      },
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
    count: data?.count,
    page,
    setPage,
    limit,
    setLimit,
    onAccordionChange,
    filterOptions,
    handleFilter,
    filter,
  };
};
