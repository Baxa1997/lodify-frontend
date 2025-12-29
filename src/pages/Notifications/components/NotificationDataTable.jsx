import {
  Box,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Spinner,
  Center,
  Button,
} from "@chakra-ui/react";
import {useState} from "react";
import SimplePagination from "@components/SimplePagination";
import {ChevronRightIcon, ChevronDownIcon} from "@chakra-ui/icons";

export const NotificationDataTable = ({
  headData = [],
  data = [],
  caption,
  limit,
  page,
  pagination,
  count = 0,
  actionLabel = "Action",
  isLoading = false,
  tableProps = {},
  setPage = () => {},
  setLimit = () => {},
  ...props
}) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (rowIndex) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowIndex)) {
      newExpandedRows.delete(rowIndex);
    } else {
      newExpandedRows.add(rowIndex);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <Box display="flex" flexDirection="column" h="100%" {...props}>
      <Box flex="1" overflowX="auto" overflowY="auto" minH="0">
        <Table variant="simple" {...tableProps}>
          {caption && <TableCaption>{caption}</TableCaption>}
          <Thead
            bgColor="#F9FAFB"
            borderBottom="1px solid"
            borderColor="#E5E7EB"
            position="sticky"
            top="0"
            zIndex="10">
            <Tr>
              {headData?.map((head, index) => (
                <Th
                  p="10px 16px"
                  key={index}
                  isNumeric={head.isNumeric}
                  width={head.thProps?.width || "130px"}
                  color="#374151"
                  fontWeight={"600"}
                  fontSize={"12px"}
                  textTransform="capitalize"
                  letterSpacing="0.5px"
                  borderBottom="1px solid #E5E7EB"
                  {...head.thProps}>
                  <Box display="flex" alignItems="center" gap="6px">
                    {head.label}
                    {head?.infoText && (
                      <Tooltip
                        placement="top"
                        flexShrink="0"
                        label={head.infoText}>
                        <img
                          src="/img/info.svg"
                          width="14"
                          height="14"
                          alt="Info"
                        />
                      </Tooltip>
                    )}
                  </Box>
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={headData.length}>
                  <Center h="calc(100vh - 420px)" py={8}>
                    <Spinner size="lg" color="blue.500" />
                  </Center>
                </Td>
              </Tr>
            ) : (
              data?.map((row, rowIndex) => (
                <>
                  <Tr>
                    {headData?.map((head, colIndex) => {
                      if (colIndex === 0) {
                        return (
                          <Td
                            key={colIndex}
                            width={head.tdProps?.width || "180px"}
                            fontWeight={"400"}
                            fontSize={"14px"}
                            color="#374151"
                            borderBottom="1px solid #F3F4F6"
                            bg="white"
                            px={head.tdProps?.px || "16px"}
                            py={head.tdProps?.py || "12px"}
                            {...head.tdProps}>
                            {head?.key === "action" ? (
                              <Box display="flex" alignItems="center" gap="6px">
                                <Button
                                  fontWeight="500"
                                  variant="outline"
                                  color="#535862"
                                  h="28px"
                                  w="100px"
                                  fontSize="13px"
                                  borderColor="#535862"
                                  borderRadius="22px"
                                  px="12px">
                                  {actionLabel}
                                </Button>
                              </Box>
                            ) : (
                              <Box display="flex" alignItems="center" gap="6px">
                                {head?.render
                                  ? head.render(
                                      row[head.key],
                                      row,
                                      head,
                                      rowIndex
                                    )
                                  : row[head.key]}
                                {row.children && (
                                  <Box
                                    onClick={() => toggleRow(rowIndex)}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    width="20px"
                                    height="20px">
                                    {expandedRows.has(rowIndex) ? (
                                      <ChevronDownIcon
                                        width="20px"
                                        height="20px"
                                      />
                                    ) : (
                                      <ChevronRightIcon
                                        width="20px"
                                        height="20px"
                                      />
                                    )}
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Td>
                        );
                      }

                      return (
                        <Td
                          key={colIndex}
                          isNumeric={head.isNumeric}
                          width={head.tdProps?.width || "180px"}
                          fontWeight={"400"}
                          fontSize={"14px"}
                          color="#374151"
                          borderBottom="1px solid #F3F4F6"
                          bg="white"
                          px={head.tdProps?.px || "16px"}
                          py={head.tdProps?.py || "12px"}
                          {...head.tdProps}>
                          {head?.render
                            ? head.render(
                                row[head.key],
                                row,
                                head,
                                rowIndex,
                                false,
                                null
                              )
                            : row[head.key]}
                        </Td>
                      );
                    })}
                  </Tr>
                </>
              ))
            )}
          </Tbody>
        </Table>
      </Box>
      {pagination && (
        <Box
          width="100%"
          borderTop="1px solid"
          borderColor="#E5E7EB"
          bg="white"
          flexShrink={0}>
          <Box padding="12px 24px" width="100%">
            <SimplePagination
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              pageCount={Math.ceil(count / limit) || 1}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
