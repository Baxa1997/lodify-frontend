import React from "react";
import {Box} from "@chakra-ui/react";
import CTablePagination from "./CTablePagination";

const CTable = ({
  children,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  height,
  minHeight,
  overflow = "auto",
  w = "100%",
  isPagination = true,
  scrollRef = null,
  ...props
}) => {
  const heightProps = {};
  if (height) {
    heightProps.height = height;
  }
  if (minHeight) {
    heightProps.minHeight = minHeight;
  }

  return (
    <Box
      w={w}
      bg="white"
      borderRadius="12px"
      border="1px solid"
      borderColor="#E9EAEB"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      {...heightProps}
      {...props}>
      <Box
        ref={scrollRef}
        flex="1"
        overflowX={overflow}
        overflowY={overflow}
        position="relative"
        sx={{
          "&::-webkit-scrollbar": {
            height: "12px",
            width: "0px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "6px",
            border: "2px solid #f1f1f1",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#a8a8a8",
          },
          "&::-webkit-scrollbar-corner": {
            background: "#f1f1f1",
          },
        }}>
        <Box as="table" borderCollapse="collapse" w="100%" tableLayout="fixed">
          {children}
        </Box>
      </Box>

      {isPagination && (
        <CTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </Box>
  );
};

export default CTable;
