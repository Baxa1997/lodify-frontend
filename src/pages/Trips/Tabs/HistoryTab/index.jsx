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
import React, {useState, useRef} from "react";
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
import {EmptyState} from "@components/tableElements/EmptyState";
import {FiArchive} from "react-icons/fi";
import {formatDate} from "@utils/dateFormats";
import TripsFiltersComponent from "../../modules/TripsFiltersComponent";
import {
  TripStatus,
  TripProgress,
  TripDriverVerification,
  getLoadTypeColor,
} from "./components/FunctionalComponents";
import TripRowDetails from "../../components/TripRowDetails";

function HistoryTab({tripType = ""}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableScrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const envId = useSelector((state) => state.auth.environmentId);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );
  const isBroker = Boolean(brokersId);

  const {
    data: tripsData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "HISTORY_TRIPS",
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
          offset: (currentPage - 1) * pageSize,
          carriers_id:
            isBroker
              ? undefined
              : companiesId,
          brokers_id:
            isBroker
              ? brokersId
              : undefined,
          client_type:
            isBroker
              ? "broker"
              : "carrier",
          trip_type: tripType,
        },
        table: "trips",
        trip_type: tripType,
      }),
    select: (data) => data?.data || [],
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

  const totalPages = tripsData?.total_count
    ? Math.ceil(tripsData.total_count / pageSize)
    : 0;
  const trips = tripsData?.response || [];

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
          scrollRef={tableScrollRef}
          width="100%"
          height={isBroker ? "calc(100vh - 332px)" : "calc(100vh - 280px)"}
          overflow="scroll"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead zIndex={10}>
            <Box as={"tr"}>
              {tableElements
                ?.filter((element) =>
                  isBroker
                    ? element.key !== "invited_by" &&
                      element?.key !== "driver" &&
                      element?.key !== "driver2"
                    : element?.key !== "carrier"
                )
                .map((element) => (
                  <CTableTh
                    maxW="334px"
                    minW="150px"
                    sortable={element.sortable}
                    sortDirection={
                      sortConfig.key === element.key
                        ? sortConfig.direction
                        : null
                    }
                    key={element.id}
                    onSort={() => handleSort(element.key)}
                    position={
                      (element.key === "carrier" && isBroker) ||
                      (element.key === "driver" && !isBroker) ||
                      element?.key === 'actions'
                        ? "sticky"
                        : "static"
                    }
                    right={
                      (element.key === "carrier" && isBroker) ||
                      (element.key === "driver" && !isBroker)
                        ? "150px"
                        : element?.key === 'actions'
                        ? "0"
                        : "auto"
                    }
                    bg={
                      (element.key === "carrier" && isBroker) ||
                      (element.key === "driver" && !isBroker) ||
                      element?.key === 'actions'
                        ? "gray.50"
                        : "transparent"
                    }
                    boxShadow={
                      (element.key === "carrier" && isBroker) ||
                      (element.key === "driver" && !isBroker) ||
                      element?.key === 'actions'
                        ? "-2px 0 4px rgba(0,0,0,0.05)"
                        : "none"
                    }
                    zIndex={
                      (element.key === "carrier" && isBroker) ||
                      (element.key === "driver" && !isBroker) ||
                      element?.key === 'actions'
                        ? 9
                        : 1
                    }>
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
                  p={0}
                  border="none">
                  <EmptyState
                    icon={FiArchive}
                    title="No trip history"
                    description="You don't have any completed trips yet. Past trips will appear here."
                  />
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
                        <Text color="#181D27">{trip.customer?.name || ""}</Text>
                      </CTableTd>

                      <CTableTd minWidth="120px">
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text color="#181D27">{trip.id || ""}</Text>
                          {/* <TripStatus
                            rowClick={handleRowClick}
                            onExpand={toggleRowExpansion}
                            status={
                              trip?.current_trip === trip?.total_trips
                                ? trip?.current_trip
                                : trip?.current_trip + 1
                            }
                            tripId={trip.id || trip.guid}
                          /> */}
                        </Flex>
                      </CTableTd>

                      <CTableTd>
                        <Box cursor="pointer" _hover={{opacity: 0.8}}>
                          <TripProgress
                            total_trips={trip.total_trips}
                            current_trips={trip.current_trip}
                          />
                        </Box>
                      </CTableTd>

                      <CTableTd>
                        <Flex
                          alignItems="center"
                          gap="16px"
                          justifyContent="space-between">
                          <Box>
                            <>
                              <Text
                                h="20px"
                                fontSize="14px"
                                fontWeight="500"
                                color="#181D27">
                                {`${trip.origin?.[0]?.address ?? ""} / ${
                                  trip?.origin?.[0]?.address_2 ?? ""
                                }` || ""}
                              </Text>
                              <Text h="20px">
                                {formatDate(trip?.origin?.[0]?.depart_at ?? "")}
                              </Text>
                            </>
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
                              <Text
                                h="20px"
                                fontSize="14px"
                                fontWeight="500"
                                color="#181D27">
                                {`${trip.stop?.[0]?.address ?? ""} / ${
                                  trip?.stop?.[0]?.address_2 ?? ""
                                }` || ""}
                              </Text>

                              <Text h="20px">
                                {formatDate(trip?.stop?.[0]?.arrive_by ?? "")}
                              </Text>
                            </Box>
                            <TripDriverVerification trip={trip} />
                          </Flex>
                        </Box>
                      </CTableTd>

                      {Boolean(!isBroker) && (
                        <CTableTd>
                          <Tooltip
                            p={"6px 10px"}
                            bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                            color="white"
                            borderRadius="md"
                            hasArrow
                            label={
                              <Box minW="180px">
                                <VStack spacing={1} align="start">
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="white">
                                    {`${trip?.broker_user?.first_name} ${trip?.broker_user?.last_name}`}
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="white">
                                    Broker
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="white">
                                    {trip?.invited_by?.legal_name}
                                  </Text>
                                </VStack>
                              </Box>
                            }
                            placement="bottom-start"
                            openDelay={300}>
                            <Flex alignItems="center">
                              <Text>{trip?.invited_by?.legal_name ?? ""}</Text>
                            </Flex>
                          </Tooltip>
                        </CTableTd>
                      )}

                      <CTableTd>
                        <Text color="#181D27">
                          {trip?.tractors?.plate_number ?? "---"}
                        </Text>
                      </CTableTd>

                      <CTableTd>
                        <Box>
                          <Text h="20px" color="#181D27">
                            {trip?.trailers?.plate_number ?? "---"}
                          </Text>
                        </Box>
                      </CTableTd>

                      <CTableTd>
                        <Flex gap="12px" justifyContent="space-between">
                          <Text
                            h="20px"
                            fontSize="14px"
                            fontWeight="500"
                            color="#535862">
                            {trip?.origin?.[0]?.equipment_type?.label ?? ""}
                          </Text>

                          {/* <Flex
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid #dcddde"
                            w="24px"
                            h="22px"
                            borderRadius="50%"
                            bg="#fff">
                            {trip?.origin?.[0]?.equipment_availability?.[0] ??
                              ""}
                          </Flex> */}
                        </Flex>
                      </CTableTd>

                      <CTableTd>
                        <Badge
                          color={"#fff"}
                          bg={getLoadTypeColor(
                            trip.origin?.[0]?.load_type?.label ?? ""
                          )}
                          variant="subtle"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="12px"
                          fontWeight="500">
                          {trip.origin?.[0]?.load_type?.label ?? ""}
                        </Badge>
                      </CTableTd>


                      <CTableTd>
                        <Text>${trip?.total_rates}</Text>
                      </CTableTd>

                      <CTableTd>
                        <Box>
                          <Text fontWeight="600" color="#181D27">
                            {trip?.total_miles?.toFixed(0) || 0} miles
                          </Text>
                        </Box>
                      </CTableTd>

                      {Boolean(!isBroker) && (
                        <CTableTd
                          position="sticky"
                          right="150px"
                          bg="white"
                          boxShadow="-2px 0 4px rgba(0,0,0,0.05)"
                          zIndex={8}>
                          <Flex alignItems="center" gap={2}>
                            {trip?.drivers?.first_name ? (
                              <Tooltip
                                bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                                color="white"
                                borderRadius="md"
                                hasArrow
                                p="6px 10px"
                                label={
                                  <Box minW="180px">
                                    <VStack spacing={1} align="start">
                                      <Text
                                        fontSize="14px"
                                        fontWeight="600"
                                        color="white">
                                        {trip?.drivers?.company_name}
                                      </Text>
                                      <Text
                                        fontSize="14px"
                                        fontWeight="600"
                                        color="white">
                                        {`${trip?.drivers?.first_name} ${trip?.drivers?.last_name}`}
                                      </Text>
                                      {trip?.driver_type === "Team" && (
                                        <Text
                                          fontSize="14px"
                                          fontWeight="600"
                                          color="white">
                                          {`${trip?.drivers_2?.first_name} ${trip?.drivers_2?.last_name}`}
                                        </Text>
                                      )}
                                    </VStack>
                                  </Box>
                                }>
                                <Flex flexDirection="column" gap={0}>
                                  <Text color="#535862" fontWeight="400">
                                    {trip?.drivers?.first_name}
                                  </Text>
                                  <Text color="#535862" fontWeight="400">
                                    {trip?.drivers?.last_name}
                                  </Text>
                                </Flex>
                              </Tooltip>
                            ) : (
                              <Button
                                bg="none"
                                border="none"
                                color="#EF6820"
                                fontWeight="600"
                                px="0"
                                _hover={{bg: "none"}}
                                onClick={(e) => e.stopPropagation()}>
                                Assign
                              </Button>
                            )}
                          </Flex>
                        </CTableTd>
                      )}

                      {Boolean(isBroker) && (
                        <CTableTd
                          position="sticky"
                          right="150px"
                          bg="white"
                          boxShadow="-2px 0 4px rgba(0,0,0,0.05)"
                          zIndex={8}>
                          {trip?.carrier?.legal_name && (
                            <Flex alignItems="center" gap={2}>
                              <Flex alignItems="center" gap={2}>
                                <Text color="#535862" fontWeight="400">
                                  {trip?.carrier?.legal_name}
                                </Text>
                              </Flex>
                            </Flex>
                          )}
                        </CTableTd>
                      )}

                      <CTableTd
                        position="sticky"
                        right="0"
                        bg="white"
                        boxShadow="-2px 0 4px rgba(0,0,0,0.05)"
                        zIndex={9}>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/collabrations`, {
                              state: {
                                tripId: trip.guid,
                                tripName: trip.id,
                                tab: 1,
                                broker: trip?.invited_by,
                                carrier: trip?.carrier,
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
                            tableScrollRef={tableScrollRef}
                            navigate={navigate}
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

export default HistoryTab;
