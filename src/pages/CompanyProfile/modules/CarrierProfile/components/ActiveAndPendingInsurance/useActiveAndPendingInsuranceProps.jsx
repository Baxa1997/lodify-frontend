import {useSearchParams} from "react-router-dom";
import {useState} from "react";
import carrierService from "@services/carrierService";

export const useActiveAndPendingInsuranceProps = (new_info) => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingInsuranceData, setPendingInsuranceData] = useState([]);

  const [enabled, setEnabled] = useState(true);

  const onAccordionChange = () => {
    setEnabled(true);
  };

  const getPendingInsuranceData = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  return {
    isLoading,
    onAccordionChange,
    pendingInsuranceData: pendingInsuranceData,
    rejectedInsuranceData: [],
    getPendingInsuranceData,
  };
};
