import {Box, Center, Flex, Spinner, Text} from "@chakra-ui/react";
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
import React, {useState} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";
import TenderInvitationsFiltersComponent from "../../components/TenderInvitationsFiltersComponent";
import {closedTendersTableElements} from "../../hooks";

function ClosedTenders({tripType = ""}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
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
                  isBroker ? element.key !== "invited_by" : true
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
                return (
                  <React.Fragment key={trip.guid || index}>
                    <CTableRow
                      style={{
                        backgroundColor: "white",
                        cursor: "pointer",
                      }}>
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
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text color="#181D27" cursor="pointer">
                            {trip.reason || ""}
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
