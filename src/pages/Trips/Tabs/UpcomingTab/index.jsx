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
  Checkbox,
  useToast,
} from "@chakra-ui/react";
import React, {useState, useRef, useTransition} from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
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
import {FiCalendar} from "react-icons/fi";
import TripsFiltersComponent from "../../modules/TripsFiltersComponent";
import {formatDate} from "@utils/dateFormats";
import TripRowDetails from "../../components/TripRowDetails";
import AssignDriver from "./components/AssignDriver";
import AssignCarrier from "./components/AssignCarrier";
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
import {useUpcomingProps} from "./components/useUpcomingProps";
import DeleteConfirmationModal from "@components/DeleteConfirmationModal";
import MultipleCarrierAssignModal from "@components/MultipleCarrierAssignModal";
import { useSort } from "@hooks/useSort";

function UpcomingTab({tripType = "", isActive = true}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {getLoadTypeColor} = useUpcomingProps();

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
  const [isMultipleCarrierAssignModalOpen, setIsMultipleCarrierAssignModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedTrips, setSelectedTrips] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const tableScrollRef = useRef(null);
  const toast = useToast();
  const queryClient = useQueryClient();
  const envId = useSelector((state) => state.auth.environmentId);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const isBroker = Boolean(brokersId);
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );

  const getOrderedColumns = () => {
    const filteredElements = tableElements?.filter((element) =>
      isBroker
        ? element?.key !== "driver" &&
          element?.key !== "driver2" &&
          element?.key !== "tracktor_unit_id" &&
          element?.key !== "trailer_unit_id"
        : element?.key !== "carrier"
    );

    return filteredElements;
  };

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
    startTransition(() => {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    });
  };

  const handleRowClick = (id, trip) => {
    dispatch(sidebarActions.setSidebar(false));
    navigate(`/admin/trips/${id}`, {
      state: {
        label: `${trip?.drivers?.first_name}.${trip?.drivers?.last_name}`,
        tripType: "upcoming",
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

  const columnWidths = {
    "customer.name": "200px",
    "id": "150px",
    "origin.[0].address": "350px",
    "stop.[0].address": "350px",
    "invited_by.legal_name": "240px",
    "carrier.legal_name": "240px",
    "total_miles": "150px",
    "drivers.first_name": '240px',
    "tractors.tractors_plate": '200px',
    "actions": "150px",
  };

  
  const {items: sortedTrips} = useSort(trips, sortConfig);


  const handleSelectTrip = (tripGuid, isChecked) => {
    setSelectedTrips((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(tripGuid);
      } else {
        newSet.delete(tripGuid);
      }
      return newSet;
    });
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allGuids = new Set(trips.map((trip) => trip.guid).filter(Boolean));
      setSelectedTrips(allGuids);
    } else {
      setSelectedTrips(new Set());
    }
  };

  const isAllSelected = trips.length > 0 && trips.every((trip) => selectedTrips.has(trip.guid || trip.id));
  const isIndeterminate = selectedTrips.size > 0 && !isAllSelected;

  const handleDelete = () => {
    if (selectedTrips.size === 0) return;
    setIsDeleteModalOpen(true);
  };


  const handleConfirmDelete = async () => {
    if (selectedTrips.size === 0) return;

    const selectedCount = selectedTrips.size;
    setIsDeleting(true);
    try {
        tripsService.deleteTrips({
         "data": {
          "method": "delete",
          "object_data": {
            "trip_ids": Array.from(selectedTrips),
            "client_type": isBroker ? 'broker' : "carrier"
          },
          "table": "trip"
    }
        })


      queryClient.invalidateQueries({ queryKey: ["UPCOMING_TRIPS"] });

      setSelectedTrips(new Set());
      setIsDeleting(false);
      setIsDeleteModalOpen(false);

      toast({
        title: "Trips Deleted",
        description: `${selectedCount} trip(s) deleted successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setIsDeleting(false);
      toast({
        title: "Error",
        description: "Failed to delete trips. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

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
          onPageSizeChange={handlePageSizeChange}
          paginationRightContent={
            selectedTrips.size > 0 ? (
             <>
              {Boolean(isBroker) && <Button
                colorScheme="blue"
                onClick={() => setIsMultipleCarrierAssignModalOpen(true)}
                h={"32px"}
                p={"8px 14px"}
                borderRadius={"8px"}
                size="sm"
                fontWeight={"600"}>
                Multiple Carrier Assign ({selectedTrips.size})
              </Button>}

              <Button
                colorScheme="red"
                onClick={handleDelete}
                h={"32px"}
                p={"8px 14px"}
                borderRadius={"8px"}
                size="sm"
                fontWeight={"600"}>
                Delete ({selectedTrips.size})
              </Button>
             </>
            ) : null
          }>
          <CTableHead zIndex={8}>
            <Box as={"tr"}>
              <CTableTh
                p='10px'
                zIndex={-1}
                width="50px"
                w="50px"
                maxW="50px"
                minW="50px"
                sortable={false}>
                <Checkbox
                  ml='4px'
                  isChecked={isAllSelected}
                  isIndeterminate={isIndeterminate}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  borderColor="#D5D7DA"
                  sx={{
                    "& .chakra-checkbox__control": {
                      borderColor: "#D5D7DA",
                      _checked: {
                        bg: "#FF5B04",
                        borderColor: "#FF5B04",
                        _hover: {
                          bg: "#FF5B04",
                          borderColor: "#FF5B04",
                        },
                      },
                      _indeterminate: {
                        bg: "#FF5B04",
                        borderColor: "#FF5B04",
                      },
                    },
                  }}
                />
              </CTableTh>
              {getOrderedColumns().map((element) => (
                <CTableTh
                  width={columnWidths[element.sortKey] || "auto"}
                  minW={columnWidths[element.sortKey] || "80px"}
                  maxW={columnWidths[element.sortKey] || "334px"}
                  sortable={element.sortable}
                  sortDirection={
                    sortConfig.sortKey === element.sortKey ? sortConfig.direction : null
                  }
                  key={element.id}
                  onSort={() => handleSort(element.sortKey)}
                  position={
                    (element.key === "carrier" &&
                      isBroker) ||
                    (element.key === "driver" &&
                      !isBroker) ||
                    (element.key === "tracktor_unit_id" &&
                      !isBroker)
                      ?  "sticky"
                      : "static" ||
                      element?.key === 'actions'
                      ? "sticky"
                      : "static"
                  }
                  right={
                    element.key === "carrier" &&
                    isBroker
                      ? "150px"
                      : element.key === "driver" &&
                        !isBroker
                      ? '150px'
                      : element.key === "tracktor_unit_id" &&
                        !isBroker
                      ? '390px'
                      : element?.key === 'actions' ? "0" : "auto"
                  }
                  bg={
                    (element.key === "carrier" &&
                      isBroker) ||
                    (element.key === "driver" &&
                      !isBroker) ||
                    (element.key === "tracktor_unit_id" &&
                      !isBroker)
                      ? "gray.50"
                      : "transparent" || element?.key === 'actions'
                      ? "gray.50"
                      : "transparent"
                  }
                  boxShadow={
                    (element.key === "carrier" &&
                      isBroker) ||
                    (element.key === "driver" &&
                      !isBroker) ||
                    (element.key === "tracktor_unit_id" &&
                      !isBroker)
                    
                      ? "-2px 0 4px rgba(0,0,0,0.05)"
                      : "none"
                  }
                  zIndex={
                    (element.key === "carrier" &&
                      isBroker) ||
                    (element.key === "driver" &&
                      !isBroker ) ||
                    (element.key === "tracktor_unit_id" &&
                      !isBroker
                      ) 
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
                  colSpan={getOrderedColumns().length + 1}
                  textAlign="center"
                  py={8}>
                  <Center minH="400px">
                    <Spinner size="lg" color="#FF5B04" thickness="4px" />
                  </Center>
                </CTableTd>
              </CTableRow>
            ) : sortedTrips.length === 0 ? (
              <CTableRow>
                <CTableTd
                  colSpan={getOrderedColumns().length + 1}
                  textAlign="center"
                  p={0}
                  border="none">
                  <EmptyState
                    icon={FiCalendar}
                    title="No upcoming trips"
                    description="You don't have any upcoming trips scheduled. New trips will appear here."
                  />
                </CTableTd>
              </CTableRow>
            ) : (
              sortedTrips?.map((trip, index) => {
                const isExpanded = expandedRows.has(trip.id || trip.guid);
                const isSelected = selectedTrips.has(trip.guid || trip.id);
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
                      <CTableTd
                        width="50px"
                        minW="50px"
                        maxW="50px"
                        p='10px'
                        onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          ml='6px'
                          isChecked={isSelected}
                          onChange={(e) => handleSelectTrip(trip.guid || trip.id, e.target.checked)}
                          borderColor="#D5D7DA"
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            "& .chakra-checkbox__control": {
                              borderColor: "#D5D7DA",
                              _checked: {
                                bg: "#FF5B04",
                                borderColor: "#FF5B04",
                                _hover: {
                                  bg: "#FF5B04",
                                  borderColor: "#FF5B04",
                                },
                              },
                            },
                          }}
                        />
                      </CTableTd>
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

                      {/* {Boolean(!isBroker) && ( */}
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
                      {/* )} */}


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
                                    {`${trip?.carrier_user?.first_name} ${trip?.carrier_user?.last_name}`}
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="white">
                                    Carrier
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="white">
                                    {trip?.carrier?.legal_name}
                                  </Text>
                                </VStack>
                              </Box>
                            }
                            placement="bottom-start"
                            openDelay={300}>
                            <Flex alignItems="center">
                              <Text>{trip?.carrier?.legal_name ?? ""}</Text>
                            </Flex>
                          </Tooltip>
                        </CTableTd>


                     

                      {Boolean(!isBroker) && (
                        <CTableTd
                          right={'400px'}
                          bg={ "white"}
                          zIndex={5}>
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
                        <Box>
                          <Text fontWeight="600" color="#181D27">
                            {trip?.total_miles?.toFixed(0) || 0} miles
                          </Text>
                        </Box>
                      </CTableTd>

                      {Boolean(!isBroker) && (
                        <CTableTd
                          position={"sticky"}
                          right={'390px'}
                          bg={ "white"}
                          boxShadow={ "-2px 0 4px rgba(0,0,0,0.05)"}
                          zIndex={ 5}>
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
                        <CTableTd
                          position={"sticky"}
                          right={'150px'}
                          bg={ "white"}
                          boxShadow={ "-2px 0 4px rgba(0,0,0,0.05)"}
                          zIndex={ 5}>
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
                        <CTableTd
                          position={ "sticky"}
                          right={"150px"}
                          bg={ "white"}
                          boxShadow={ "-2px 0 4px rgba(0,0,0,0.05)"}
                          zIndex={ 5}>
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

                      <CTableTd width='150px' position="sticky" right="0" bg="white">
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
                      <CTableTd colSpan={getOrderedColumns().length + 1} p={0}>
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Trips"
        message={`Are you sure you want to delete ${selectedTrips.size} trip(s)? This action cannot be undone.`}
        isLoading={isDeleting}
      />


      <MultipleCarrierAssignModal
        keyRefetch={'UPCOMING_TRIPS'}
        isOpen={isMultipleCarrierAssignModalOpen}
        onClose={() => setIsMultipleCarrierAssignModalOpen(false)}
        loading={loading}
        selectedTrips={selectedTrips}
        setSelectedTrips={setSelectedTrips}
        setLoading={setLoading}

      /> 
    </Box>
  );
}

export default UpcomingTab;
