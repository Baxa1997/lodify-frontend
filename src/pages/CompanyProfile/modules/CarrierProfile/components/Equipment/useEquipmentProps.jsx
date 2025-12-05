import { useGetTable } from "@services/items.service";
import CustomBadge from "../../../../../../components/CustomBadge/CustomBadge";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { HStack } from "@chakra-ui/react";
import { LuChevronUp, LuChevronDown } from "react-icons/lu";
import { Box, Text, Badge } from "@chakra-ui/react";

export const useEquipmentProps = () => {
  const [searchParams] = useSearchParams();
  const companies_id = searchParams.get("id");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: assetsData, isSuccess: operationIsSuccess } = useGetTable("assets", {  }, { data: JSON.stringify({ companies_id, offset: (page - 1) * limit, limit }) });

  const headData = [
    {
      label: (
        <HStack spacing={1} display="inline-flex" alignItems="center">
          <span>TYPE</span>
          <HStack spacing={0} align="center" display="inline-flex" ml="4px">
            <LuChevronUp size={12} opacity={0.3} />
            <LuChevronDown size={12} opacity={0.3} style={{marginTop: "-2px"}} />
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
      label: "STATE",
      key: "state",
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
      label: (
        <HStack spacing={1} display="inline-flex" alignItems="center">
          <span>PLATE</span>
          <HStack spacing={0} align="center" display="inline-flex" ml="4px">
            <LuChevronUp size={12} opacity={0.3} />
            <LuChevronDown size={12} opacity={0.3} style={{marginTop: "-2px"}} />
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
      label: "MODEL",
      key: "model",
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
    {
      label: "LAST SEEN",
      key: "last_seen",
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
          <Text fontSize="14px" color="#374151">
            {value || "7/09/2025"}
          </Text>
          <Badge
            bg="#F3F4F6"
            color="#374151"
            px="8px"
            py="2px"
            borderRadius="16px"
            fontSize="11px"
            fontWeight="500">
            Class 8
          </Badge>
        </HStack>
      ),
    },
  ];

  const bodyData = assetsData?.response;

  return {
    headData,
    bodyData,
    page, 
    setPage,
    limit,
    setLimit,
    count: assetsData?.count,
  };
};
