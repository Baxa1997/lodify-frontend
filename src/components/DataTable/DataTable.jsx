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
import {useState, useRef, useEffect} from "react";
import SimplePagination from "@components/SimplePagination";
import {ChevronRightIcon, ChevronDownIcon} from "@chakra-ui/icons";
import {format, parseISO, isValid} from "date-fns";

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
  maxH,
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

  const formatDateValue = (value, head) => {
    if (!head?.format || !value) return value;

    try {
      const date =
        typeof value === "string" ? parseISO(value) : new Date(value);
      if (isValid(date)) {
        return format(date, "MMMM d, yyyy");
      }
    } catch (error) {
      console.log("error", error);
    }
    return value;
  };

  const TruncatedText = ({children}) => {
    const textRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);
    const [tooltipText, setTooltipText] = useState("");

    useEffect(() => {
      const checkTruncation = () => {
        if (textRef.current) {
          const element = textRef.current;
          const isOverflowing = element.scrollWidth > element.clientWidth;
          setIsTruncated(isOverflowing);

          if (isOverflowing) {
            const text = element.textContent || element.innerText || "";
            setTooltipText(text.trim());
          } else {
            setTooltipText("");
          }
        }
      };

      const timeoutId = setTimeout(checkTruncation, 0);

      const resizeObserver = new ResizeObserver(checkTruncation);
      if (textRef.current) {
        resizeObserver.observe(textRef.current);
      }

      return () => {
        clearTimeout(timeoutId);
        resizeObserver.disconnect();
      };
    }, [children]);

    const content = (
      <Box
        ref={textRef}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        width="100%"
        minW="0">
        {children}
      </Box>
    );

    if (isTruncated && tooltipText) {
      return (
        <Tooltip label={tooltipText} placement="top" hasArrow>
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  return (
    <Box borderRadius="12px" display="flex" flexDirection="column" {...props}>
      <Box flex="1" overflow="auto" maxH={maxH}>
        <Table variant="simple" tableLayout="auto" {...tableProps}>
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
                  key={index}
                  isNumeric={head.isNumeric}
                  minW={head.thProps?.minW || "160px"}
                  maxW={head.thProps?.maxW || "250px"}
                  w={head.thProps?.width || "auto"}
                  color="#374151"
                  fontWeight={"600"}
                  fontSize={"12px"}
                  textTransform="capitalize"
                  letterSpacing="0.5px"
                  borderBottom="1px solid #E5E7EB"
                  verticalAlign="middle"
                  px={head?.thProps?.px || "20px"}
                  py={head?.thProps?.py || "12px"}
                  {...head.thProps}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap="8px"
                    whiteSpace="nowrap">
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
                    <Spinner size="lg" color="#EF6820" />
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
                            minW={head.tdProps?.minW || "160px"}
                            maxW={head.tdProps?.maxW || "250px"}
                            w={head.tdProps?.width || "auto"}
                            fontWeight={"400"}
                            fontSize={"14px"}
                            color="#374151"
                            borderBottom="1px solid #F3F4F6"
                            bg="white"
                            px={head?.tdProps?.px || "20px"}
                            py={head?.tdProps?.py || "12px"}
                            verticalAlign="middle"
                            {...head?.tdProps}>
                            {head?.key === "status" ? (
                              <Box display="flex" alignItems="center" gap="8px">
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
                                  Claims
                                </Button>
                                <Button
                                  fontWeight="500"
                                  variant="outline"
                                  color="#535862"
                                  h="28px"
                                  w="100px"
                                  fontSize="13px"
                                  borderColor="#535862"
                                  borderRadius="22px">
                                  Billing
                                </Button>
                                <Button
                                  fontWeight="500"
                                  color="#535862"
                                  variant="outline"
                                  colorScheme="blue"
                                  h="28px"
                                  w="100px"
                                  fontSize="13px"
                                  borderColor="#535862"
                                  borderRadius="22px">
                                  Dispatch
                                </Button>
                              </Box>
                            ) : (
                              <Box
                                display="flex"
                                alignItems="center"
                                gap="8px"
                                whiteSpace="nowrap">
                                <TruncatedText>
                                  {head?.render
                                    ? head?.render(
                                        row?.[head?.key],
                                        row,
                                        head,
                                        rowIndex
                                      )
                                    : formatDateValue(row?.[head?.key], head)}
                                </TruncatedText>
                                {row?.children && (
                                  <Box
                                    onClick={() => toggleRow(rowIndex)}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    width="20px"
                                    height="20px"
                                    flexShrink="0">
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
                          minW={head.tdProps?.minW || "130px"}
                          maxW={head.tdProps?.maxW || "250px"}
                          w={head.tdProps?.width || "auto"}
                          fontWeight={"400"}
                          fontSize={"14px"}
                          color="#374151"
                          borderBottom="1px solid #F3F4F6"
                          bg="white"
                          px={head.tdProps?.px || "20px"}
                          py={head.tdProps?.py || "12px"}
                          verticalAlign="middle"
                          {...head.tdProps}>
                          <TruncatedText>
                            {head?.render
                              ? head.render(
                                  row[head.key],
                                  row,
                                  head,
                                  rowIndex,
                                  false,
                                  null
                                )
                              : formatDateValue(row[head.key], head)}
                          </TruncatedText>
                        </Td>
                      );
                    })}
                  </Tr>

                  {expandedRows.has(rowIndex) &&
                    row.children?.map((child, childIndex) => (
                      <Tr key={`${rowIndex}-child-${childIndex}`}>
                        {headData?.map((head, colIndex) => (
                          <Td
                            padding="8px 16px"
                            key={colIndex}
                            isNumeric={head.isNumeric}
                            minW={head.tdProps?.minW || "160px"}
                            maxW={head.tdProps?.maxW || "250px"}
                            w={head.tdProps?.width || "auto"}
                            fontWeight={"400"}
                            fontSize={"14px"}
                            verticalAlign="middle"
                            {...head.tdProps}>
                            <Box
                              paddingLeft={colIndex === 0 ? "32px" : "0"}
                              display="flex"
                              alignItems="center">
                              <TruncatedText>
                                {head?.render
                                  ? head.render(
                                      child[head.key],
                                      child,
                                      head,
                                      childIndex,
                                      true,
                                      rowIndex
                                    )
                                  : formatDateValue(child[head.key], head)}
                              </TruncatedText>
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
      </Box>
      {pagination && (
        <Box
          width="100%"
          borderTop="1px solid"
          borderColor="#E5E7EB"
          bg="white"
          position="sticky"
          bottom="0"
          zIndex="10">
          <Box padding="12px 24px" width="100%">
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
