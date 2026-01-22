import {Box, Flex, Text, Spinner, Center, Collapse, Link} from "@chakra-ui/react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableTd,
  CTableTh,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import {EmptyState} from "@components/tableElements/EmptyState";
import {FiAlertCircle} from "react-icons/fi";
import tripsService from "@services/tripsService";
import {useQuery} from "@tanstack/react-query";
import {formatDate} from "@utils/dateFormats";
import {
  calculateTimeDifference,
  getActionButtonColor,
  getActionButtonText,
  getRowBackgroundColor,
} from "@utils/timeUtils";
import React, {useState, useRef, useTransition} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {tableActionsNeeded} from "../../components/mockElements";
import TripsFiltersComponent from "../../modules/TripsFiltersComponent";
import TimeCounter from "@components/TimeCounter";
import TripRowDetails from "../../components/TripRowDetails";
import checkedPhone from "@hooks/checkedPhone";
import { useSort } from "@hooks/useSort";
import useDebounce from "@hooks/useDebounce";

function ActionsNeeded() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "shipper.name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRow, setSelectedRow] = useState(null);
  const tableScrollRef = useRef(null);
  const envId = useSelector((state) => state.auth.environmentId);
  const clientType = useSelector((state) => state.auth.clientType);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );
  const isBroker = Boolean(brokersId);
  const [isPending, startTransition] = useTransition();

  const {
    data: tripsData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "ACTIONS_NEEDED_TRIPS",
      currentPage,
      pageSize,
      sortConfig,
      searchFilter,
    ],
    queryFn: () =>
      tripsService.getList({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "list",
        object_data: {
          search: searchTerm,
          limit: pageSize,
          filter:{
            generated_id: searchFilter
          },
          offset: (currentPage - 1) * pageSize,
          brokers_id:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? brokersId
              : undefined,
          carriers_id:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? brokersId
              : companiesId,
          client_type:
            clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
              ? "broker"
              : "carrier",
        },
        table: "late_trips",
      }),
    select: (data) => data?.data || [],
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
        key: key,
        direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
      });
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

  const handleRowClick = (tripGuid) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tripGuid)) {
        newSet.delete(tripGuid);
        if (selectedRow === tripGuid) {
          setSelectedRow(null);
        }
      } else {
        newSet.add(tripGuid);
        setSelectedRow(tripGuid);
      }
      return newSet;
    });
  };

  const debouncedSearchFilter = useDebounce((val) => {
    const searchValue = typeof val === "string" ? val : String(val || "");
    setSearchFilter(searchValue);
    setCurrentPage(1);
  }, 500);

const getPhone = (trip) => {
  return isBroker ? checkedPhone(trip?.carrier?.telephone) : checkedPhone(trip?.current_driver_phone || trip?.drivers?.phone);
}


const columnWidths = {
  "shipper.name": "200px",
  "id": "150px",
  "origin.address": "250px",
  "stop.address": "250px",
  "timer": "120px",
  "total_miles": "130px",
  "actions": "150px",
};

