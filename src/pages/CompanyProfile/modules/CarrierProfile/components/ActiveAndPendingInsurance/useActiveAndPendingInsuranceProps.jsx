import {useSearchParams} from "react-router-dom";
import {useGetTable} from "@services/items.service";
import {useState} from "react";
import carrierService from "@services/carrierService";

export const useActiveAndPendingInsuranceProps = (new_info) => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const [pendingInsuranceData, setPendingInsuranceData] = useState([]);
  console.log("new_infonew_infonew_info", new_info);
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
          dot_number: new_info?.dot_number,
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
