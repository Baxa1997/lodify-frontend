import React, { useState } from "react";
import { Box, Text, Flex, Badge, HStack, IconButton } from "@chakra-ui/react";

import {
  LuChevronUp,
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
} from "react-icons/lu";
import Select from "../Select";

const Table = ({
  data = [],
  columns = [],
  sortable = true,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onSort,
  onPageChange,
  onPageSizeChange,
  loading = false,
  emptyMessage = "No data available",
  rowKey = "id",
  striped = false,
  hover = true,
  size = "md",
  variant = "simple",
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handleSort = (key) => {
    if (!sortable) return;

    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    if (onSort) {
      onSort({ key, direction });
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(parseInt(newSize));
    setCurrentPage(1);
    if (onPageSizeChange) {
      onPageSizeChange(parseInt(newSize));
    }
  };

  const getSortIcon = (columnKey) => {
    if (!sortable || !columnKey) return null;

    if (sortConfig.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <LuChevronUp size={16} />
      ) : (
        <LuChevronDown size={16} />
      );
    }

    return (
      <HStack spacing={1}>
        <LuChevronUp
          size={12}
          opacity={0.3} />
        <LuChevronDown
          size={12}
          opacity={0.3} />
      </HStack>
    );
  };

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item, column);
    }

    if (column.type === "badge") {
      return (
        <Badge
          colorScheme={column.badgeColor || "green"}
          variant="subtle"
          px={2}
          py={1}
          borderRadius="full"
          fontSize="12px"
          fontWeight="500">
          {item[column.key]}
        </Badge>
      );
    }

    return item[column.key] || "-";
  };

  const headerBg = "gray.50";
  const borderColor = "gray.200";
  const hoverBg = "gray.50";

  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid"
      borderColor={borderColor}
      overflow="visible"
      {...props}>
      <Box
        as="table"
        width="100%"
        borderCollapse="collapse">
        <Box
          as="thead"
          bg={headerBg}>
          <Box as="tr">
            {columns.map((column, index) => (
              <Box
                as="th"
                key={column.key || index}
                onClick={() => handleSort(column.key)}
                cursor={
                  sortable && column.sortable !== false ? "pointer" : "default"
                }
                userSelect="none"
                py={4}
                px={6}
                fontSize="14px"
                fontWeight="600"
                color="gray.700"
                borderBottom="1px solid"
                borderColor={borderColor}
                textAlign="left"
                _hover={
                  sortable && column.sortable !== false ? { bg: "gray.100" } : {}
                }>
                <Flex
                  align="center"
                  gap={2}>
                  <Text>{column.title}</Text>
                  {getSortIcon(column.key)}
                </Flex>
              </Box>
            ))}
          </Box>
        </Box>

        <Box as="tbody">
          {loading ? (
            <Box as="tr">
              <Box
                as="td"
                colSpan={columns.length}
                textAlign="center"
                py={8}>
                <Text color="gray.500">Loading...</Text>
              </Box>
            </Box>
          ) : paginatedData.length === 0 ? (
            <Box as="tr">
              <Box
                as="td"
                colSpan={columns.length}
                textAlign="center"
                py={8}>
                <Text color="gray.500">{emptyMessage}</Text>
              </Box>
            </Box>
          ) : (
            paginatedData.map((item, rowIndex) => (
              <Box
                as="tr"
                key={item[rowKey] || rowIndex}
                _hover={hover ? { bg: hoverBg } : {}}
                bg={striped && rowIndex % 2 === 1 ? "gray.50" : "transparent"}>
                {columns.map((column, colIndex) => (
                  <Box
                    as="td"
                    key={column.key || colIndex}
                    py={4}
                    px={6}
                    fontSize="14px"
                    color="gray.700"
                    borderBottom="1px solid"
                    borderColor={borderColor}>
                    {renderCellContent(item, column)}
                  </Box>
                ))}
              </Box>
            ))
          )}
        </Box>
      </Box>

      {pagination && data.length > 0 && (
        <Flex
          justify="space-between"
          align="center"
          p={4}
          borderTop="1px solid"
          borderColor={borderColor}
          bg="gray.50">
          <Flex
            align="center"
            gap={2}>
            <Text
              fontSize="14px"
              color="gray.600">
              Show
            </Text>
            <Select
              value={itemsPerPage.toString()}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              options={pageSizeOptions.map((size) => ({
                value: size.toString(),
                label: size.toString(),
              }))}
              width="80px"
              height="32px"
              fontSize="14px"
            />
            <Text
              fontSize="14px"
              color="gray.600">
              entries
            </Text>
          </Flex>

          <Text
            fontSize="14px"
            color="gray.600">
            Page {currentPage} of {totalPages}
          </Text>

          <HStack spacing={2}>
            <IconButton
              icon={<LuChevronLeft size={16} />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              aria-label="Previous page"
            />
            <IconButton
              icon={<LuChevronRight size={16} />}
              size="sm"
              variant="outline"
              isDisabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              aria-label="Next page"
            />
          </HStack>
        </Flex>
      )}
    </Box>
  );
};

export default Table;
