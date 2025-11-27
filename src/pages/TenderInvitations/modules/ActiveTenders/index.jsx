import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableTd,
  CTableTh,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import tripsService from "@services/tripsService";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {formatDate} from "@utils/dateFormats";
import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {sidebarActions} from "@store/sidebar";
import {format} from "date-fns";
import SimpleTimer from "@components/SimpleTimer";
import TenderInvitationsFiltersComponent from "../../components/TenderInvitationsFiltersComponent";
import {tableElements} from "../../hooks";
import AssignCarrier from "../../components/AssignCarrier";
import {BsThreeDotsVertical} from "react-icons/bs";
import {calculateTimeDifference} from "@utils/timeUtils";

function ActiveTenders() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({key: "name", direction: "asc"});
  const [searchTerm, setSearchTerm] = useState("");
  const envId = useSelector((state) => state.auth.environmentId);
  const [loadingTripId, setLoadingTripId] = useState(null);
  const clientType = useSelector((state) => state.auth.clientType);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";

  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );
  const [isAssignCarrierModalOpen, setIsAssignCarrierModalOpen] =
    useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const getLoadTypeColor = (loadType) => {
    const loadTypeColors = {
      Preloaded: "orange",
      Live: "green",
      Drop: "blue",
    };

    return loadTypeColors[loadType?.trim()] || "gray";
  };

  // const getCustomerInfo = (trip) => {
  //   return {
  //     companyName: trip.shipper?.name || "N/A",
  //     customer:
  //       trip.shipper?.contact_name || trip.shipper?.customer_name || "N/A",
  //     trips: trip.shipper?.total_trips || 0,
  //     rate: trip.shipper?.rating || 0,
  //   };
  // };

  const {
    data: tripsData = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [
      "TRIPS_LIST_TENDER_ACTIVE",
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
          limit: 2,
          offset: (currentPage - 1) * pageSize,
          timer_expired: false,
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

  const handleAcceptTrip = (trip) => {
    setLoadingTripId(`accept-${trip.guid}`);
    const data = {
      data: {
        companies_id: companiesId,
        guid: trip?.guid,
      },
    };
    tripsService
      .acceptTrip(data)
      .then((res) => {
        queryClient.invalidateQueries({queryKey: ["TRIPS_LIST_TENDER_ACTIVE"]});
        queryClient.invalidateQueries({queryKey: ["TRIPS_LIST_TENDER_CLOSED"]});
        setLoadingTripId(null);
      })
      .catch((error) => {
        console.error("Error accepting trip:", error);
        setLoadingTripId(null);
      })
      .finally(() => {
        setLoadingTripId(null);
      });
  };

  const handleRejectTrip = (trip) => {
    setLoadingTripId(`reject-${trip.guid}`);
    const computedData = {
      data: {
        companies_id: companiesId,
        orders_id: trip?.guid,
        date_time: new Date().toISOString(),
        brokers_id: trip?.invited_by?.guid,
      },
    };
    tripsService
      .rejectTrip(computedData)
      .then((res) => {
        queryClient.invalidateQueries({queryKey: ["TRIPS_LIST_TENDER_ACTIVE"]});
        queryClient.invalidateQueries({queryKey: ["TRIPS_LIST_TENDER_CLOSED"]});
        setLoadingTripId(null);
      })
      .catch((error) => {
        console.error("Error rejecting trip:", error);
        setLoadingTripId(null);
      })
      .finally(() => {
        setLoadingTripId(null);
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

  const getRowBgColor = (trip) => {
    const tenderTime = calculateTimeDifference(trip?.timer_expiration);

    if (tenderTime === 0 && Boolean(trip?.carrier_2?.legal_name)) {
      return "#ffebeb";
    }
    if (Boolean(!trip?.carrier_2?.legal_name)) {
      return "rgb(241, 250, 255)";
    }
    return "white";
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
              {tableElements
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
                  colSpan={
                    tableElements?.filter((element) =>
                      clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
                        ? element.key !== "actions"
                        : true
                    ).length || tableElements.length
                  }
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
                  colSpan={
                    tableElements?.filter((element) =>
                      clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
                        ? element.key !== "actions"
                        : true
                    ).length || tableElements.length
                  }
                  textAlign="center"
                  py={8}
                  color="red.500">
                  Error loading trips: {error?.message || "Unknown error"}
                </CTableTd>
              </CTableRow>
            ) : trips.length === 0 ? (
              <CTableRow>
                <CTableTd
                  colSpan={
                    tableElements?.filter((element) =>
                      clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
                        ? element.key !== "actions"
                        : true
                    ).length || tableElements.length
                  }
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
                        backgroundColor: getRowBgColor(
                          trip,
                          trip?.timer_expiration
                        ),
                        cursor: "pointer",
                      }}>
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
                          <TripStatus
                            rowClick={handleRowClick}
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
                                color="#181D27"
                                cursor="pointer">
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
                              <>
                                <Text
                                  h="20px"
                                  fontSize="14px"
                                  fontWeight="500"
                                  color="#181D27"
                                  cursor="pointer">
                                  {`${trip.last_stop?.[0]?.address ?? ""} / ${
                                    trip?.last_stop?.[0]?.address_2 ?? ""
                                  }` || ""}
                                </Text>
                                <Text h="20px">
                                  {formatDate(
                                    trip?.last_stop?.[0]?.arrive_by ?? ""
                                  )}
                                </Text>
                              </>
                            </Box>
                          </Flex>
                        </Box>
                      </CTableTd>
                      <CTableTd>
                        <Flex gap="24px" alignItems="center">
                          {" "}
                          <Box>
                            <Text
                              fontSize={"12px"}
                              fontWeight={500}
                              cursor="pointer"
                              color="#181D27">
                              {trip?.origin?.[0]?.arrive_by &&
                                format(
                                  trip?.origin?.[0]?.arrive_by,
                                  "MM/dd/yyyy"
                                )}
                            </Text>
                            <Text fontSize={"14px"} fontWeight={400} h="20px">
                              {formatToAmPm(trip?.origin?.[0]?.arrive_by)}
                            </Text>
                          </Box>
                          <TripDriverVerification trip={trip} />
                        </Flex>
                      </CTableTd>
                      <CTableTd>
                        <Box>
                          <Text
                            fontSize={"12px"}
                            fontWeight={500}
                            cursor="pointer"
                            _hover={{textDecoration: "underline"}}
                            color="#181D27">
                            {trip?.last_stop?.[0]?.arrive_by &&
                              format(
                                trip?.last_stop?.[0]?.arrive_by,
                                "MM/dd/yyyy"
                              )}
                          </Text>
                          <Text fontSize={"14px"} fontWeight={400} h="20px">
                            {formatToAmPm(trip?.last_stop?.[0]?.arrive_by)}
                          </Text>
                        </Box>
                      </CTableTd>
                      <CTableTd>
                        <Flex gap="12px">
                          <Text
                            h="20px"
                            fontSize="14px"
                            fontWeight="500"
                            color="#535862"
                            cursor="pointer"
                            _hover={{textDecoration: "underline"}}>
                            ${trip?.total_rates ?? "0"}
                          </Text>
                        </Flex>
                      </CTableTd>

                      {Boolean(!isBroker) && (
                        <CTableTd>
                          <Tooltip
                            p="6px 10px"
                            bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                            borderRadius="md"
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
                            }>
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
                          </Tooltip>
                        </CTableTd>
                      )}

                      <CTableTd>
                        <Flex gap="12px" justifyContent="space-between">
                          <Text
                            h="20px"
                            fontSize="14px"
                            fontWeight="500"
                            color="#535862">
                            {trip?.origin?.[0]?.equipment_type?.[0]?.label ??
                              ""}
                          </Text>

                          <Flex
                            alignItems="center"
                            justifyContent="center"
                            border="1px solid #dcddde"
                            w="24px"
                            h="22px"
                            borderRadius="50%"
                            bg="#fff">
                            {trip?.origin?.[0]?.equipment_availability?.[0] ??
                              ""}
                          </Flex>
                        </Flex>
                      </CTableTd>

                      <CTableTd>
                        <Badge
                          colorScheme={getLoadTypeColor(
                            trip.origin?.[0]?.load_type?.[0]?.label ?? ""
                          )}
                          variant="subtle"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="12px"
                          fontWeight="500"
                          _hover={{opacity: 0.8}}>
                          {trip.origin?.[0]?.load_type?.[0]?.label ?? ""}
                        </Badge>
                      </CTableTd>

                      {Boolean(isBroker) && (
                        <CTableTd>
                          {trip?.carrier_2?.legal_name ? (
                            <Flex alignItems="center" gap={2}>
                              <Flex alignItems="center" gap={2}>
                                <Text color="#535862" fontWeight="400">
                                  {trip?.carrier_2?.legal_name ?? ""}
                                </Text>

                                {isBroker && (
                                  <ReAssignDriverButton
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

                      <CTableTd px="0">
                        {trip?.carrier_2?.legal_name ? (
                          <SimpleTimer timeFromAPI={trip?.timer_expiration} />
                        ) : (
                          <>
                            <Text
                              fontSize="14px"
                              fontWeight="600"
                              color="#535862">
                              00:00:00
                            </Text>
                          </>
                        )}
                      </CTableTd>

                      <CTableTd>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/collabrations`, {
                              state: {
                                tripId: trip.guid,
                                tripName: trip.id,
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

                      {clientType?.id !==
                        "96ef3734-3778-4f91-a4fb-d8b9ffb17acf" && (
                        <CTableTd>
                          <Flex alignItems="center" gap={"16px"}>
                            <Button
                              p="0"
                              minW="60px"
                              fontSize="14px"
                              fontWeight="600"
                              bg="none"
                              border="none"
                              _hover={{bg: "none"}}
                              isDisabled={
                                loadingTripId === `reject-${trip.guid}` ||
                                loadingTripId === `accept-${trip.guid}`
                              }
                              onClick={() => handleRejectTrip(trip)}>
                              {loadingTripId === `reject-${trip.guid}` ? (
                                <Spinner size="sm" />
                              ) : (
                                "Reject"
                              )}
                            </Button>
                            <Button
                              p="0"
                              minW="60px"
                              fontSize="14px"
                              fontWeight="600"
                              bg="none"
                              border="none"
                              color="#FF5B04"
                              _hover={{bg: "none"}}
                              isDisabled={
                                loadingTripId === `reject-${trip.guid}` ||
                                loadingTripId === `accept-${trip.guid}`
                              }
                              onClick={() => handleAcceptTrip(trip)}>
                              {loadingTripId === `accept-${trip.guid}` ? (
                                <Spinner size="sm" color="#FF5B04" />
                              ) : (
                                "Accept"
                              )}
                            </Button>
                          </Flex>
                        </CTableTd>
                      )}
                    </CTableRow>
                  </React.Fragment>
                );
              })
            )}
          </CTableBody>
        </CTable>
      </Box>

      <AssignCarrier
        selectedRow={selectedRow}
        isOpen={isAssignCarrierModalOpen}
        onClose={() => setIsAssignCarrierModalOpen(false)}
      />
    </Box>
  );
}

const TripStatus = ({status, onExpand = () => {}, tripId = ""}) => {
  return (
    <Flex
      onClick={(e) => {
        e.stopPropagation();
        onExpand(tripId, e);
      }}
      alignItems="center"
      justifyContent="center"
      flexDirection="row-reverse"
      w="36px"
      gap="4px"
      p="2px 8px"
      borderRadius="100px"
      border="1px solid #B2DDFF"
      cursor="pointer">
      <Text fontSize="12px" fontWeight="500" color="#175CD3">
        {status || 1}
      </Text>
      {status !== 0 && <img src="/img/statusArrow.svg" alt="" />}
    </Flex>
  );
};

const ReAssignDriverButton = ({
  carrierType = "solo",
  trip,
  setSelectedRow = () => {},
  setIsAssignCarrierModalOpen = () => {},
}) => {
  return (
    <>
      <Menu>
        <MenuButton
          p="0"
          maxWidth="22px"
          width="22px"
          minWidth="22px"
          height="22px"
          bg="none"
          onClick={(e) => e.stopPropagation()}
          as={Button}>
          <BsThreeDotsVertical style={{width: "22px", height: "14px"}} />
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsAssignCarrierModalOpen(true);
              setSelectedRow({
                trip: trip,
                carrierType: carrierType,
              });
            }}>
            <Text color="#535862" fontWeight="600">
              Re-Assign Carrier
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

const TripDriverVerification = ({trip = {}}) => {
  const stop = trip?.origin?.[0];

  return (
    <Flex gap="24px" alignItems="center">
      <Box w="22px" h="22px">
        {stop?.equipment_availability?.[0] === "Required" ? (
          trip?.is_truck_verified ? (
            <img
              src="/img/verifiedFullTruck.svg"
              alt="powerOnly"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <img
              src="/img/unverifiedFullTruck.svg"
              alt="powerOnly"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )
        ) : trip?.is_truck_verified ? (
          <img
            src="/img/verifiedEmptyTruck.svg"
            alt="truck"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <img
            src="/img/unverifiedEmptyTruck.svg"
            alt="truck"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </Box>

      <Flex
        alignItems="center"
        justifyContent="center"
        w="44px"
        h="27px"
        p="5px"
        gap="4px"
        bg={trip?.is_driver_verified ? "#DEFFEE" : "#EDEDED"}
        borderRadius="16px">
        <Box w="17px" h="17px">
          {trip?.driver_type?.[0] === "Team" &&
            (trip?.is_driver_verified ? (
              <img
                src="/img/unverifiedSecondDriver.svg"
                alt="driver"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <img
                src="/img/unvSecondDriver.svg"
                alt="driver"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ))}
        </Box>
        <Box w="17px" h="17px">
          {trip?.is_driver_verified ? (
            <img
              src="/img/driverVerified.svg"
              alt="driver"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <img
              src="/img/unverifiedDriver.svg"
              alt="driver"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ActiveTenders;
