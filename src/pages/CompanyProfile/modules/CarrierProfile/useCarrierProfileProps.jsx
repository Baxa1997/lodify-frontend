import {useSelector} from "react-redux";
import {
  useGetCarrierDetails,
  useGetCompanySingle,
  useGetInsuranceHistory,
} from "../../services/companyInfo.service";
import {useEffect, useState} from "react";
import {useGetTable} from "@services/items.service";
import {useSearchParams} from "react-router-dom";
import carrierService from "@services/carrierService";
import {useQuery} from "@tanstack/react-query";

export const useCarrierProfileProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const [companySnapshot, setCompanySnapshot] = useState({});
  const [carrierDetails, setCarrierDetails] = useState({});
  const [insuranceHistory, setInsuranceHistory] = useState([]);
  const [operation, setOperation] = useState({});

  const {data: companyInfoData, isSuccess: companyIsSuccess} =
    useGetCompanySingle({}, companies_id);
  const {data: carrierDetailData, isSuccess: carrierDetailIsSuccess} =
    useGetCarrierDetails({}, companies_id);
  const {data: insuranceHistoryData, isSuccess: insuranceHistoryIsSuccess} =
    useGetInsuranceHistory({}, companies_id);
  const {data: operationData, isSuccess: operationIsSuccess} = useGetTable(
    "operations",
    {},
    {data: JSON.stringify({companies_id})}
  );

  const {
    data: carrierInfoData = {},
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["CARRIER_INFO", companies_id],
    queryFn: () =>
      carrierService.getCarrierInfo({
        data: {
          method: "get",
          object_data: {
            companies_id: companies_id,
          },
          table: "carrier_info",
        },
      }),
    select: (data) => data?.data?.response?.[0] || {},
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const generalInfo = {
    ...companySnapshot,
    ...carrierDetails,
    ...operation,
    new_info: carrierInfoData,
  };

  useEffect(() => {
    if (companyIsSuccess) {
      const companyDataResponse = companyInfoData?.response;
      setCompanySnapshot(companyDataResponse);
    }

    if (carrierDetailIsSuccess) {
      const carrierDataResponse = carrierDetailData?.response?.[0];
      setCarrierDetails(carrierDataResponse);
    }

    if (insuranceHistoryIsSuccess) {
      const insuranceHistoryDataResponse = insuranceHistoryData?.response;
      setInsuranceHistory(insuranceHistoryDataResponse);
    }

    if (operationIsSuccess) {
      const operationDataResponse = operationData?.response?.[0];
      setOperation(operationDataResponse);
    }
  }, [companyInfoData, carrierDetailData, insuranceHistoryData, operationData]);

  return {
    generalInfo,
    companySnapshot,
    carrierDetails,
    insuranceHistory,
    operation,
  };
};
