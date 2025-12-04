import {useSearchParams} from "react-router-dom";
import {useGetTable} from "@services/items.service";
import {useState} from "react";

export const useActiveAndPendingInsuranceProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const [enabled, setEnabled] = useState(true);

  const {data: pendingInsuranceData} = useGetTable(
    "pending_insurance",
    {enabled},
    {data: JSON.stringify({companies_id})}
  );
  const {data: rejectedInsuranceData} = useGetTable(
    "rejected_insurance",
    {enabled},
    {data: JSON.stringify({companies_id})}
  );

  const onAccordionChange = () => {
    setEnabled(true);
  };

  return {
    onAccordionChange,
    pendingInsuranceData: pendingInsuranceData?.response,
    rejectedInsuranceData: rejectedInsuranceData?.response,
  };
};
