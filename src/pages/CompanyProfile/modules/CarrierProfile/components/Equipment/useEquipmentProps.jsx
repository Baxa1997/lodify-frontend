import {useState, useEffect, useCallback} from "react";
import {useSearchParams} from "react-router-dom";
import {HStack} from "@chakra-ui/react";
import {LuChevronUp, LuChevronDown} from "react-icons/lu";
import {Box, Text, Badge} from "@chakra-ui/react";
import carrierService from "@services/carrierService";

export const useEquipmentProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [equipmentData, setEquipmentData] = useState([]);
  const [fleetStatsData, setFleetStatsData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const getEquipmentData = useCallback(async () => {
    if (!companies_id) return;

    setIsLoading(true);
    try {
      const offset = (page - 1) * limit;

      const response = await carrierService?.getCarrierInfo({
        data: {
          method: "list",
          object_data: {
            companies_id: companies_id,
            offset: offset,
            limit: limit,
          },
          table: "equipment",
        },
      });

      const response2 = await carrierService?.getCarrierInfo({
        data: {
          method: "get",
          object_data: {
            companies_id: companies_id,
          },
          table: "fleet_stats",
        },
      });
      console.log("response2response2", response2);
      const data = response?.data?.response || [];
      const fleetStats = response2?.data || {};
      setEquipmentData(data);
      setFleetStatsData(fleetStats);

      if (data.length === limit) {
        setTotalCount(page * limit + 1);
      } else {
        setTotalCount(offset + data.length);
      }
    } catch (error) {
      console.error("Error fetching equipment data:", error);
      setEquipmentData([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [companies_id, page, limit]);

  useEffect(() => {
    getEquipmentData();
  }, [getEquipmentData]);

  const headData = [
    {
      label: (
        <HStack spacing={1} display="inline-flex" alignItems="center">
          <span>TYPE</span>
          <HStack spacing={0} align="center" display="inline-flex" ml="4px">
            <LuChevronUp size={12} opacity={0.3} />
            <LuChevronDown
              size={12}
              opacity={0.3}
              style={{marginTop: "-2px"}}
            />
          </HStack>
        </HStack>
      ),
      key: "type",
      sortable: true,
      thProps: {
        width: "140px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
      render: (value, row) => (
        <HStack spacing="8px">
          <Box
            as="img"
            src="/img/truck.svg"
            alt="truck"
            w="20px"
            h="20px"
            filter="brightness(0) saturate(100%) invert(60%) sepia(95%) saturate(2000%) hue-rotate(0deg) brightness(100%) contrast(100%)"
          />
          <Text fontSize="14px" color="#374151">
            {value || "Power Unit"}
          </Text>
        </HStack>
      ),
    },

    {
      label: (
        <HStack spacing={1} display="inline-flex" alignItems="center">
          <span>PLATE</span>
          <HStack spacing={0} align="center" display="inline-flex" ml="4px">
            <LuChevronUp size={12} opacity={0.3} />
            <LuChevronDown
              size={12}
              opacity={0.3}
              style={{marginTop: "-2px"}}
            />
          </HStack>
        </HStack>
      ),
      key: "licence_plate",
      sortable: true,
      thProps: {
        width: "140px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
    },
    {
      label: "YEAR",
      key: "year",
      thProps: {
        width: "100px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
    },
    {
      label: "MAKE",
      key: "make",
      thProps: {
        width: "140px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
    },

    {
      label: "VIN",
      key: "vin_number",
      thProps: {
        width: "200px",
        px: "16px",
        py: "12px",
      },
      tdProps: {
        px: "16px",
        py: "12px",
      },
    },
  ];

  const bodyData = equipmentData;

  return {
    fleetStatsData,
    headData,
    bodyData,
    page,
    setPage,
    limit,
    setLimit,
    count: totalCount || equipmentData?.length,
    getEquipmentData,
    isLoading,
  };
};
