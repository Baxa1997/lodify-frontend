import { useGetCompanyId } from "@hooks/useGetCompanyId";
import { useGetTable } from "@services/items.service";
import { useState } from "react";

export const useAuthorityProps = ({ companySnapshot }) => {

  const companies_id = useGetCompanyId();

  const [enabled, setEnabled] = useState(true);

  const { data } = useGetTable("revocation", { enabled }, { data: JSON.stringify({ companies_id }) });

  const {
    us_driver_out_of_service,
    us_hazmat_out_of_service,
    us_vehicle_out_of_service,
    us_driver_inspections,
    us_driver_out_of_service_pct,
    us_driver_national_average,
    us_hazmat_inspections,
    us_hazmat_out_of_service_pct,
    us_hazmat_national_average,
    us_vehicle_inspections,
    us_vehicle_out_of_service_pct,
    us_vehicle_national_average,
  } = companySnapshot;

  const headData = [
    {
      label: "Auth Type",
      key: "type_license",
    },
    {
      label: "1st Served Date",
      key: "order1_serve_date",
    },
    {
      label: "Effective Date",
      key: "order2_effective_date",
    },
    {
      label: "Reason",
      key: "order2_type_desc",
    },

  ];
  const companyHeadData = [
    {
      label: "Type",
      key: "type",
    },
    {
      label: "OOS",
      key: "out_of_service",
    },
    {
      label: "Inspections",
      key: "inspections",
    },
    {
      label: "OOS %",
      key: "out_of_service_percent",
    },
    {
      label: "National average %",
      key: "national_average_percent",
    },
  ];

  const companyBodyData = [
    {
      type: "Driver",
      out_of_service: us_driver_out_of_service,
      inspections: us_driver_inspections,
      out_of_service_percent: `${us_driver_out_of_service_pct}%`,
      national_average_percent: `${us_driver_national_average}%`,
    },
    {
      type: "Hazmat",
      out_of_service: us_hazmat_out_of_service,
      inspections: us_hazmat_inspections,
      out_of_service_percent: `${us_hazmat_out_of_service_pct}%`,
      national_average_percent: `${us_hazmat_national_average}%`,
    },
    {
      type: "Vehicle",
      out_of_service: us_vehicle_out_of_service,
      inspections: us_vehicle_inspections,
      out_of_service_percent: `${us_vehicle_out_of_service_pct}%`,
      national_average_percent: `${us_vehicle_national_average}%`,
    },
  ];

  return {
    headData,
    bodyData: data?.response,
    companyHeadData,
    companyBodyData,
  };
};