import {useState, useEffect} from "react";
import {useGetSmsResult} from "../../../../services/companyInfo.service";
import carrierService from "@services/carrierService";
import {useSearchParams} from "react-router-dom";

export const useViolationProps = (new_info) => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [violationData, setViolationData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getViolationData = async () => {
    if (!companies_id) return;

    setIsLoading(true);
    try {
      const offset = (page - 1) * limit;

      const response = await carrierService?.getCarrierInfo({
        data: {
          method: "list",
          object_data: {
            dot_number: new_info?.dot_number,
            companies_id: companies_id,
            offset: offset,
            limit: limit,
          },
          table: "violations",
        },
      });

      const data = response?.data?.response || [];
      setViolationData(data);

      if (data.length === limit) {
        setTotalCount(page * limit + 1);
      } else {
        setTotalCount(offset + data.length);
      }
    } catch (error) {
      console.error("Error fetching violation data:", error);
      setViolationData([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   getViolationData();
  // }, [page, limit, companies_id]);

  const headData = [
    {
      label: "Violation Date",
      key: "insp_date",
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
    {
      label: "Report Number",
      key: "report_number",
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
    count: totalCount || violationData?.length,
    getViolationData,
    isLoading,
  };
};
