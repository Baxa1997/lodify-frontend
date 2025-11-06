import React from "react";
import {Box, Text, Flex, Badge, Button} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import {
  CTable,
  CTableHead,
  CTableTh,
  CTableBody,
  CTableTd,
} from "@components/tableElements";
import CTableRow from "@components/tableElements/CTableRow";
import tripsService from "@services/tripsService";
import {parseISO, format} from "date-fns";
import {calculateTimeDifference} from "@utils/timeUtils";

const TripRowDetails = ({trip = {}, handleRowClick, isExpanded = true}) => {
  const envId = useSelector((state) => state.auth.environmentId);

  const {
    data: detailedTripData = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["TRIP_DETAILS", trip.guid, envId],
    queryFn: () => {
      return tripsService.getTripById({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "single",
        object_data: {
          trip_id: trip.guid,
        },
        table: "trips_dashboard",
      });
    },
    enabled: !!trip.guid && !!envId && isExpanded,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    select: (res) => res?.data?.response?.[0] || {},
  });

  function formatScheduleDate(isoString) {
    try {
      if (!isoString) return "";

      const date = parseISO(isoString);
      date.setHours(date.getHours() + 5);

      return `${format(date, "dd MMM, HH:mm")}`;
    } catch (error) {
      console.error("Error formatting schedule date:", error);
      return "";
    }
  }

  function getLoadTypeColor(loadType) {
    switch (loadType?.toLowerCase()) {
      case "Dry":
        return "#14B8A6";
      case "Refrigerated":
        return "#F59E0B";
      case "Temperature Controlled":
        return "#1E40AF";
      case "Other":
        return "#6B7280";
      case "Preloaded":
        return "#F59E0B";
      case "Drop":
        return "#1E40AF";
      default:
        return "#6B7280";
    }
  }

  if (!trip) {
    return (
      <Box p="8px 20px" bg="#f8f9fa">
        <Text fontSize="14px" color="#6b7280">
          No trip data available
        </Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box p="8px 20px" bg="#f8f9fa">
        <Text fontSize="14px" color="#6b7280">
          Loading trip details...
        </Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="8px 20px" bg="#f8f9fa">
        <Text fontSize="14px" color="#red.500">
          Error loading trip details: {error?.message || "Unknown error"}
        </Text>
      </Box>
    );
  }

  const tripData = detailedTripData?.data?.response || detailedTripData || trip;

  const getTableHeads = (sectionType) => [
    {
      index: 0,
      label: sectionType === "Pickup" ? "Pick Up" : "Delivery",
      key: sectionType === "Pickup" ? "Pick Up" : "delivery",
    },
    {
      index: 1,
      label: "Equipment",
      key: "equipment",
    },
    {
      index: 2,
      label: "Load Type",
      key: "load_type",
    },
    {
      index: 3,
      label: sectionType === "Pickup" ? "Arrival" : "Arrival",
      key: "schedule",
    },
    {
      index: 4,
      label: "ETA",
      key: "eta",
    },
  ];

  const getMinHeight = () => {
    const baseHeight = 60;
    const rowHeight = 50;
    const minRows = 1;
    const padding = 16;

    return `${baseHeight + minRows * rowHeight + padding}px`;
  };

  const getRowStatusColor = (arriveBy, index, currentIndex) => {
    if (index <= currentIndex) {
      return "#fff";
    } else {
      if (Boolean(arriveBy)) {
        const timeDifference = calculateTimeDifference(arriveBy);
        if (timeDifference > 0) {
          return "#fff";
        } else {
          return "#FEF3F2";
        }
      }
    }
  };

  return (
    <Box bg="#fff" minHeight="200px" position="relative">
      <Box
        pb="0px"
        overflowX="auto"
        sx={{
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c1c1c1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#a8a8a8",
          },
        }}>
        {(tripData?.pickups || []).map((item, index) => (
          <Box
            bg={getRowStatusColor(
              item?.arrive_by,
              index + 1,
              tripData?.current_index
            )}
            p="8px 20px"
            key={item?.guid || index}>
            <CTable
              minHeight={getMinHeight()}
              isPagination={false}
              width="100%"
              overflow="visible"
              borderColor={getRowStatusColor(
                item?.arrive_by,
                index + 1,
                tripData?.current_index
              )}
              borderRadius="8px"
              bg="white">
              <CTableHead borderRadius="8px 8px 0 0">
                <CTableRow>
                  {getTableHeads(item?.type?.[0])?.map((head) => (
                    <CTableTh
                      zIndex={-1}
                      maxW="334px"
                      width="334px"
                      key={head.index}
                      bg={getRowStatusColor(
                        item?.arrive_by,
                        index + 1,
                        tripData?.current_index
                      )}
                      py="6px"
                      px="20px"
                      fontSize="16px"
                      fontWeight="600"
                      color="#181d27"
                      borderColor={
                        calculateTimeDifference(item?.arrive_by) <= 0
                          ? "#FEF3F2"
                          : "#F04438"
                      }>
                      {head.label}
                    </CTableTh>
                  ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow
                  bg={getRowStatusColor(
                    item?.arrive_by,
                    index + 1,
                    tripData?.current_index
                  )}
                  hover={false}>
                  <CTableTd py="12px" px="20px" verticalAlign="top">
                    <Box>
                      <TripStatus status={item?.index} />
                      <Text
                        wordBreak="break-word"
                        whiteSpace="normal"
                        my="8px"
                        fontSize="16px"
                        fontWeight="400"
                        color="#181d27">
                        {`${item?.address}, ${item?.state}, ${item?.zip_code}`}
                      </Text>
                      <Text fontSize="12px" color="#6b7280">
                        {formatScheduleDate(item?.arrive_by)}
                      </Text>
                    </Box>
                  </CTableTd>

                  <CTableTd py="12px" px="20px" verticalAlign="top">
                    <Flex mb={"8px"} fontSize="14px" color="#181d27" gap="8px">
                      <Text color={"#414651"} fontWeight={"500"}>
                        Tractor Unit #
                      </Text>
                      <Text>{trip?.tractors?.plate_number}</Text>
                    </Flex>

                    <Flex mb={"8px"} fontSize="14px" color="#181d27" gap="8px">
                      <Text color={"#414651"} fontWeight={"500"}>
                        Tractor ID
                      </Text>
                      <Text>{trip?.tractors?.external_id}</Text>
                    </Flex>

                    <Flex mb={"8px"} fontSize="14px" color="#181d27" gap="8px">
                      <Text color={"#414651"} fontWeight={"500"}>
                        Trailer Unit
                      </Text>
                      <Text>{trip?.trailers?.plate_number}</Text>
                    </Flex>

                    <Flex mb={"8px"} fontSize="14px" color="#181d27" gap="8px">
                      <Text color={"#414651"} fontWeight={"500"}>
                        Trailer ID
                      </Text>
                      <Text>{trip?.trailers?.external_id}</Text>
                    </Flex>

                    <Flex
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      gap={"8px"}>
                      <Text color={"#414651"} fontWeight={"500"}>
                        {trip?.trailers?.trailer_type?.[0]}
                      </Text>
                      <TripDriverVerification
                        tripData={tripData}
                        trip={trip}
                        pickUpindex={index}
                      />
                    </Flex>
                  </CTableTd>

                  <CTableTd py="12px" px="20px" verticalAlign="top">
                    <Box>
                      <Badge
                        bg={getLoadTypeColor(item?.load_type?.[0])}
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="12px"
                        fontWeight="500">
                        {item?.load_type?.[0] || "N/A"}
                      </Badge>
                    </Box>
                  </CTableTd>

                  <CTableTd py="12px" px="20px" verticalAlign="top">
                    <Box mb="24px">
                      <Text fontSize="12px" color="#181D27">
                        Check in:
                      </Text>
                      <Flex alignItems="center" gap="8px">
                        <Text fontSize="12px" color="#181D27">
                          {formatScheduleDate(item?.check_in)}
                        </Text>
                        {Boolean(item?.check_in) && (
                          <Text
                            fontSize="14px"
                            fontWeight="700"
                            color="#175CD3">
                            M
                          </Text>
                        )}
                      </Flex>
                    </Box>
                    <Box>
                      <Text fontSize="12px" color="#181D27">
                        Check out:
                      </Text>

                      <Flex alignItems="center" gap="8px">
                        <Text fontSize="12px" color="#181D27">
                          {formatScheduleDate(item?.check_out)}
                        </Text>
                        {Boolean(item?.check_out) && (
                          <Text
                            fontSize="14px"
                            fontWeight="700"
                            color="#175CD3">
                            M
                          </Text>
                        )}
                      </Flex>
                    </Box>
                  </CTableTd>

                  <CTableTd py="12px" px="20px" verticalAlign="top">
                    <Box>
                      <Flex alignItems="center" gap="6px">
                        <Text fontSize="14px" color="#181d27">
                          {formatScheduleDate(item?.arrive_by)}
                        </Text>
                        {calculateTimeDifference(item?.arrive_by) <= 0 && (
                          <img src="/img/delayIcon.svg" alt="" />
                        )}
                      </Flex>
                      <Button
                        mt="8px"
                        h="20px"
                        p="0"
                        bg="none"
                        color="#EF6820"
                        borderRadius="8px"
                        fontSize="14px"
                        fontWeight="600"
                        _hover={{bg: "none"}}>
                        Report delay
                      </Button>
                    </Box>
                  </CTableTd>
                </CTableRow>
              </CTableBody>
            </CTable>
          </Box>
        ))}

        {(!tripData?.pickups || tripData?.pickups?.length === 0) && (
          <Box p="20px" textAlign="center">
            <Text fontSize="14px" color="#6b7280">
              No pickup or delivery data available
            </Text>
          </Box>
        )}
      </Box>

      <Box
        position="sticky"
        bottom={0}
        left={0}
        right={0}
        width="100%"
        bg="#fff"
        px="20px"
        py="10px"
        zIndex={10}>
        <Flex
          maxWidth="1275px"
          gap="12px"
          justifyContent="space-between"
          alignItems="center">
          <Button
            bg="#fff"
            color="#EF6820"
            border="1px solid #f7b27a"
            borderRadius="8px"
            fontSize="14px"
            fontWeight="600"
            px="16px"
            py="8px">
            View Shipment Details
          </Button>

          <Flex gap="8px">
            <Button
              h="40px"
              variant="outline"
              leftIcon={
                <img src="/img/collab.svg" alt="" width="16" height="16" />
              }
              fontSize="14px"
              border="1px solid #f2b27a"
              color="#EF6820"
              fontWeight="600">
              Collaboration
            </Button>
            <Button
              _hover={{bg: "#EF6820"}}
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(trip.guid, trip);
              }}
              variant="outline"
              h="40px"
              fontSize="14px"
              fontWeight="600"
              bg="#EF6820"
              color="white">
              More details
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

const TripStatus = ({
  status,
  onExpand = () => {},
  tripId = "",
  rowClick = () => {},
}) => {
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

const TripDriverVerification = ({
  trip = {},
  tripData = {},
  pickUpindex = 0,
}) => {
  const getTruckImage = () => {
    let isVerified = false;

    if (tripData?.current_index > pickUpindex) {
      isVerified = true;
    } else if (tripData?.current_index > pickUpindex) {
      isVerified = true;
    } else {
      isVerified = false;
    }

    const isRequired = trip?.equipment_availability?.[0] === "Required";

    if (isRequired) {
      return isVerified
        ? "/img/verifiedFullTruck.svg"
        : "/img/unverifiedFullTruck.svg";
    } else {
      return isVerified
        ? "/img/verifiedEmptyTruck.svg"
        : "/img/unverifiedEmptyTruck.svg";
    }
  };

  const getDriverVerifiedStatus = () => {
    if (tripData?.current_index === pickUpindex) {
      return trip?.is_driver_verified;
    } else if (tripData?.current_index > pickUpindex) {
      return true;
    } else {
      return false;
    }
  };

  const isDriverVerified = getDriverVerifiedStatus();

  return (
    <Flex gap="24px" alignItems="center">
      <Box w="22px" h="22px">
        <img
          src={getTruckImage()}
          alt="truck"
          style={{width: "100%", height: "100%"}}
        />
      </Box>

      <Flex
        alignItems="center"
        justifyContent="center"
        w="44px"
        h="27px"
        p="5px"
        gap="4px"
        bg={isDriverVerified ? "#DEFFEE" : "#EDEDED"}
        borderRadius="16px">
        <Box w="17px" h="17px">
          {trip?.driver_type?.[0].toLowerCase() === "team" &&
            (isDriverVerified ? (
              <img
                src="/img/unverifiedSecondDriver.svg"
                alt="driver"
                style={{width: "100%", height: "100%"}}
              />
            ) : (
              <img
                src="/img/unvSecondDriver.svg"
                alt="driver"
                style={{width: "100%", height: "100%"}}
              />
            ))}
        </Box>

        <Box w="17px" h="17px">
          <img
            src={
              isDriverVerified
                ? "/img/driverVerified.svg"
                : "/img/unverifiedDriver.svg"
            }
            alt="driver"
            style={{width: "100%", height: "100%"}}
          />
        </Box>
      </Flex>
    </Flex>
  );
};

export default TripRowDetails;
