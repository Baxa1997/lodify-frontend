import {Box, Flex, Text, Spinner, Center, Collapse} from "@chakra-ui/react";
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
import React, {useState, useRef} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {tableActionsNeeded} from "../../components/mockElements";
import TripsFiltersComponent from "../../modules/TripsFiltersComponent";
import TimeCounter from "@components/TimeCounter";
import TripRowDetails from "../../components/TripRowDetails";

function ActionsNeeded() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
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
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";

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
              trips?.map((trip, index) => {
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
                      <CTableTd>
                        <Text color="#181D27">
                          {trip.customer?.name || trip?.shipper?.name || ""}
                        </Text>
                      </CTableTd>

                      <CTableTd minWidth="180px">
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text color="#181D27">{trip.id || ""}</Text>
                        </Flex>
                      </CTableTd>

                      <CTableTd>
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
                                color="#181D27">
                                {`${trip.origin?.address ?? ""}` || ""}
                              </Text>
                              <Text h="20px">
                                {formatDate(trip?.origin?.arrive_by ?? "")}
                              </Text>
                            </>
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
                              <Text
                                h="20px"
                                fontSize="14px"
                                fontWeight="500"
                                color="#181D27">
                                {`${trip.stop?.address ?? ""}` || ""}
                              </Text>
                              <Text h="20px">
                                {formatDate(trip?.stop?.arrive_by ?? "")}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </CTableTd>

                      <CTableTd>
                        <TimeCounter arriveBy={trip?.stop?.arrive_by} />
                      </CTableTd>

                      <CTableTd>
                        <Text color="#181D27">
                          {trip?.pickup_reason ?? "-"}
                        </Text>
                      </CTableTd>

                      <CTableTd>
                        <Text color="#181D27">
                          {trip?.total_miles?.toFixed(0) ?? "-"} miles
                        </Text>
                      </CTableTd>

                      <CTableTd>
                        <Flex alignItems="center" gap={2}>
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
                              )
                            )}
                          </Text>
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
