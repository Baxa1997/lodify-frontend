import {useState, useEffect} from "react";
import {useGetSmsResult} from "../../../../services/companyInfo.service";
import carrierService from "@services/carrierService";
import {useSearchParams} from "react-router-dom";

export const useViolationProps = () => {
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
      // Calculate offset based on page and limit
      // Page 1: offset = 0, limit = 10
      // Page 2: offset = 10, limit = 10
      // Page 3: offset = 20, limit = 10
      const offset = (page - 1) * limit;
      
      const response = await carrierService?.getCarrierInfo({
        data: {
          method: "list",
          object_data: {
            companies_id: companies_id,
            offset: offset,
            limit: limit,
          },
          table: "violations",
        },
      });

      const data = response?.data?.response || [];
      setViolationData(data);
      
      // Update total count based on response
      // If we get a full page, there might be more data
      if (data.length === limit) {
        // If we got a full page, estimate there's at least one more page
        // This will be updated when we reach the last page
        setTotalCount((page * limit) + 1);
      } else {
        // If we got less than limit, this is the last page
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

  // Fetch data when page or limit changes
  useEffect(() => {
    getViolationData();
  }, [page, limit, companies_id]);

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
    count: totalCount || violationData?.length,
    getViolationData,
    isLoading,
  };
};
