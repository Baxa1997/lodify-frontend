import {useSearchParams} from "react-router-dom";
import {useGetTable} from "@services/items.service";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import carrierService from "@services/carrierService";

export const useAuthorityProps = ({companySnapshot, new_info}) => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const [enabled, setEnabled] = useState(true);

  const {data} = useGetTable(
    "revocation",
    {enabled},
    {data: JSON.stringify({companies_id})}
  );

  const {data: authorityHistoryData} = useQuery({
    queryKey: ["GET_AUTHORITY_DATA", companies_id],
    queryFn: () =>
      carrierService.getAuthorityData({
        data: {
          method: "list",
          object_data: {
            dot_number: new_info?.dot_number,
            page: 1,
            limit: 28,
          },
          table: "authority_history",
        },
      }),
    select: (res) => res.data?.response || [],
    enabled: Boolean(companies_id),
  });

  console.log("authorityHistoryDataauthorityHistoryData", authorityHistoryData);

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
      label: "Authority Type",
      key: "mod_col_1",
    },
    {
      label: "Origin Action",
      key: "original_action_desc",
    },
    {
      label: "Action Date",
      key: "orig_served_date",
    },
    {
      label: "Disposition Action",
      key: "disp_action_desc",
    },
    {
      label: "Disposition Date",
      key: "disp_decided_date",
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
      key: "out_of_service_pct",
    },
    {
      label: "National average %",
      key: "national_average",
    },
  ];

  const companyBodyData = [
    {
      type: "Driver",
      out_of_service: new_info?.us_driver_inspections?.out_of_service,
      inspections: new_info?.us_driver_inspections?.inspections,
      out_of_service_pct: new_info?.us_driver_inspections?.out_of_service_pct
        ? `${(new_info.us_driver_inspections.out_of_service_pct * 100).toFixed(
            2
          )}%`
        : "N/A",
      national_average: new_info?.us_driver_inspections?.national_average
        ? `${(new_info.us_driver_inspections.national_average * 100).toFixed(
            2
          )}%`
        : "N/A",
    },
    {
      type: "Hazmat",
      out_of_service: new_info?.us_hazmat_inspections?.out_of_service,
      inspections: new_info?.us_hazmat_inspections?.inspections,
      out_of_service_pct: new_info?.us_hazmat_inspections?.out_of_service_pct
        ? `${(new_info.us_hazmat_inspections.out_of_service_pct * 100).toFixed(
            2
          )}%`
        : "N/A",
      national_average: new_info?.us_hazmat_inspections?.national_average
        ? `${(new_info.us_hazmat_inspections.national_average * 100).toFixed(
            2
          )}%`
        : "N/A",
    },
    {
      type: "Vehicle",
      out_of_service: new_info?.us_vehicle_inspections?.out_of_service,
      inspections: new_info?.us_vehicle_inspections?.inspections,
      out_of_service_pct: new_info?.us_vehicle_inspections?.out_of_service_pct
        ? `${(new_info.us_vehicle_inspections.out_of_service_pct * 100).toFixed(
            2
          )}%`
        : "N/A",
      national_average: new_info?.us_vehicle_inspections?.national_average
        ? `${(new_info.us_vehicle_inspections.national_average * 100).toFixed(
            2
          )}%`
        : "N/A",
    },
  ];

  return {
    headData,
    bodyData: data?.response,
    companyHeadData,
    companyBodyData,
    authorityHistoryData,
  };
};
