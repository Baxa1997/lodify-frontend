import { useGetTable } from "@services/items.service";
import CustomBadge from "../../../../../../components/CustomBadge/CustomBadge";
import { useGetCompanyId } from "@hooks/useGetCompanyId";
import { useState } from "react";

export const useEquipmentProps = () => {

  const companies_id = useGetCompanyId();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: assetsData, isSuccess: operationIsSuccess } = useGetTable("assets", {  }, { data: JSON.stringify({ companies_id, offset: (page - 1) * limit, limit }) });

  const headData = [
    {
      label: "Type",
      key: "type",
    },
    {
      label: "Vehicle Number",
      key: "vehicle_number",
    },
    {
      label: "Plate",
      key: "licence_plate",
    },
    {
      label: "Year",
      key: "year",
    },
    {
      label: "VIN",
      key: "vin_number",
    },
  ];

  const bodyData = assetsData?.response;

  return {
    headData,
    bodyData,
    page, 
    setPage,
    limit,
    setLimit,
    count: assetsData?.count,
  };
};
