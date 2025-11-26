import {
  Box,
  Flex,
  Text,
  Tooltip,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import SimpleTimer from "@components/SimpleTimer";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableTd,
  CTableTh,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import {formatDate} from "@utils/dateFormats";
import {
  calculateTimeDifference,
  getActionButtonColor,
  getActionButtonText,
} from "@utils/timeUtils";
import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {sidebarActions} from "@store/sidebar";
import {tableActionsNeeded} from "../../hooks";
import {useQuery} from "@tanstack/react-query";
import goReadyTrucksService from "@services/goReadyTrucksService";

function ActiveComponent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");

  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );
  const {data: trucksData, isLoading} = useQuery({
    queryKey: ["ACTIVE_TRUCKS_DATA"],
    queryFn: () => {
      return goReadyTrucksService.getTrucks({
        method: "get",
        object_data: {
          companies_id: companiesId,
        },
        table: "trucks_with_drivers",
      });
    },
    select: (data) => data?.data?.response || [],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const getCustomerInfo = (trip) => {
    return {
      companyName: trip.shipper?.name || "N/A",
      customer:
        trip.shipper?.contact_name || trip.shipper?.customer_name || "N/A",
      trips: trip.shipper?.total_trips || 0,
      rate: trip.shipper?.rating || 0,
    };
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

  const totalPages = trucksData?.length
    ? Math.ceil(trucksData.length / pageSize)
    : 0;
  const trips = trucksData || [];

  return (
    <Box mt={"26px"}>
      <Box mt={6}>
        <CTable
          width="100%"
          height="calc(100vh - 210px)"
          overflow="auto"
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}>
          <CTableHead zIndex={999999}>
            <Box as={"tr"}>
              {tableActionsNeeded.map((element) => (
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
                  colSpan={tableActionsNeeded.length}
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
                  colSpan={tableActionsNeeded.length}
                  textAlign="center"
                  py={8}>
                  No trips found
                </CTableTd>
              </CTableRow>
            ) : (
              trucksData?.map((trip, index) => {
                return (
                  <React.Fragment key={trip.guid || index}>
                    <CTableRow
                      hover={false}
                      // bg={getRowBackgroundColor(
                      //   calculateTimeDifference(trip?.origin?.[0]?.arrive_by)
                      // )}
                    >
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
                            {trip.company?.legal_name || ""}
                          </Text>
                        </Tooltip>
                      </CTableTd>
                      <CTableTd minWidth="180px">
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text
                            color="#181D27"
                            cursor="pointer"
                            _hover={{textDecoration: "underline"}}>
                            {trip.vehicle_number || ""}
                          </Text>
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
                                color="#181D27"
                                cursor="pointer"
                                _hover={{textDecoration: "underline"}}>
                                {trip?.current_location ?? ""}
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
                                color="#181D27"
                                cursor="pointer"
                                _hover={{textDecoration: "underline"}}>
                                {trip?.type?.[0] ?? "Team"}
                              </Text>
                            </Box>
                          </Flex>
                        </Box>
                      </CTableTd>

                      <CTableTd minWidth="180px">
                        <Flex
                          gap="24px"
                          alignItems="center"
                          justifyContent="space-between">
                          <Text
                            color="#181D27"
                            cursor="pointer"
                            _hover={{textDecoration: "underline"}}>
                            {`${trip?.driver?.first_name}  ${trip?.driver?.last_name}` ||
                              ""}
                          </Text>
                        </Flex>
                      </CTableTd>

                      <CTableTd>
                        <SimpleTimer
                          timeFromAPI={
                            trip?.origin?.[0]?.arrive_by ||
                            trip?.stop?.[0]?.arrive_by ||
                            trip?.deadline ||
                            "2025-10-08T12:33:00"
                          }
                          onTimeUp={() => {
                            console.log(`Timer finished for trip ${trip.id}`);
                          }}
                        />
                      </CTableTd>

                      <CTableTd>
                        <Flex alignItems="center" gap={2}>
                          <Text
                            color={getActionButtonColor(
                              calculateTimeDifference(
                                trip?.origin?.[0]?.arrive_by ||
                                  trip?.stop?.[0]?.arrive_by ||
                                  trip?.deadline ||
                                  trip.timer_seconds
                              )
                            )}
                            fontWeight="600">
                            {getActionButtonText(
                              calculateTimeDifference(
                                trip?.origin?.[0]?.arrive_by ||
                                  trip?.stop?.[0]?.arrive_by ||
                                  trip?.deadline ||
                                  trip.timer_seconds
                              )
                            )}
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

export default ActiveComponent;
