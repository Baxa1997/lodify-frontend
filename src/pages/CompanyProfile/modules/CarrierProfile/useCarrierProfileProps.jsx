import { useSelector } from "react-redux";
import { useGetCarrierDetails, useGetCompanySingle, useGetInsuranceHistory } from "../../services/companyInfo.service";
import { useEffect, useState } from "react";
import { useGetTable } from "@services/items.service";
import { useGetCompanyId } from "@hooks/useGetCompanyId";

export const useCarrierProfileProps = () => {
  const companies_id = useGetCompanyId();

  const [companySnapshot, setCompanySnapshot] = useState({});
  const [carrierDetails, setCarrierDetails] = useState({});
  const [insuranceHistory, setInsuranceHistory] = useState([]);
  const [operation, setOperation] = useState({});

  const { data: companyInfoData, isSuccess: companyIsSuccess } = useGetCompanySingle({}, companies_id);
  const { data: carrierDetailData, isSuccess: carrierDetailIsSuccess } = useGetCarrierDetails({}, companies_id);
  const { data: insuranceHistoryData, isSuccess: insuranceHistoryIsSuccess } = useGetInsuranceHistory({}, companies_id);
  const { data: operationData, isSuccess: operationIsSuccess } = useGetTable("operations", {  }, { data: JSON.stringify({ companies_id }) });

  const generalInfo = {
    ...companySnapshot,
    ...carrierDetails,
    ...operation,
  };

  useEffect(() => {
    if(companyIsSuccess) {
      const companyDataResponse = companyInfoData?.response;
      setCompanySnapshot(companyDataResponse);
    }

    if(carrierDetailIsSuccess) {
      const carrierDataResponse = carrierDetailData?.response?.[0];
      setCarrierDetails(carrierDataResponse);
    }

    if(insuranceHistoryIsSuccess) {
      const insuranceHistoryDataResponse = insuranceHistoryData?.response;
      setInsuranceHistory(insuranceHistoryDataResponse);
    }

    if(operationIsSuccess) {
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
