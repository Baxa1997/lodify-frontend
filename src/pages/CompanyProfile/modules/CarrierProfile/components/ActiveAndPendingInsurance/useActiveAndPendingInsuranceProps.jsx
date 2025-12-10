import {useSearchParams} from "react-router-dom";
import {useGetTable} from "@services/items.service";
import {useState} from "react";
import carrierService from "@services/carrierService";

export const useActiveAndPendingInsuranceProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const [pendingInsuranceData, setPendingInsuranceData] = useState([]);

  const [enabled, setEnabled] = useState(true);

  // const {data: pendingInsuranceData} = useGetTable(
  //   "pending_insurance",
  //   {enabled},
  //   {data: JSON.stringify({companies_id})}
  // );
  // const {data: rejectedInsuranceData} = useGetTable(
  //   "rejected_insurance",
  //   {enabled},
  //   {data: JSON.stringify({companies_id})}
  // );

  const onAccordionChange = () => {
    setEnabled(true);
  };

  const getPendingInsuranceData = async () => {
    const response = await carrierService.getCarrierInfo({
      data: {
        method: "list",
        object_data: {
          companies_id: companies_id,
        },
        table: "insurance",
      },
    });
    setPendingInsuranceData(response?.data?.response);
  };

  return {
    onAccordionChange,
    pendingInsuranceData: pendingInsuranceData,
    rejectedInsuranceData: [],
    getPendingInsuranceData,
  };
};
