import React, {memo} from "react";
import {Box, Flex, Text, HStack} from "@chakra-ui/react";
import {LuChevronUp, LuChevronDown} from "react-icons/lu";

const CTableTh = ({
  children,
  sortable = false,
  sortDirection = null,
  onSort,
  bg = "gray.50",
  py = "8px",
  px = "20px",
  maxW = "100%",
  width = "auto",
  minW = "80px",
  zIndex = 0,
  borderColor = "gray.200",
  ...props
}) => {
  const getSortIcon = () => {
    if (!sortable) return null;

    return (
      <Flex flexDirection="column" spacing={0} align="center" gap={0}>
        <LuChevronUp
          size={12}
          color={sortDirection === "asc" ? "#6B7280" : "#A4A7AE"}
        />
        <LuChevronDown
          size={12}
          color={sortDirection === "desc" ? "#6B7280" : "#A4A7AE"}
          style={{marginTop: "-2px"}}
        />
      </Flex>
    );
  };

  return (
    <Box
      zIndex={zIndex}
      as="th"
      onClick={sortable ? onSort : undefined}
      cursor={sortable ? "pointer" : "default"}
      userSelect="none"
      py={py}
      px={px}
      fontSize="14px"
      fontWeight="600"
      color="#1E293B"
      borderBottom="1px solid"
      borderColor={borderColor}
      textAlign="left"
      bg={bg}
      minWidth={minW}
      width={width}
      maxW={maxW}
      whiteSpace="nowrap"
      _hover={sortable ? {bg: "gray.100"} : {}}
      transition="all 0.2s ease"
      {...props}>
      <Flex align="center" gap="8px" width="100%">
        <Text fontSize="14px" fontWeight="600" color="#1E293B" noOfLines={1}>
          {children}
        </Text>
        {getSortIcon()}
      </Flex>
    </Box>
  );
};

export default memo(CTableTh);
