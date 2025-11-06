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
} from "@chakra-ui/react";
import { useState } from "react";
import SimplePagination from "@components/SimplePagination";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";

export const DataTable = ({
  headData = [],
  data = [],
  caption,
  limit,
  setLimit = () => {},
  page,
  setPage = () => {},
  pagination,
  isLoading = false,
  tableProps = {},
  count = 0,
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
    <Box
      overflow={"auto"}
      {...props}
    >
      <Table
        variant="simple"
        {...tableProps}
      >
        {caption && <TableCaption>{caption}</TableCaption>}
        <Thead
          bgColor="gray.50"
          borderBottom="1px solid"
          borderColor="gray.200"
          position="sticky"
          top="0"
          zIndex="1"
        >
          <Tr>
            {headData?.map((head, index) => (
              <Th
                key={index}
                isNumeric={head.isNumeric}
                width={"130px"}
                color="gray.900"
                fontWeight={"600"}
                fontSize={"12px"}
                {...head.thProps}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap="6px"
                >
                  {head.label}
                  {head?.infoText && (
                    <Tooltip
                      placement="top"
                      flexShrink="0"
                      label={head.infoText}
                    >
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
                <Center
                  h="calc(100vh - 420px)"
                  py={8}
                >
                  <Spinner
                    size="lg"
                    color="blue.500"
                  />
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
                          padding="8px 6px"
                          width={"180px"}
                          fontWeight={"400"}
                          fontSize={"14px"}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            gap="6px"
                          >
                            {head?.render
                              ? head.render(row[head.key], row, head, rowIndex)
                              : row[head.key]}
                            {row.children && (
                              <Box
                                onClick={() => toggleRow(rowIndex)}
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                width="20px"
                                height="20px"
                              >
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
                        </Td>
                      );
                    }

                    return (
                      <Td
                        padding="8px 6px"
                        key={colIndex}
                        isNumeric={head.isNumeric}
                        width={"180px"}
                        fontWeight={"400"}
                        fontSize={"14px"}
                        {...head.tdProps}
                      >
                        {head?.render
                          ? head.render(
                            row[head.key],
                            row,
                            head,
                            rowIndex,
                            false,
                            null,
                          )
                          : row[head.key]}
                      </Td>
                    );
                  })}
                </Tr>

                {expandedRows.has(rowIndex) &&
                  row.children?.map((child, childIndex) => (
                    <Tr key={`${rowIndex}-child-${childIndex}`}>
                      {headData?.map((head, colIndex) => (
                        <Td
                          padding="8px 6px"
                          key={colIndex}
                          isNumeric={head.isNumeric}
                          width={"180px"}
                          fontWeight={"400"}
                          fontSize={"14px"}
                          {...head.tdProps}
                        >
                          <Box
                            paddingLeft={colIndex === 0 ? "32px" : "0"}
                            display="flex"
                            alignItems="center"
                          >
                            {head?.render
                              ? head.render(
                                child[head.key],
                                child,
                                head,
                                childIndex,
                                true, // isChild
                                rowIndex, // parentIndex
                              )
                              : child[head.key]}
                          </Box>
                        </Td>
                      ))}
                    </Tr>
                  ))}
              </>
            ))
          )}
        </Tbody>
      </Table>
      {pagination && (
        <Box width="100%">
          <Box
            padding="12px 24px"
            width="100%"
          >
            <SimplePagination
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              pageCount={Math.ceil(count / limit)}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};
