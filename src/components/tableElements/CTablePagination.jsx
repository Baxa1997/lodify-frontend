import { Button, Flex, Text } from "@chakra-ui/react";
import React, { memo } from "react";
import Select from "../Select";

const CTablePagination = ({
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  ...props
}) => {
  return (
    <Flex
      justify="space-between"
      alignItems="center"
      p={"12px 24px"}
      borderTop="1px solid"
      borderColor="gray.200"
      bg="gray.50"
      width="100%"
      flexShrink={0}
      {...props}>
      <Flex
        align="center"
        gap={2}>
        <Text
          fontSize="14px"
          color="gray.600">
          Show
        </Text>
        <Select
          value={pageSize.toString()}
          onChange={(value) =>
            onPageSizeChange && onPageSizeChange(parseInt(value))
          }
          options={pageSizeOptions.map((size) => ({
            value: size.toString(),
            label: size.toString(),
          }))}
          width="80px"
          height="32px"
          fontSize="14px"
          padding="0"
          size="sm"
          dropdownPosition="top"
        />
        <Text
          fontSize="14px"
          color="gray.600">
          Page {currentPage} of {Math.max(totalPages, 1)}
        </Text>
      </Flex>

      <Flex
        alignItems="center"
        gap={"12px"}>
        <Button
          h={"32px"}
          p={"8px 14px"}
          borderRadius={"8px"}
          border={"1px solid #E9EAEB"}
          variant="outline"
          fontWeight={"600"}
          color={currentPage === 1 ? "#A4A7AE" : "#1E293B"}
          size="sm"
          isDisabled={currentPage === 1 || totalPages === 0}
          onClick={() => onPageChange && onPageChange(currentPage - 1)}>
          Previous
        </Button>
        <Button
          borderRadius={"8px"}
          h={"32px"}
          p={"8px 14px"}
          border={"1px solid #E9EAEB"}
          variant="outline"
          fontWeight={"600"}
          color={
            currentPage === Math.max(totalPages, 1) ? "#A4A7AE" : "#1E293B"
          }
          size="sm"
          isDisabled={
            currentPage === Math.max(totalPages, 1) || totalPages === 0
          }
          onClick={() => onPageChange && onPageChange(currentPage + 1)}>
          Next
        </Button>
      </Flex>
    </Flex>
  );
};

export default memo(CTablePagination);
