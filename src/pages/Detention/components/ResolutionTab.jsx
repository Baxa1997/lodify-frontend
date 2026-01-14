import React, {useState, useRef} from "react";
import DetentionFilter from "./DetentionFilter";
import {useQuery} from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import {useSelector, useDispatch} from "react-redux";
import {sidebarActions} from "@store/sidebar";
import TripRowDetails from "./TripRowDetails";
import {useNavigate} from "react-router-dom";
import {
  Box,
  Text,
  Flex,
  Badge,
  Center,
  Spinner,
  Collapse,
  Checkbox,
} from "@chakra-ui/react";
import {
  CTable,
  CTableHead,
  CTableTh,
  CTableBody,
  CTableTd,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import {EmptyState} from "@components/tableElements/EmptyState";
import {FiCalendar} from "react-icons/fi";
import useDetentionProps from "./useDetentionProps";
import {TripStatus, TripDriverVerification} from "./TableElements";
import {formatDate} from "@utils/dateFormats";
import {TripProgress} from "../../Trips/components/TabsElements";

function ResolutionTab({tabType = "Resolution", isActive = true}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tableScrollRef = useRef(null);
  const {tableElementsRequests, getLoadTypeColor} = useDetentionProps();
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedTrips, setSelectedTrips] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const envId = useSelector((state) => state.auth.environmentId);
  const clientType = useSelector((state) => state.auth.clientType);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );

  const getOrderedColumns = () => {
    return tableElementsRequests;
  };

  const {
    data: tripsData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "DETENTION_RESOLUTION",
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
          offset: (currentPage - 1) * pageSize,
          companies_id:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? brokersId
              : companiesId,
          client_type:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? "broker"
              : "carrier",
          detention_status: tabType,
        },
        table: "detention",
      }),
    select: (data) => data?.data || [],
    enabled: !!envId,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const handleRowClick = (id, trip) => {
    dispatch(sidebarActions.setSidebar(false));
    navigate(`/admin/trips/${id}`, {
      state: {
        label: `${trip?.drivers?.first_name}.${trip?.drivers?.last_name}`,
        tripType: "upcoming",
      },
    });
  };

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

  const handleSelectTrip = (tripId, event) => {
    event.stopPropagation();
    setSelectedTrips((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tripId)) {
        newSet.delete(tripId);
      } else {
        newSet.add(tripId);
      }
      return newSet;
    });
  };

  const handleSelectAllTrips = (event) => {
    if (event.target.checked) {
      const allTripIds = trips.map((trip) => trip.id || trip.guid);
      setSelectedTrips(new Set(allTripIds));
    } else {
      setSelectedTrips(new Set());
    }
  };

  const totalPages = tripsData?.total_count
    ? Math.ceil(tripsData.total_count / pageSize)
    : 0;
  const trips = tripsData?.response || [];
  const allSelected = trips.length > 0 && selectedTrips.size === trips.length;

  return (
    <Box mt={"26px"}>
      <DetentionFilter onSearch={handleSearch} searchValue={searchTerm} />

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
          <CTableHead zIndex={8}>
            <Box as={"tr"}>
              <CTableTh sortable={false} w="50px">
                <Checkbox
                  isChecked={allSelected}
                  isIndeterminate={
                    selectedTrips.size > 0 && selectedTrips.size < trips.length
                  }
                  onChange={handleSelectAllTrips}
                  sx={{
                    "& .chakra-checkbox__control": {
                      borderColor: "#E0E0E0",
                      borderRadius: "6px",
                      borderWidth: "1px",
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
                        _hover: {
                          bg: "#FF5B04",
                          borderColor: "#FF5B04",
                        },
                      },
                      _hover: {
                        borderColor: "#FF5B04",
                      },
                    },
                  }}
                />
              </CTableTh>
              {getOrderedColumns().map((element, idx) => (
                <CTableTh
                  maxW="334px"
                  sortable={element.sortable}
                  sortDirection={
                    sortConfig.key === element.key ? sortConfig.direction : null
                  }
                  key={element.key || idx}
                  onSort={() => handleSort(element.key)}>
                  {element.label}
                </CTableTh>
              ))}
            </Box>
          </CTableHead>

          <CTableBody>
            {isLoading ? (
              <CTableRow>
                <CTableTd
                  colSpan={tableElementsRequests.length + 1}
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
                  colSpan={tableElementsRequests.length + 1}
                  textAlign="center"
                  p={0}
                  border="none">
                  <EmptyState
                    icon={FiCalendar}
                    title="No resolved detentions"
                    description="You don't have any resolved detention requests. Resolved requests will appear here."
                  />
                </CTableTd>
              </CTableRow>
            ) : (
              trips?.map((trip, index) => {
                const isExpanded = expandedRows.has(trip.id || trip.guid);
                const isSelected = selectedTrips.has(trip.id || trip.guid);
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
                      <CTableTd onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          isChecked={isSelected}
                          onChange={(e) =>
                            handleSelectTrip(trip.id || trip.guid, e)
                          }
                          sx={{
                            "& .chakra-checkbox__control": {
                              borderColor: "#E0E0E0",
                              borderRadius: "6px",
                              borderWidth: "1px",
                              _checked: {
                                bg: "#FF5B04",
                                borderColor: "#FF5B04",
                                _hover: {
                                  bg: "#FF5B04",
                                  borderColor: "#FF5B04",
                                },
                              },
                              _hover: {
                                borderColor: "#FF5B04",
                              },
                            },
                          }}
                        />
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
                        <Text color="#181D27">{trip.customer?.name || ""}</Text>
                      </CTableTd>

                      <CTableTd>
                        <Flex
                          alignItems="center"
                          gap="16px"
                          justifyContent="space-between">
                          <Box>
                            <Text
                              fontSize="14px"
                              fontWeight="500"
                              color="#181D27">
                              {trip.origin?.[0]?.address ?? ""}
                            </Text>
                            <Text fontSize="12px" color="#535862">
                              {formatDate(trip?.origin?.[0]?.depart_at ?? "")}
                            </Text>
                          </Box>
                          <TripStatus status={trip?.total_trips} />
                        </Flex>
                      </CTableTd>

                      <CTableTd>
                        <Flex
                          alignItems="center"
                          gap="16px"
                          justifyContent="space-between">
                          <Box>
                            <Text
                              fontSize="14px"
                              fontWeight="500"
                              color="#181D27">
                              {trip.stop?.[0]?.address ?? ""}
                            </Text>
                            <Text fontSize="12px" color="#535862">
                              {formatDate(trip?.stop?.[0]?.arrive_by ?? "")}
                            </Text>
                          </Box>
                          <TripDriverVerification trip={trip} />
                        </Flex>
                      </CTableTd>

                      <CTableTd>
                        <Text color="#181D27">${trip?.total_rates || 0}</Text>
                      </CTableTd>

                      <CTableTd>
                        <Flex gap="12px" alignItems="center">
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
                          <TripProgress
                            total_trips={trip.total_trips}
                            current_trips={trip.current_trip}
                          />
                        </Flex>
                      </CTableTd>

                      <CTableTd>
                        <Text color="#181D27" textDecoration="underline">
                          {trip?.detention_user?.first_name || ""}{" "}
                          {trip?.detention_user?.last_name || ""}
                        </Text>
                      </CTableTd>

                      <CTableTd>
                        <Text color="#181D27">
                          {trip?.total_waited_time || "N/A"}
                        </Text>
                      </CTableTd>

                      <CTableTd>
                        <Flex flexDirection="column">
                          <Text fontWeight="600" color="#181D27">
                            ${trip?.requested_rate || 0}
                          </Text>
                          <Text fontSize="12px" color="#535862">
                            ${trip?.rate_per_mile || 0}/mi
                          </Text>
                        </Flex>
                      </CTableTd>
                    </CTableRow>

                    <CTableRow>
                      <CTableTd
                        colSpan={tableElementsRequests.length + 1}
                        p={0}>
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
    </Box>
  );
}

export default ResolutionTab;
