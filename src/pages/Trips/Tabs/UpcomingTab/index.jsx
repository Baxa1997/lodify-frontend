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
import TripsFiltersComponent from "../../modules/TripsFiltersComponent";
import {formatDate} from "@utils/dateFormats";
import TripRowDetails from "../../components/TripRowDetails";
import AssignDriver from "./components/AssignDriver";
import AssignCarrier from "./components/AssignCarrier";
import {getLoadTypeColor} from "./hooks";
import {TripProgress} from "../../components/TabsElements";
import {TripDriverVerification} from "./components/FunctionalComponents";
import {ReAssignCarrierButton} from "./components/FunctionalComponents";
import {TripStatus} from "../../components/TabsElements";
import DriverAssignmentMenu from "./components/DriverAssignmentMenu";
import DriverAssignmentModal from "./components/DriverAssignmentModal";
import TractorAssignmentMenu from "./components/TractorAssignmentMenu";
import TractorAssignmentModal from "./components/TractorAssignmentModal";
import TrailerAssignmentMenu from "./components/TrailerAssignmentMenu";
import TrailerAssignmentModal from "./components/TrailerAssignmentModal";

function UpcomingTab({tripType = "", isActive = true}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getOrderedColumns = () => {
    const filteredElements = tableElements?.filter((element) =>
      isBroker
        ? element.key !== "invited_by" &&
          element?.key !== "driver" &&
          element?.key !== "driver2" &&
          element?.key !== "tracktor_unit_id" &&
          element?.key !== "trailer_unit_id"
        : element?.key !== "carrier"
    );

    return filteredElements;
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const [isAssignDriverModalOpen, setIsAssignDriverModalOpen] = useState(false);
  const [isAssignCarrierModalOpen, setIsAssignCarrierModalOpen] =
    useState(false);
  const [isDriverAssignmentModalOpen, setIsDriverAssignmentModalOpen] =
    useState(false);
  const [selectedTripForAssignment, setSelectedTripForAssignment] =
    useState(null);
  const [isTractorAssignmentModalOpen, setIsTractorAssignmentModalOpen] =
    useState(false);
  const [
    selectedTripForTractorAssignment,
    setSelectedTripForTractorAssignment,
  ] = useState(null);
  const [isTrailerAssignmentModalOpen, setIsTrailerAssignmentModalOpen] =
    useState(false);
  const [
    selectedTripForTrailerAssignment,
    setSelectedTripForTrailerAssignment,
  ] = useState(null);

  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  const tableScrollRef = useRef(null);
  const envId = useSelector((state) => state.auth.environmentId);
  const clientType = useSelector((state) => state.auth.clientType);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );

  const {
    data: tripsData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "UPCOMING_TRIPS",
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
          height="calc(100vh - 280px)"
          overflow="scroll"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead zIndex={8}>
            <Box as={"tr"}>
              {getOrderedColumns().map((element) => (
                <CTableTh
                  zIndex={-1}
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
                            bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                            color="white"
                            borderRadius="md"
                            p="6px 10px"
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

                      {Boolean(!isBroker) && (
                        <CTableTd>
                          <TractorAssignmentMenu
                            trip={trip}
                            onAssignClick={(e) => {
                              e.stopPropagation();
                              setSelectedTripForTractorAssignment(trip);
                              setIsTractorAssignmentModalOpen(true);
                            }}
                          />
                        </CTableTd>
                      )}

                      {Boolean(!isBroker) && (
                        <CTableTd>
                          <TrailerAssignmentMenu
                            trip={trip}
                            onAssignClick={(e) => {
                              e.stopPropagation();
                              setSelectedTripForTrailerAssignment(trip);
                              setIsTrailerAssignmentModalOpen(true);
                            }}
                          />
                        </CTableTd>
                      )}

                      <CTableTd>
                        <Flex gap="12px" justifyContent="space-between">
                          <Text
                            h="20px"
                            fontSize="14px"
                            fontWeight="500"
                            color="#535862">
                            {trip?.origin?.[0]?.equipment_type?.label ?? ""}
                          </Text>
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
                        <Box cursor="pointer" _hover={{opacity: 0.8}}>
                          <TripProgress
                            total_trips={trip.total_trips}
                            current_trips={trip.current_trip}
                          />
                        </Box>
                      </CTableTd>

                      {Boolean(!isBroker) && (
                        <CTableTd>
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

                      {Boolean(isBroker) && (
                        <CTableTd>
                          {trip?.carrier?.legal_name ? (
                            <Flex alignItems="center" gap={2}>
                              <Flex alignItems="center" gap={2}>
                                <Text color="#535862" fontWeight="400">
                                  {trip?.carrier?.legal_name}
                                </Text>

                                {isBroker && (
                                  <ReAssignCarrierButton
                                    carrierType="team"
                                    trip={trip}
                                    setSelectedRow={setSelectedRow}
                                    setIsAssignCarrierModalOpen={
                                      setIsAssignCarrierModalOpen
                                    }
                                  />
                                )}
                              </Flex>
                            </Flex>
                          ) : isBroker ? (
                            <Button
                              bg="none"
                              border="none"
                              color="#EF6820"
                              fontWeight="600"
                              px="0"
                              _hover={{bg: "none"}}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsAssignCarrierModalOpen(true);
                                setSelectedRow({
                                  trip: trip,
                                });
                              }}>
                              Assign
                            </Button>
                          ) : (
                            ""
                          )}
                        </CTableTd>
                      )}

                      <CTableTd>
                        <Box>
                          <Text fontWeight="600" color="#181D27">
                            ${trip?.total_rates}
                          </Text>
                          <Text fontWeight={400} color="#535862">
                            {"$2.50/mi"}
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
                        <Collapse
                          position="relative"
                          in={isExpanded}
                          animateOpacity>
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

      <AssignDriver
        trip={selectedRow?.trip}
        isOpen={isAssignDriverModalOpen}
        onClose={() => setIsAssignDriverModalOpen(false)}
        selectedRow={selectedRow}
      />

      <AssignCarrier
        refetchKey="UPCOMING_TRIPS"
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

      <TractorAssignmentModal
        isOpen={isTractorAssignmentModalOpen}
        onClose={() => {
          setIsTractorAssignmentModalOpen(false);
          setSelectedTripForTractorAssignment(null);
        }}
        trip={selectedTripForTractorAssignment}
      />

      <TrailerAssignmentModal
        isOpen={isTrailerAssignmentModalOpen}
        onClose={() => {
          setIsTrailerAssignmentModalOpen(false);
          setSelectedTripForTrailerAssignment(null);
        }}
        trip={selectedTripForTrailerAssignment}
      />
    </Box>
  );
}

export default UpcomingTab;
