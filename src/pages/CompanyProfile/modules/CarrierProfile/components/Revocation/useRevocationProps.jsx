import { useGetCompanyId } from "@hooks/useGetCompanyId";
import { useGetTable } from "@services/items.service";
import { useState } from "react";

export const useRevocationProps = () => {

  const companies_id = useGetCompanyId();

  const [enabled, setEnabled] = useState(false);

  const { data } = useGetTable("revocation", { enabled }, { data: JSON.stringify({ companies_id }) });

  const onAccordionChange = () => {
    setEnabled(true);
  };

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
  

  return {
    headData,
    onAccordionChange,
    bodyData: data?.response,
  };
};