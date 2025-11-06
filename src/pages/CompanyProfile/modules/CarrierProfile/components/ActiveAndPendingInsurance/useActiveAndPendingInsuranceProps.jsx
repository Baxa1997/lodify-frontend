import { useGetCompanyId } from "@hooks/useGetCompanyId";
import { useGetTable } from "@services/items.service";
import { useState } from "react";

export const useActiveAndPendingInsuranceProps = () => {

  const companies_id = useGetCompanyId();

  const [enabled, setEnabled] = useState(true);

  const { data: pendingInsuranceData } = useGetTable("pending_insurance", { enabled }, { data: JSON.stringify({ companies_id }) });
  const { data: rejectedInsuranceData } = useGetTable("rejected_insurance", { enabled }, { data: JSON.stringify({ companies_id }) });

  const onAccordionChange = () => {
    setEnabled(true);
  };

  return {
    onAccordionChange,
    pendingInsuranceData: pendingInsuranceData?.response,
    rejectedInsuranceData: rejectedInsuranceData?.response,
  };
};