const {items: sortedTrips} = useSort(trips, sortConfig);


  return (
    <Box mt={"26px"}>
      <TripsFiltersComponent
        filterButton={true}
        actionButton={true}
        actionButtonText="Add Trip"
        onActionButtonClick={() => navigate("/admin/trips/add-trip")}
        onSearch={debouncedSearchFilter}
        searchValue={searchTerm}
      />

      <Box mt={6}>
        <CTable
          ref={tableScrollRef}
          width="100%"
          height={isBroker ? "calc(100vh - 332px)" : "calc(100vh - 280px)"}
          overflow="auto"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead zIndex={1}>
            <Box as={"tr"}>
              {tableActionsNeeded
                ?.filter((element) => element.key !== "invited_by")
                .map((element) => (
                  <CTableTh
                    zIndex={-1}
                    width={columnWidths[element.key] || "auto"}
                    minW={columnWidths[element.key] || "80px"}
                    maxW={columnWidths[element.key] || "334px"}
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
                  p={0}
                  border="none">
                  <EmptyState
                    icon={FiAlertCircle}
                    title="No trips requiring action"
                    description="All trips are up to date. New trips requiring attention will appear here."
                  />
                </CTableTd>
              </CTableRow>
            ) : (
              sortedTrips?.map((trip, index) => {
                const isExpanded = expandedRows.has(trip.guid);
                return (
                  <React.Fragment key={trip.guid || index}>
                    <CTableRow
                      hover={false}
                      onClick={() => handleRowClick(trip.guid)}
                      style={{cursor: "pointer"}}
                      bg={getRowBackgroundColor(
                        calculateTimeDifference(trip?.origin?.[0]?.arrive_by)
                      )}>
                      <CTableTd 
                        width={columnWidths["shipper.name"]} 
                        minW={columnWidths["shipper.name"]} 
                        maxW={columnWidths["shipper.name"]}
                        overflow="hidden"
                        textOverflow="ellipsis">
                        <Text color="#181D27" noOfLines={1}>
                          {trip.customer?.name || trip?.shipper?.name || ""}
                        </Text>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["id"]} 
                        minW={columnWidths["id"]} 
                        maxW={columnWidths["id"]}
                        overflow="hidden"
                        textOverflow="ellipsis">
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text color="#181D27" noOfLines={1}>{trip.id || ""}</Text>
                        </Flex>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["origin.address"]} 
                        minW={columnWidths["origin.address"]} 
                        maxW={columnWidths["origin.address"]}
                        whiteSpace="normal"
                        overflow="hidden">
                        <Flex
                          alignItems="center"
                          gap="16px"
                          justifyContent="space-between">
                          <Box>
                            <>
                              {" "}
                              <Text
                                h="20px"
                                fontSize="14px"
                                fontWeight="500"
                                color="#181D27"
                                noOfLines={1}>
                                {`${trip.origin?.address ?? ""}` || ""}
                              </Text>
                              <Text h="20px">
                                {formatDate(trip?.origin?.arrive_by ?? "")}
                              </Text>
                            </>
                          </Box>
                        </Flex>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["stop.address"]} 
                        minW={columnWidths["stop.address"]} 
                        maxW={columnWidths["stop.address"]}
                        whiteSpace="normal"
                        overflow="hidden">
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
                                color="#181D27"
                                noOfLines={1}>
                                {`${trip.stop?.address ?? ""}` || ""}
                              </Text>
                              <Text h="20px">
                                {formatDate(trip?.stop?.arrive_by ?? "")}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["timer"]} 
                        minW={columnWidths["timer"]} 
                        maxW={columnWidths["timer"]}
                        overflow="hidden">
                        <TimeCounter arriveBy={trip?.stop?.arrive_by} />
                      </CTableTd>

                      {/* <CTableTd>
                        <Text color="#181D27">
                          {trip?.pickup_reason ?? "-"}
                        </Text>
                      </CTableTd> */}

                      <CTableTd 
                        width={columnWidths["total_miles"]} 
                        minW={columnWidths["total_miles"]} 
                        maxW={columnWidths["total_miles"]}
                        overflow="hidden"
                        textOverflow="ellipsis">
                        <Text color="#181D27">
                          {trip?.total_miles?.toFixed(0) ?? "-"} miles
                        </Text>
                      </CTableTd>

                      <CTableTd 
                        width={columnWidths["actions"]} 
                        minW={columnWidths["actions"]} 
                        maxW={columnWidths["actions"]}
                        overflow="hidden">
                        <Flex onClick={(e) => {
                          e.stopPropagation();
                          
                        }} alignItems="center" gap={2}>
                          <Link href={`tel:${getPhone(trip)}`} target="_blank">
                          <Text
                            color={getActionButtonColor(
                              calculateTimeDifference(
                                trip?.origin?.arrive_by ||
                                  trip?.stop?.arrive_by ||
                                  trip?.deadline ||
                                  trip.timer_seconds
                              )
                            )}
                            fontWeight="600">
                            {getActionButtonText(
                              calculateTimeDifference(
                                trip?.origin?.arrive_by ||
                                  trip?.stop?.arrive_by ||
                                  trip?.deadline ||
                                  trip.timer_seconds
                              ), isBroker
                            )}
                          </Text>
                          </Link>
                        </Flex>
                      </CTableTd>
                    </CTableRow>

                    <CTableRow>
                      <CTableTd colSpan={tableActionsNeeded.length} p={0}>
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

export default ActionsNeeded;
