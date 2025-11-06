import { useGetCompanyId } from "@hooks/useGetCompanyId";
import { useGetTable } from "@services/items.service";
import { useState } from "react";

export const useRejectedInsuranceProps = () => {

  const companies_id = useGetCompanyId();

  const [enabled, setEnabled] = useState(false);

  const { data } = useGetTable("rejected_insurance", { enabled }, { data: JSON.stringify({ companies_id }) });

  const onAccordionChange = () => {
    setEnabled(true);
  };

  const headData = [
    {
      label: "Form",
      key: "ins_form_code",
    },
    {
      label: "Type",
      key: "mod_col_1",
    },
    {
      label: "Insurance Carrier",
      key: "name_company",
    },
    {
      label: "Policy/Surety",
      key: "policy_no",
    },
    {
      label: "Posted Date",
      key: "trans_date",
    },
    {
      label: "Minimum Coverage Amount",
      key: "min_cov_amount",
    },
    {
      label: "Received Date",
      key: "recv_date",
    },
    {
      label: "Rejected Date",
      key: "rej_date",
    },
    {
      label: "Rejection Reason",
      key: "rej_reasons",
    },
  ];
  

  return {
    headData,
    onAccordionChange,
    bodyData: data?.response,
  };
};