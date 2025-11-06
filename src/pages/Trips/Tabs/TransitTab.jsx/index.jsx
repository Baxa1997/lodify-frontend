import {
  Badge,
  Box,
  Button,
  Collapse,
  Flex,
  Text,
  Tooltip,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {sidebarActions} from "@store/sidebar";
import tripsService from "@services/tripsService";
import tableElements from "../../components/mockElements";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableTd,
  CTableTh,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import TripsFiltersComponent from "../../modules/TripsFiltersComponent";
import {formatDate} from "@utils/dateFormats";
import TripRowDetails from "./TripRowDetails";

function TransitTab({tripType = ""}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const envId = useSelector((state) => state.auth.environmentId);
  const clientType = useSelector((state) => state.auth.clientType);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const userId = useSelector((state) => state.auth.userId);
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );

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
      "TRANSIT_TRIPS",
      currentPage,
      pageSize,
      sortConfig,
      searchTerm,
      tripType,
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
          carriers_id:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? undefined
              : companiesId,
          brokers_id:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? brokersId
              : undefined,
          client_type:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? "broker"
              : "carrier",
          trip_type: tripType,
        },
        table: "trips",
        trip_type: tripType,
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

  const toggleRowExpansion = (tripId, event) => {
    event.stopPropagation();
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tripId)) {
        newSet.delete(tripId);
      } else {
        newSet.add(tripId);
      }
      return newSet;
    });
  };

  const totalPages = tripsData?.total
    ? Math.ceil(tripsData.total / pageSize)
    : 0;
  const trips = tripsData?.data || tripsData || [];
  console.log("tripstrips", trips);
  return (
    <Box mt={"26px"}>
      <TripsFiltersComponent
        filterButton={true}
        actionButton={true}
        actionButtonText="Add Trip"
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
                  <Center minH="400px">
                    <Spinner size="lg" color="#FF5B04" thickness="4px" />
                  </Center>
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
                const isExpanded = expandedRows.has(trip.id || trip.guid);
                return (
                  <React.Fragment key={trip.guid || index}>
                    <CTableRow
                      style={{
                        backgroundColor: "white",
                        cursor: "pointer",
                      }}
                      onClick={(e) =>
                        toggleRowExpansion(trip.id || trip.guid, e)
                      }>
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
                            {trip.customer?.name || ""}
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
                            onExpand={toggleRowExpansion}
                            status={
                              trip?.current_trip === trip?.total_trips
                                ? trip?.current_trip
                                : trip?.current_trip + 1
                            }
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
                            <TripDriverVerification trip={trip} />
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
                          <Text
                            cursor="pointer"
                            _hover={{textDecoration: "underline"}}
                            color="#181D27">
                            {trip?.tractors?.plate_number ?? "---"}
                          </Text>
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
                              h="20px"
                              cursor="pointer"
                              _hover={{textDecoration: "underline"}}
                              color="#181D27">
                              {trip?.trailers?.plate_number ?? "---"}
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
                          <Box cursor="pointer" _hover={{opacity: 0.8}}>
                            <TripProgress
                              total_trips={trip.total_trips}
                              current_trips={trip.current_trip}
                            />
                          </Box>
                        </Tooltip>
                      </CTableTd>
                      <CTableTd>
                        <Flex alignItems="center" gap={2}>
                          {trip?.drivers?.first_name ? (
                            <Text color="#535862" fontWeight="400">
                              {trip?.drivers?.first_name}
                            </Text>
                          ) : (
                            <Button
                              bg="none"
                              border="none"
                              color="#EF6820"
                              fontWeight="600"
                              px="0"
                              _hover={{bg: "none"}}>
                              Assign
                            </Button>
                          )}
                        </Flex>
                      </CTableTd>

                      <CTableTd>
                        <Text>${trip?.total_rates}</Text>
                      </CTableTd>

                      <CTableTd>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/collabrations`, {
                              state: {
                                tripId: trip.guid,
                                tripName: trip.id,
                              },
                            });
                          }}
                          fontSize="14px"
                          bg="none"
                          border="none"
                          color="#EF6820"
                          fontWeight="600"
                          px="0"
                          _hover={{bg: "none"}}>
                          Send Message
                        </Button>
                      </CTableTd>
                    </CTableRow>

                    <CTableRow>
                      <CTableTd colSpan={tableElements.length} p={0}>
                        <Collapse in={isExpanded} animateOpacity>
                          <TripRowDetails
                            handleRowClick={handleRowClick}
                            trip={trip}
                            isExpanded={isExpanded}
                          />
                        </Collapse>
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
          {trip?.driver_type?.[0] === "Team" && (
            <img
              src="/img/unverifiedSecondDriver.svg"
              alt="driver"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </Box>
        <Box w="17px" h="17px">
          <img
            src="/img/driverVerified.svg"
            alt="driver"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default TransitTab;
