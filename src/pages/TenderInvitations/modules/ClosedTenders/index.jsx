import {Box, Button, Center, Collapse, Flex, Spinner, Text} from "@chakra-ui/react";
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
import React, {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";
import TenderInvitationsFiltersComponent from "../../components/TenderInvitationsFiltersComponent";
import {closedTendersTableElements} from "../../hooks";
import TripRowDetails from "../../components/TripRowDetails";
import { sidebarActions } from "@store/sidebar";

function ClosedTenders({tripType = ""}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableScrollRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const envId = useSelector((state) => state.auth.environmentId);
  const clientType = useSelector((state) => state.auth.clientType);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted":
        return "#17B26A";
      case "Declined":
        return "#F04438";
      default:
        return "#17B26A";
    }
  };

  const {
    data: tripsData = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [
      "TRIPS_LIST_TENDER_CLOSED",
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
          timer_expired: true,
          trip_type: "tender",
        },
        table: "trips",
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

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  const totalPages = tripsData?.total_count
    ? Math.ceil(tripsData.total_count / pageSize)
    : 0;
  const trips = tripsData?.response || [];

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

  const handleRowClick = (id, trip) => {
    setIsExpanded(!isExpanded);
    dispatch(sidebarActions.setSidebar(false));
    navigate(`/admin/trips/${id}`, {
      state: {
        label: `${trip?.drivers?.first_name}.${trip?.drivers?.last_name}`,
      },
    });
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
    return (
    <Box mt={"26px"}>
      <TenderInvitationsFiltersComponent
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
          <CTableHead zIndex={9}>
            <Box as={"tr"}>
              {closedTendersTableElements
                ?.filter((element) =>
                  isBroker
                ? element.key !== "actions" && element.key !== "invited_by"
                : element.key !== "carrier"
                )
                .map((element) => (
                  <CTableTh
                    zIndex={8}
                    maxW="334px"
                    sortable={element.sortable}
                    sortDirection={
                      sortConfig.key === element.key
                        ? sortConfig.direction
                        : null
                    }
                    key={element.id}
                    onSort={() => handleSort(element.key)}>
                    {element.name}
                  </CTableTh>
                ))}
            </Box>
          </CTableHead>

          <CTableBody>
            {isLoading || isFetching ? (
              <CTableRow>
                <CTableTd
                  colSpan={closedTendersTableElements.length}
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
                  colSpan={closedTendersTableElements.length}
                  textAlign="center"
                  py={8}
                  color="red.500">
                  Error loading trips: {error?.message || "Unknown error"}
                </CTableTd>
              </CTableRow>
            ) : trips.length === 0 ? (
              <CTableRow>
                <CTableTd
                  colSpan={closedTendersTableElements.length}
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
                      onClick={(e) =>
                        toggleRowExpansion(trip.id || trip.guid, e)
                      }
                      style={{
                        backgroundColor: "white",
                        cursor: "pointer",
                      }}
                      hover={false}>
                      <CTableTd>
                        <Flex
                          w="80px"
                          alignItems="center"
                          justifyContent="center"
                          bg={getStatusColor(trip.tender_status ?? "Accepted")}
                          color="white"
                          px="10px"
                          py="4px"
                          borderRadius="100px">
                          {trip.tender_status ?? "Accepted"}
                        </Flex>
                      </CTableTd>

                      <CTableTd>
                        <Text color="#181D27">
                          {trip.customer?.name || trip?.shipper?.name || ""}
                        </Text>
                      </CTableTd>

                      {Boolean(!isBroker) && (
                        <CTableTd>
                    
                            <Flex gap="12px">
                              <Text
                                h="20px"
                                fontSize="14px"
                                fontWeight="500"
                                color="#535862"
                                cursor="pointer"
                                _hover={{textDecoration: "underline"}}>
                                {trip?.invited_by?.legal_name ?? ""}
                              </Text>
                            </Flex>
                        </CTableTd>
                      )}

                      {Boolean(isBroker) && (
                        <CTableTd>
                          {trip?.carrier_2?.legal_name ? (
                            <Flex alignItems="center" gap={2}>
                              <Flex alignItems="center" gap={2}>
                                <Text color="#535862" fontWeight="400">
                                  {trip?.carrier_2?.legal_name ?? ""}
                                </Text>

                        
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

                      <CTableTd minWidth="180px">
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text color="#181D27" cursor="pointer">
                            {trip.id || ""}
                          </Text>
                        </Flex>
                      </CTableTd>

                   

                      <CTableTd minWidth="180px">
                        <Flex gap="12px" alignItems="center">
                          <Text
                            fontSize={"12px"}
                            fontWeight={500}
                            color="#181D27">
                            {trip?.origin?.[0]?.arrive_by &&
                              format(
                                trip?.origin?.[0]?.arrive_by,
                                "MM/dd/yyyy"
                              )}
                          </Text>
                          <Text
                            fontSize={"14px"}
                            color="#181D27"
                            fontWeight={400}
                            h="20px">
                            {formatToAmPm(trip?.origin?.[0]?.arrive_by)}
                          </Text>
                        </Flex>
                      </CTableTd>
                    </CTableRow>
                    <CTableRow>
                      <CTableTd
                        colSpan={
                          closedTendersTableElements?.filter((element) =>
                            isBroker
                              ? element.key !== "actions"
                              : element.key !== "carrier"
                          ).length || closedTendersTableElements.length
                        }
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

export default ClosedTenders;
