import {useState} from "react";
import {useGetSmsResult} from "../../../../services/companyInfo.service";
import carrierService from "@services/carrierService";
import {useSearchParams} from "react-router-dom";

export const useViolationProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [violationData, setViolationData] = useState([]);

  const getViolationData = async () => {
    const response = await carrierService?.getCarrierInfo({
      data: {
        method: "list",
        object_data: {
          companies_id: companies_id,
          offset: 0,
          limit: 20,
        },
        table: "violations",
      },
    });

    setViolationData(response?.data?.response);
  };

  const headData = [
    {
      label: "Violation Date",
      key: "insp_date",
    },
    {
      label: "Report Number",
      key: "report_number",
    },
    {
      label: "Type",
      key: "group_desc",
    },
    {
      label: "Description",
      key: "section_desc",
      thProps: {
        width: "480px",
      },
    },
    {
      label: "Time Weight",
      key: "time_weight",
    },
    {
      label: "Total Severity Weight",
      key: "total_severity_wght",
    },
    {
      label: "Violation Value",
      key: "viol_unit",
    },
  ];

  const bodyData = violationData;

  return {
    headData,
    bodyData,
    page,
    setPage,
    limit,
    setLimit,
    count: violationData?.length,
    getViolationData,
  };
};
