import {
  Box,
  Flex,
  Text,
  Tooltip,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import SimpleTimer from "@components/SimpleTimer";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableTd,
  CTableTh,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import tripsService from "@services/tripsService";
import {useQuery} from "@tanstack/react-query";
import {formatDate} from "@utils/dateFormats";
import {
  calculateTimeDifference,
  getActionButtonColor,
  getActionButtonText,
  getRowBackgroundColor,
} from "@utils/timeUtils";
import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {sidebarActions} from "@store/sidebar";
import {tableActionsNeeded} from "../../hooks";

function ActiveComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const userId = useSelector((state) => state.auth.userId);
  const envId = useSelector((state) => state.auth.environmentId);
  const clientType = useSelector((state) => state.auth.clientType);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);

  const getCustomerInfo = (trip) => {
    return {
      companyName: trip.shipper?.name || "N/A",
      customer:
        trip.shipper?.contact_name || trip.shipper?.customer_name || "N/A",
      trips: trip.shipper?.total_trips || 0,
      rate: trip.shipper?.rating || 0,
    };
  };

  const {
    data: tripsData = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "ACTIONS_NEEDED_TRIPS",
      currentPage,
      pageSize,
      sortConfig,
      searchTerm,
    ],
    queryFn: () =>
      tripsService.getList({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "list",
        object_data: {
          search: searchTerm,
          limit: pageSize,
          page: (currentPage - 1) * pageSize,
          brokers_id:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? brokersId
              : undefined,
          carriers_id:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? brokersId
              : userId,
          client_type:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? "broker"
              : "carrier",
        },
        table: "late_trips",
      }),
    select: (data) => data?.data?.response || [],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const handleRowClick = (id, trip) => {
    dispatch(sidebarActions.setSidebar(false));
    navigate(`/admin/trips/${id}`, {
      state: {
        label: `${trip?.drivers?.first_name}.${trip?.drivers?.last_name}`,
      },
    });
  };

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const totalPages = tripsData?.total
    ? Math.ceil(tripsData.total / pageSize)
    : 0;
  const trips = tripsData || [];

  return (
    <Box mt={"26px"}>
      <Box mt={6}>
        <CTable
          width="100%"
          height="calc(100vh - 210px)"
          overflow="auto"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead zIndex={999999}>
            <Box as={"tr"}>
              {tableActionsNeeded.map((element) => (
                <CTableTh
                  zIndex={999999}
                  maxW="334px"
                  sortable={element.sortable}
                  sortDirection={
                    sortConfig.key === element.key ? sortConfig.direction : null
                  }
                  key={element.id}
                  onSort={() => handleSort(element.key)}>
                  {element.name}
                </CTableTh>
              ))}
            </Box>
          </CTableHead>

          <CTableBody>
            {isLoading ? (
              <CTableRow>
                <CTableTd
                  colSpan={tableActionsNeeded.length}
                  textAlign="center"
                  py={8}>
                  <Center minH="400px">
                    <Spinner size="lg" color="#FF5B04" thickness="4px" />
                  </Center>
                </CTableTd>
              </CTableRow>
            ) : error ? (
              <CTableRow>
                <CTableTd
                  colSpan={tableActionsNeeded.length}
                  textAlign="center"
                  py={8}
                  color="red.500">
                  Error loading trips: {error?.message || "Unknown error"}
                </CTableTd>
              </CTableRow>
            ) : trips.length === 0 ? (
              <CTableRow>
                <CTableTd
                  colSpan={tableActionsNeeded.length}
                  textAlign="center"
                  py={8}>
                  No trips found
                </CTableTd>
              </CTableRow>
            ) : (
              trips?.map((trip, index) => {
                return (
                  <React.Fragment key={trip.guid || index}>
                    <CTableRow
                      hover={false}
                      bg={getRowBackgroundColor(
                        calculateTimeDifference(trip?.origin?.[0]?.arrive_by)
                      )}>
                      <CTableTd>
                        <Tooltip
                          hasArrow
                          label={
                            <Box
                              p={3}
                              bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                              color="white"
                              borderRadius="md"
                              minW="180px">
                              <VStack spacing={1} align="start">
                                <Text
                                  fontSize="14px"
                                  fontWeight="600"
                                  color="white">
                                  {getCustomerInfo(trip).companyName}
                                </Text>
                                <Text
                                  fontSize="14px"
                                  fontWeight="600"
                                  color="white">
                                  {getCustomerInfo(trip).customer}
                                </Text>
                              </VStack>
                            </Box>
                          }
                          placement="bottom-start"
                          bg="transparent"
                          openDelay={300}>
                          <Text
                            cursor="pointer"
                            _hover={{textDecoration: "underline"}}
                            color="#181D27">
                            {trip.customer?.name || trip?.shipper?.name || ""}
                          </Text>
                        </Tooltip>
                      </CTableTd>
                      <CTableTd minWidth="180px">
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Tooltip
                            hasArrow
                            label={
                              <Box
                                p={3}
                                bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                                color="white"
                                borderRadius="md"
                                minW="180px">
                                <VStack spacing={1} align="start">
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="white">
                                    {getCustomerInfo(trip).companyName}
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="white">
                                    {getCustomerInfo(trip).customer}
                                  </Text>
                                </VStack>
                              </Box>
                            }
                            placement="bottom-start"
                            bg="transparent"
                            openDelay={300}>
                            <Text
                              color="#181D27"
                              cursor="pointer"
                              _hover={{textDecoration: "underline"}}>
                              {trip.id || ""}
                            </Text>
                          </Tooltip>
                        </Flex>
                      </CTableTd>
                      <CTableTd>
                        <Flex
                          alignItems="center"
                          gap="16px"
                          justifyContent="space-between">
                          <Box>
                            <Tooltip
                              hasArrow
                              label={
                                <Box
                                  p={3}
                                  bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                                  color="white"
                                  borderRadius="md"
                                  minW="180px">
                                  <VStack spacing={1} align="start">
                                    <Text
                                      fontSize="14px"
                                      fontWeight="600"
                                      color="white">
                                      {getCustomerInfo(trip).companyName}
                                    </Text>
                                    <Text
                                      fontSize="14px"
                                      fontWeight="600"
                                      color="white">
                                      {getCustomerInfo(trip).customer}
                                    </Text>
                                  </VStack>
                                </Box>
                              }
                              placement="bottom-start"
                              bg="transparent"
                              openDelay={300}>
                              <>
                                {" "}
                                <Text
                                  h="20px"
                                  fontSize="14px"
                                  fontWeight="500"
                                  color="#181D27"
                                  cursor="pointer"
                                  _hover={{textDecoration: "underline"}}>
                                  {`${trip.origin?.address ?? ""} / ${
                                    trip?.origin?.address_2 ?? ""
                                  }` || ""}
                                </Text>
                                <Text h="20px">
                                  {formatDate(
                                    trip?.origin?.[0]?.depart_at ?? ""
                                  )}
                                </Text>
                              </>
                            </Tooltip>
                          </Box>
                        </Flex>
                      </CTableTd>
                      <CTableTd>
                        <Box>
                          <Flex
                            gap="16px"
                            alignItems="center"
                            justifyContent="space-between">
                            <Box>
                              <Tooltip
                                label={
                                  <Box
                                    p={3}
                                    bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                                    color="white"
                                    borderRadius="md"
                                    minW="180px">
                                    <VStack spacing={1} align="start">
                                      <Text
                                        fontSize="14px"
                                        fontWeight="600"
                                        color="white">
                                        {getCustomerInfo(trip).companyName}
                                      </Text>
                                      <Text
                                        fontSize="14px"
                                        fontWeight="600"
                                        color="white">
                                        {getCustomerInfo(trip).customer}
                                      </Text>
                                    </VStack>
                                  </Box>
                                }
                                placement="bottom-start"
                                bg="transparent"
                                openDelay={300}>
                                <Text
                                  h="20px"
                                  fontSize="14px"
                                  fontWeight="500"
                                  color="#181D27"
                                  cursor="pointer"
                                  _hover={{textDecoration: "underline"}}>
                                  {`${trip.stop?.address ?? ""} / ${
                                    trip?.stop?.address_2 ?? ""
                                  }` || ""}
                                </Text>
                              </Tooltip>
                              <Text h="20px">
                                {formatDate(trip?.stop?.[0]?.arrive_by ?? "")}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </CTableTd>

                      <CTableTd>
                        <SimpleTimer
                          timeFromAPI={
                            trip?.origin?.[0]?.arrive_by ||
                            trip?.stop?.[0]?.arrive_by ||
                            trip?.deadline ||
                            "2025-10-08T12:33:00"
                          }
                          onTimeUp={() => {
                            console.log(`Timer finished for trip ${trip.id}`);
                          }}
                        />
                      </CTableTd>

                      <CTableTd>
                        <Tooltip
                          label={
                            <Box
                              p={3}
                              bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                              color="white"
                              borderRadius="md"
                              minW="180px">
                              <VStack spacing={1} align="start">
                                <Text
                                  fontSize="14px"
                                  fontWeight="600"
                                  color="white">
                                  {getCustomerInfo(trip).companyName}
                                </Text>
                                <Text
                                  fontSize="14px"
                                  fontWeight="600"
                                  color="white">
                                  {getCustomerInfo(trip).customer}
                                </Text>
                              </VStack>
                            </Box>
                          }
                          placement="bottom-start"
                          bg="transparent"
                          openDelay={300}>
                          <Text
                            cursor="pointer"
                            _hover={{textDecoration: "underline"}}
                            color="#181D27">
                            {trip?.pickup_reason ?? "---"}
                          </Text>
                        </Tooltip>
                      </CTableTd>

                      <CTableTd>
                        <Flex alignItems="center" gap={2}>
                          <Text
                            color={getActionButtonColor(
                              calculateTimeDifference(
                                trip?.origin?.[0]?.arrive_by ||
                                  trip?.stop?.[0]?.arrive_by ||
                                  trip?.deadline ||
                                  trip.timer_seconds
                              )
                            )}
                            fontWeight="600">
                            {getActionButtonText(
                              calculateTimeDifference(
                                trip?.origin?.[0]?.arrive_by ||
                                  trip?.stop?.[0]?.arrive_by ||
                                  trip?.deadline ||
                                  trip.timer_seconds
                              )
                            )}
                          </Text>
                        </Flex>
                      </CTableTd>
                    </CTableRow>
                  </React.Fragment>
                );
              })
            )}
          </CTableBody>
        </CTable>
      </Box>
    </Box>
  );
}

export default ActiveComponent;
