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
import {EmptyState} from "@components/tableElements/EmptyState";
import {FiTruck} from "react-icons/fi";
import TripsFiltersComponent from "../../modules/TripsFiltersComponent";
import {formatDate} from "@utils/dateFormats";
import AssignCarrier from "./components/AssignCarrier";
import {
  TripStatus,
  TripProgress,
  TripDriverVerification,
  getLoadTypeColor,
} from "./components/FunctionalComponent";
import DriverAssignmentMenu from "../UpcomingTab/components/DriverAssignmentMenu";
import DriverAssignmentModal from "../UpcomingTab/components/DriverAssignmentModal";
import TripRowDetails from "../../components/TripRowDetails";

function TransitTab({tripType = "", isActive = true}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [isAssignCarrierModalOpen, setIsAssignCarrierModalOpen] =
    useState(false);
  const [isDriverAssignmentModalOpen, setIsDriverAssignmentModalOpen] =
    useState(false);
  const [selectedTripForAssignment, setSelectedTripForAssignment] =
    useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const envId = useSelector((state) => state.auth.environmentId);
  const clientType = useSelector((state) => state.auth.clientType);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);

  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";

  const {
    data: tripsData = [],
    isLoading,
    error,
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
          offset: (currentPage - 1) * pageSize,
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
    select: (data) => data?.data || [],
    enabled: isActive && !!envId,
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
  const hasUnassignedDriver = trips.some((trip) => !trip?.drivers?.first_name);

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
          height={isBroker ? "calc(100vh - 332px)" : "calc(100vh - 280px)"}
          overflow="auto"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead zIndex={6}>
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
                    sortable={element.sortable}
                    sortDirection={
                      sortConfig.key === element.key
                        ? sortConfig.direction
                        : null
                    }
                    key={element.id}
                    onSort={() => handleSort(element.key)}
                    position={
                      element.key === "driver" &&
                      !isBroker &&
                      hasUnassignedDriver
                        ? "sticky"
                        : "static"
                    }
                    right={
                      element.key === "driver" &&
                      !isBroker &&
                      hasUnassignedDriver
                        ? "0"
                        : "auto"
                    }
                    bg={
                      element.key === "driver" &&
                      !isBroker &&
                      hasUnassignedDriver
                        ? "gray.50"
                        : "transparent"
                    }
                    boxShadow={
                      element.key === "driver" &&
                      !isBroker &&
                      hasUnassignedDriver
                        ? "-2px 0 4px rgba(0,0,0,0.05)"
                        : "none"
                    }
                    zIndex={
                      element.key === "driver" &&
                      !isBroker &&
                      hasUnassignedDriver
                        ? 9
                        : -1
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
                    icon={FiTruck}
                    title="No trips in transit"
                    description="You don't have any trips currently in transit. Active trips will appear here."
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

                      <CTableTd minWidth="180px">
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text color="#181D27">{trip.id || ""}</Text>

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
                            p="6px 10px"
                            borderRadius="md"
                            bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                            label={
                              <Box color="white" minW="180px">
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

                          <Flex
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid #dcddde"
                            w="24px"
                            h="22px"
                            borderRadius="50%"
                            bg="#fff">
                            {trip?.origin?.[0]?.equipment_availability?.label ??
                              ""}
                          </Flex>
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
                        <Box _hover={{opacity: 0.8}}>
                          <TripProgress
                            total_trips={trip.total_trips}
                            current_trips={trip.current_trip}
                          />
                        </Box>
                      </CTableTd>

                      {Boolean(!isBroker) && (
                        <CTableTd
                          position={hasUnassignedDriver ? "sticky" : "static"}
                          right={hasUnassignedDriver ? "0" : "auto"}
                          bg={hasUnassignedDriver ? "white" : "transparent"}
                          boxShadow={
                            hasUnassignedDriver
                              ? "-2px 0 4px rgba(0,0,0,0.05)"
                              : "none"
                          }
                          zIndex={hasUnassignedDriver ? 5 : "auto"}>
                          <DriverAssignmentMenu
                            trip={trip}
                            onAssignClick={(e) => {
                              e.stopPropagation();
                              setSelectedTripForAssignment(trip);
                              setIsDriverAssignmentModalOpen(true);
                            }}
                          />
                        </CTableTd>
                      )}

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

                      <CTableTd>
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

      <AssignCarrier
        refetchKey="TRANSIT_TRIPS"
        selectedRow={selectedRow}
        isOpen={isAssignCarrierModalOpen}
        onClose={() => setIsAssignCarrierModalOpen(false)}
      />

      <DriverAssignmentModal
        isOpen={isDriverAssignmentModalOpen}
        onClose={() => {
          setIsDriverAssignmentModalOpen(false);
          setSelectedTripForAssignment(null);
        }}
        trip={selectedTripForAssignment}
      />
    </Box>
  );
}

export default TransitTab;
