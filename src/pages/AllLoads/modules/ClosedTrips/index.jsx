import {
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableTd,
  CTableTh,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import tripsService from "@services/tripsService";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {formatDate} from "@utils/dateFormats";
import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {sidebarActions} from "@store/sidebar";
import AllLoadsFiltersComponent from "../../components/Filterscomponent";
import {format} from "date-fns";
import SimpleTimer from "@components/SimpleTimer";
import {tableElements} from "../../components/hooks";

function ClosedTrips({selectedTabIndex}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const envId = useSelector((state) => state.auth.environmentId);
  const userId = useSelector((state) => state.auth.userId);
  const [loadingTripId, setLoadingTripId] = useState(null);
  const queryClient = useQueryClient();

  const getLoadTypeColor = (loadType) => {
    const loadTypeColors = {
      Preloaded: "orange",
      Live: "green",
      Drop: "blue",
    };

    return loadTypeColors[loadType?.trim()] || "gray";
  };

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
      "TRIPS_LIST_CLOSED",
      selectedTabIndex,
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
          limit: 10,
          page: 0,
          with_timer: true,
          timer_expired: true,
          careers_id: userId,
        },
        table: "trips",
      }),
    select: (data) => data?.data?.response || [],
    enabled: true,
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
  const trips = tripsData?.data || tripsData || [];

  function formatToAmPm(timeString) {
    if (!timeString) return "";

    const [hourStr, minuteStr] = timeString.split(":");
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr || "0", 10);

    hour = (hour + 5) % 24;
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = (hour + 11) % 12;
    const formattedMinute = String(minute).padStart(2, "0");

    return `${displayHour}:${formattedMinute} ${ampm}`;
  }

  const handleAcceptTrip = (trip) => {
    setLoadingTripId(`accept-${trip.guid}`);
    const data = {
      data: {
        companies_id: userId,
        guid: trip?.guid,
      },
    };
    tripsService
      .acceptTrip(data)
      .then((res) => {
        queryClient.invalidateQueries({queryKey: ["TRIPS_LIST_CLOSED"]});
        setLoadingTripId(null);
      })
      .catch((error) => {
        console.error("Error accepting trip:", error);
        setLoadingTripId(null);
      })
      .finally(() => {
        setLoadingTripId(null);
      });
  };

  const handleRejectTrip = (trip) => {
    setLoadingTripId(`reject-${trip.guid}`);
    const computedData = {
      data: {
        companies_id: userId,
        orders_id: trip?.guid,
        date_time: new Date().toISOString(),
      },
    };
    tripsService
      .rejectTrip(computedData)
      .then((res) => {
        queryClient.invalidateQueries({queryKey: ["TRIPS_LIST_CLOSED"]});
        setLoadingTripId(null);
      })
      .catch((error) => {
        console.error("Error rejecting trip:", error);
        setLoadingTripId(null);
      })
      .finally(() => {
        setLoadingTripId(null);
      });
  };

  return (
    <Box mt={"26px"}>
      <AllLoadsFiltersComponent
        filterButton={true}
        actionButton={true}
        actionButtonText="Add Load"
        onActionButtonClick={() => navigate("/admin/trips/add-trip")}
        onSearch={handleSearch}
        searchValue={searchTerm}
      />

      <Box mt={6}>
        <CTable
          width="100%"
          height="calc(100vh - 330px)"
          overflow="auto"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead zIndex={999999}>
            <Box as={"tr"}>
              {tableElements.map((element) => (
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
                  colSpan={tableElements.length}
                  textAlign="center"
                  py={8}>
                  Loading trips...
                </CTableTd>
              </CTableRow>
            ) : error ? (
              <CTableRow>
                <CTableTd
                  colSpan={tableElements.length}
                  textAlign="center"
                  py={8}
                  color="red.500">
                  Error loading trips: {error?.message || "Unknown error"}
                </CTableTd>
              </CTableRow>
            ) : trips.length === 0 ? (
              <CTableRow>
                <CTableTd
                  colSpan={tableElements.length}
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
                      style={{
                        backgroundColor: "white",
                        cursor: "pointer",
                      }}>
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
                            {trip.shipper?.name || ""}
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
                          <TripStatus
                            rowClick={handleRowClick}
                            status={trip?.current_trip}
                            tripId={trip.id || trip.guid}
                          />
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
                                  {`${trip.origin?.[0]?.address ?? ""} / ${
                                    trip?.origin?.[0]?.address_2 ?? ""
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
                          <TripStatus status={trip?.total_trips} />
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
                                  {`${trip.stop?.[0]?.address ?? ""} / ${
                                    trip?.stop?.[0]?.address_2 ?? ""
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
                          <Flex gap="24px" alignItems="center">
                            {" "}
                            <Box>
                              <Text
                                fontSize={"12px"}
                                fontWeight={500}
                                cursor="pointer"
                                _hover={{textDecoration: "underline"}}
                                color="#181D27">
                                {format(
                                  trip?.origin?.[0]?.arrive_by,
                                  "MM/dd/yyyy"
                                ) ?? ""}
                              </Text>
                              <Text fontSize={"14px"} fontWeight={400} h="20px">
                                {formatToAmPm(trip?.origin?.[0]?.arrive_by)}
                              </Text>
                            </Box>
                            <TripDriverVerification trip={trip} />
                          </Flex>
                        </Tooltip>
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
                          <Box>
                            <Text
                              fontSize={"12px"}
                              fontWeight={500}
                              cursor="pointer"
                              _hover={{textDecoration: "underline"}}
                              color="#181D27">
                              {format(
                                trip?.last_stop?.[0]?.arrive_by,
                                "MM/dd/yyyy"
                              ) ?? ""}
                            </Text>
                            <Text fontSize={"14px"} fontWeight={400} h="20px">
                              {formatToAmPm(trip?.last_stop?.[0]?.arrive_by)}
                            </Text>
                          </Box>
                        </Tooltip>
                      </CTableTd>
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
                          <Flex gap="12px">
                            <Text
                              h="20px"
                              fontSize="14px"
                              fontWeight="500"
                              color="#535862"
                              cursor="pointer"
                              _hover={{textDecoration: "underline"}}>
                              ${trip?.total_rates ?? "0"}
                            </Text>
                          </Flex>
                        </Tooltip>
                      </CTableTd>

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
                          <Text>{trip?.created_by?.user_first_name}</Text>
                        </Tooltip>
                      </CTableTd>

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
                          <Flex gap="12px" justifyContent="space-between">
                            <Text
                              h="20px"
                              fontSize="14px"
                              fontWeight="500"
                              color="#535862"
                              cursor="pointer"
                              _hover={{textDecoration: "underline"}}>
                              {trip?.origin?.[0]?.equipment_type ?? "ss"}
                            </Text>

                            <Flex
                              alignItems="center"
                              justifyContent="center"
                              border="1px solid #dcddde"
                              w="24px"
                              h="22px"
                              borderRadius="50%"
                              bg="#fff">
                              {trip?.origin?.[0]
                                ?.equipment_availability?.[0]?.[0] ?? ""}
                            </Flex>
                          </Flex>
                        </Tooltip>
                      </CTableTd>

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
                          <Badge
                            colorScheme={getLoadTypeColor(
                              trip.origin?.[0]?.load_type?.[0] ?? ""
                            )}
                            variant="subtle"
                            px={3}
                            py={1}
                            borderRadius="full"
                            fontSize="12px"
                            fontWeight="500"
                            cursor="pointer"
                            _hover={{opacity: 0.8}}>
                            {trip.origin?.[0]?.load_type?.[0] ?? ""}
                          </Badge>
                        </Tooltip>
                      </CTableTd>
                      <CTableTd px="0">
                        <SimpleTimer
                          timeFromAPI={trip?.timer_expiration || ""}
                        />
                      </CTableTd>

                      <CTableTd>
                        <Flex alignItems="center" gap={"16px"}>
                          <Button
                            p="0"
                            minW="60px"
                            fontSize="14px"
                            fontWeight="600"
                            bg="none"
                            border="none"
                            _hover={{bg: "none"}}
                            isDisabled={
                              loadingTripId === `reject-${trip.guid}` ||
                              loadingTripId === `accept-${trip.guid}`
                            }
                            onClick={() => handleRejectTrip(trip)}>
                            {loadingTripId === `reject-${trip.guid}` ? (
                              <Spinner size="sm" />
                            ) : (
                              "Reject"
                            )}
                          </Button>
                          <Button
                            p="0"
                            minW="60px"
                            fontSize="14px"
                            fontWeight="600"
                            bg="none"
                            border="none"
                            color="#FF5B04"
                            _hover={{bg: "none"}}
                            isDisabled={
                              loadingTripId === `reject-${trip.guid}` ||
                              loadingTripId === `accept-${trip.guid}`
                            }
                            onClick={() => handleAcceptTrip(trip)}>
                            {loadingTripId === `accept-${trip.guid}` ? (
                              <Spinner size="sm" color="#FF5B04" />
                            ) : (
                              "Accept"
                            )}
                          </Button>
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

const TripStatus = ({
  status,
  onExpand = () => {},
  tripId = "",
  rowClick = () => {},
}) => {
  return (
    <Flex
      onClick={(e) => {
        e.stopPropagation();
        onExpand(tripId, e);
      }}
      alignItems="center"
      justifyContent="center"
      flexDirection="row-reverse"
      w="36px"
      gap="4px"
      p="2px 8px"
      borderRadius="100px"
      border="1px solid #B2DDFF"
      cursor="pointer">
      <Text fontSize="12px" fontWeight="500" color="#175CD3">
        {status || 1}
      </Text>
      {status !== 0 && <img src="/img/statusArrow.svg" alt="" />}
    </Flex>
  );
};

const TripProgress = ({total_trips = 0, current_trips = 0}) => {
  const colors = ["#FF5B04", "#00707A", "#003B63"];
  return (
    <Flex alignItems="center" justifyContent="flex-start" gap="6px">
      {Array.from({length: total_trips}).map((_, index) => {
        const isFilled = index < current_trips;
        const color = colors[index % colors.length];

        return (
          <Box
            key={index}
            w="13px"
            h="13px"
            borderRadius="50%"
            bg={isFilled ? color : "#E0E0E0"}
          />
        );
      })}
    </Flex>
  );
};

const TripDriverVerification = ({trip = {}}) => {
  const stop = trip?.stop?.[0];

  return (
    <Flex gap="24px" alignItems="center">
      <Box w="22px" h="22px">
        {stop?.equipment_availability?.[0] === "Required" ? (
          trip?.is_truck_verified ? (
            <img
              src="/img/verifiedFullTruck.svg"
              alt="powerOnly"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <img
              src="/img/unverifiedFullTruck.svg"
              alt="powerOnly"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )
        ) : trip?.is_truck_verified ? (
          <img
            src="/img/verifiedEmptyTruck.svg"
            alt="truck"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <img
            src="/img/unverifiedEmptyTruck.svg"
            alt="truck"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </Box>

      <Flex
        alignItems="center"
        justifyContent="center"
        w="44px"
        h="27px"
        p="5px"
        gap="4px"
        bg={trip?.is_driver_verified ? "#DEFFEE" : "#EDEDED"}
        borderRadius="16px">
        <Box w="17px" h="17px">
          {trip?.driver_type?.[0] === "Team" &&
            (trip?.is_driver_verified ? (
              <img
                src="/img/unverifiedSecondDriver.svg"
                alt="driver"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <img
                src="/img/unvSecondDriver.svg"
                alt="driver"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ))}
        </Box>
        <Box w="17px" h="17px">
          {trip?.is_driver_verified ? (
            <img
              src="/img/driverVerified.svg"
              alt="driver"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <img
              src="/img/unverifiedDriver.svg"
              alt="driver"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ClosedTrips;
