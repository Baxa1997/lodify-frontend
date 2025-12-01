import React, {useState, useEffect, useRef} from "react";
import {
  Box,
  Text,
  Flex,
  Badge,
  Button,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
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
import {useNavigate} from "react-router-dom";
import ReportDelay from "./ReportDelay/ReportDelay";

const calculateExpiredTime = (apiTime) => {
  try {
    if (!apiTime) return 0;

    let targetTime;

    if (typeof apiTime === "string" && apiTime.includes("T")) {
      targetTime = new Date(apiTime);
    } else {
      targetTime = new Date(Date.now() + apiTime * 1000);
    }

    const now = new Date();
    const differenceMs = now.getTime() - targetTime.getTime();
    const differenceSeconds = Math.floor(differenceMs / 1000);

    return Math.max(0, differenceSeconds);
  } catch (error) {
    console.error("Error calculating expired time:", error);
    return 0;
  }
};

const formatExpiredTime = (seconds) => {
  if (seconds === 0) return "0:00 minutes";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")} minutes`;
  }
};

const StickyButtons = ({
  trip,
  handleRowClick,
  navigate,
  tableScrollRef,
  sidebarOpen = true,
  parentContainerRef,
}) => {
  const buttonsRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (
      !buttonsRef.current ||
      !tableScrollRef?.current ||
      !containerRef.current ||
      !parentContainerRef?.current
    )
      return;

    const buttonsEl = buttonsRef.current;
    const scrollEl = tableScrollRef.current;
    const containerEl = containerRef.current;
    const parentEl = parentContainerRef.current;
    let rafId = null;

    let prevLeft = null;
    let prevWidth = null;
    let prevVisibility = null;
    let prevPadding = null;

    const updatePosition = () => {
      if (!buttonsEl || !scrollEl || !containerEl || !parentEl) return;

      const scrollRect = scrollEl.getBoundingClientRect();
      const parentRect = parentEl.getBoundingClientRect();
      const buttonsRect = buttonsEl.getBoundingClientRect();
      const buttonHeight = buttonsRect.height || 60;

      const isParentVisible =
        parentRect.bottom > 0 &&
        parentRect.top < window.innerHeight &&
        parentRect.width > 0;

      if (isParentVisible) {
        const leftOffset = Math.round(scrollRect.left - parentRect.left);
        const width = Math.round(scrollRect.width);

        if (prevLeft !== leftOffset) {
          containerEl.style.left = `${leftOffset}px`;
          prevLeft = leftOffset;
        }

        if (prevWidth !== width) {
          containerEl.style.width = `${width}px`;
          containerEl.style.maxWidth = `${width}px`;
          prevWidth = width;
        }

        if (containerEl.style.position !== "absolute") {
          containerEl.style.position = "absolute";
        }
        if (containerEl.style.bottom !== "0") {
          containerEl.style.bottom = "0";
        }
        if (containerEl.style.zIndex !== "5") {
          containerEl.style.zIndex = "5";
        }

        if (prevVisibility !== true) {
          containerEl.style.visibility = "visible";
          containerEl.style.opacity = "1";
          prevVisibility = true;
        }
      } else {
        if (prevVisibility !== false) {
          containerEl.style.visibility = "hidden";
          containerEl.style.opacity = "0";
          prevVisibility = false;
        }
      }

      const paddingValue = `${buttonHeight}px`;
      if (prevPadding !== paddingValue) {
        scrollEl.style.paddingBottom = paddingValue;

        if (parentEl.style.paddingBottom !== paddingValue) {
          parentEl.style.paddingBottom = paddingValue;
        }
        prevPadding = paddingValue;
      }
    };

    updatePosition();

    const handleScroll = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        updatePosition();
        rafId = null;
      });
    };

    const handleResize = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        updatePosition();
        rafId = null;
      });
    };

    let resizeObserver = null;
    let resizeRafId = null;
    try {
      resizeObserver = new ResizeObserver(() => {
        if (resizeRafId) {
          cancelAnimationFrame(resizeRafId);
        }
        resizeRafId = requestAnimationFrame(() => {
          updatePosition();
          resizeRafId = null;
        });
      });

      if (buttonsEl && resizeObserver) {
        resizeObserver.observe(buttonsEl);
      }
      if (scrollEl && resizeObserver) {
        resizeObserver.observe(scrollEl);
      }
      if (parentEl && resizeObserver) {
        resizeObserver.observe(parentEl);
      }
    } catch (e) {
      resizeObserver = null;
    }

    scrollEl.addEventListener("scroll", handleScroll, {passive: true});
    window.addEventListener("scroll", handleScroll, {passive: true});
    window.addEventListener("resize", handleResize, {passive: true});

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      scrollEl.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleScroll);
      }
      if (scrollEl) {
        scrollEl.style.paddingBottom = "";
      }
      if (parentEl) {
        parentEl.style.paddingBottom = "";
      }
      if (containerEl) {
        containerEl.style.position = "";
        containerEl.style.bottom = "";
        containerEl.style.left = "";
        containerEl.style.width = "";
        containerEl.style.maxWidth = "";
        containerEl.style.zIndex = "";
        containerEl.style.visibility = "";
        containerEl.style.opacity = "";
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (resizeRafId) {
        cancelAnimationFrame(resizeRafId);
      }
    };
  }, [tableScrollRef]);

  return (
    <Box ref={containerRef} bg="#fff">
      <Box
        ref={buttonsRef}
        bg="#fff"
        py="10px"
        borderTop="1px solid #e5e7eb"
        width="100%"
        px="20px">
        <Flex
          maxWidth={sidebarOpen ? "1075px" : "1275px"}
          margin="0 auto"
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
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/collabrations`, {
                  state: {
                    tripId: trip?.guid,
                    tripName: trip?.id,
                    tab: 1,
                  },
                });
              }}
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

const TripRowDetails = ({
  trip = {},
  handleRowClick,
  isExpanded = true,
  tableScrollRef,
  navigate: navigateProp,
}) => {
  const navigateHook = useNavigate();
  const navigate = navigateProp || navigateHook;
  const envId = useSelector((state) => state.auth.environmentId);
  const clientType = useSelector((state) => state.auth.clientType);
  const sidebarOpen = useSelector((state) => state.sidebar.sidebar);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const [isReportDelayOpen, setIsReportDelayOpen] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const tripRowDetailsRef = useRef(null);

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
      const date = parseISO(isoString);
      return `${format(date, "dd MMM, HH:mm")}`;
    } catch (error) {
      return "";
    }
  }

  function formatDateWithTimezone(isoString) {
    try {
      if (!isoString) return "";
      const date = parseISO(isoString);
      return `${format(date, "dd MMM, HH:mm zzz")}`;
    } catch (error) {
      return "";
    }
  }

  function getLoadTypeColor(loadType) {
    switch (loadType) {
      case "Dry":
        return "#FF5B04";
      case "Refrigerated":
        return "#003B63";
      case "Temperature Controlled":
        return "#00707A";
      case "Other":
        return "#6B7280";
      case "Preloaded":
        return "#00707A";
      case "Drop":
        return "#6B7280";
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
    {
      index: 5,
      label: "Driver 1",
      key: "driver",
    },
  ];

  const getMinHeight = () => {
    const baseHeight = 60;
    const rowHeight = 50;
    const minRows = 1;
    const padding = 16;

    return `${baseHeight + minRows * rowHeight + padding}px`;
  };

  return (
    <Box
      ref={tripRowDetailsRef}
      zIndex={5}
      bg="#fff"
      position="relative"
      width="100%">
      <Box
        p="8px 20px"
        pb="0px"
        overflowX="auto"
        overflowY="visible"
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
          <Box key={item?.guid || index} mb={6}>
            <CTable
              zIndex={2}
              minHeight={getMinHeight()}
              isPagination={false}
              width="100%"
              overflow="visible"
              borderColor="#fff"
              borderRadius="8px"
              bg="white">
              <CTableHead zIndex={2} borderRadius="8px 8px 0 0" bg="#fff">
                <CTableRow>
                  {getTableHeads(item?.type?.[0])
                    ?.filter((head) => Boolean(!isBroker) && index !== 5)
                    ?.map((head) => (
                      <CTableTh
                        zIndex={-1}
                        maxW="334px"
                        width="334px"
                        key={head.index}
                        bg="#fff"
                        py="6px"
                        px="20px"
                        fontSize="16px"
                        fontWeight="600"
                        color="#181d27"
                        borderBottom="1px solid #e5e7eb">
                        {head.label}
                      </CTableTh>
                    ))}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow hover={false}>
                  <CTableTd py="12px" px="20px">
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
                      <Text mb="6px" fontSize="12px" color="#6b7280">
                        {formatScheduleDate(item?.arrive_by)}
                      </Text>
                      {item?.type?.[0] === "Pickup" && (
                        <>
                          <Text color="#000" fontWeight="500">
                            PO #{tripData?.reference_po ?? "---"}
                          </Text>
                          <Text color="#000" fontWeight="500">
                            BOL #{item?.bol ?? "---"}
                          </Text>
                        </>
                      )}
                    </Box>
                  </CTableTd>

                  <CTableTd py="12px" px="20px">
                    <Flex mb={"8px"} fontSize="14px" color="#181d27" gap="8px">
                      <Text color={"#414651"} fontWeight={"500"}>
                        Tractor Unit #
                      </Text>
                      <Text>{trip?.tractors?.plate_number ?? "---"}</Text>
                    </Flex>

                    <Flex mb={"8px"} fontSize="14px" color="#181d27" gap="8px">
                      <Text color={"#414651"} fontWeight={"500"}>
                        Tractor ID
                      </Text>
                      <Text>{trip?.tractors?.external_id ?? "---"}</Text>
                    </Flex>

                    <Flex mb={"8px"} fontSize="14px" color="#181d27" gap="8px">
                      <Text color={"#414651"} fontWeight={"500"}>
                        Trailer Unit #
                      </Text>
                      <Text>{trip?.trailers?.plate_number ?? "---"}</Text>
                    </Flex>

                    <Flex mb={"8px"} fontSize="14px" color="#181d27" gap="8px">
                      <Text color={"#414651"} fontWeight={"500"}>
                        Trailer ID
                      </Text>
                      <Text>{trip?.trailers?.external_id ?? "---"}</Text>
                    </Flex>

                    <Flex alignItems={"center"} gap={"16px"}>
                      <Text color={"#414651"} fontWeight={"500"}>
                        {item?.equipment_type?.label || "---"}
                      </Text>
                      <TripDriverVerification
                        tripData={tripData}
                        trip={trip}
                        pickUpindex={index}
                      />
                    </Flex>
                  </CTableTd>

                  <CTableTd py="12px" px="20px">
                    <Box>
                      <Badge
                        bg={getLoadTypeColor(item?.load_type?.label)}
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="12px"
                        fontWeight="500">
                        {item?.load_type?.label || "N/A"}
                      </Badge>
                    </Box>
                  </CTableTd>

                  <CTableTd py="12px" px="20px">
                    <Box mb="24px">
                      <Text fontSize="12px" color="#181D27">
                        Check in:
                      </Text>
                      <Tooltip
                        bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                        color="white"
                        borderRadius="md"
                        p="6px 10px"
                        hasArrow
                        label={
                          <Box minW="180px">
                            <VStack spacing={2} align="start">
                              <Text
                                fontSize="14px"
                                fontWeight="600"
                                color="white">
                                {Boolean(item?.check_in) && ""}
                                {item?.address || "Location"}
                              </Text>
                              <Text
                                fontSize="12px"
                                fontWeight="500"
                                color="white"
                                width="100%">
                                Actuals
                              </Text>
                              <Text
                                fontSize="14px"
                                fontWeight="400"
                                color="white">
                                Facility check-in/out -{" "}
                                {formatDateWithTimezone(item?.check_in) ||
                                  "---"}
                              </Text>
                            </VStack>
                          </Box>
                        }
                        placement="bottom-start"
                        openDelay={300}>
                        <Flex alignItems="center" gap="8px">
                          <Text fontSize="12px" color="#181D27">
                            {Boolean(item?.check_in)
                              ? formatScheduleDate(item?.check_in)
                              : "---"}
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
                      </Tooltip>
                    </Box>
                    <Box>
                      <Text fontSize="12px" color="#181D27">
                        Check out:
                      </Text>
                      <Tooltip
                        bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                        color="white"
                        borderRadius="md"
                        p="6px 10px"
                        hasArrow
                        label={
                          <Box minW="180px">
                            <VStack spacing={2} align="start">
                              <Text
                                fontSize="14px"
                                fontWeight="600"
                                color="white">
                                {Boolean(item?.check_out) && ""}
                                {item?.address || "Location"}
                              </Text>
                              <Text
                                fontSize="12px"
                                fontWeight="500"
                                color="white"
                                width="100%">
                                Actuals
                              </Text>
                              <Text
                                fontSize="14px"
                                fontWeight="400"
                                color="white">
                                Facility check-in/out -{" "}
                                {formatDateWithTimezone(item?.check_out) ||
                                  "---"}
                              </Text>
                            </VStack>
                          </Box>
                        }
                        placement="bottom-start"
                        openDelay={300}>
                        <Flex alignItems="center" gap="8px">
                          <Text fontSize="12px" color="#181D27">
                            {Boolean(item?.check_out)
                              ? formatScheduleDate(item?.check_out)
                              : "---"}
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
                      </Tooltip>
                    </Box>
                  </CTableTd>

                  <CTableTd py="12px" px="20px">
                    {(() => {
                      const expiredTime = calculateExpiredTime(item?.arrive_by);
                      const isExpired = expiredTime > 0;

                      return (
                        <Tooltip
                          bg="linear-gradient(to bottom, #1a365d, #2d3748)"
                          color="white"
                          borderRadius="md"
                          p="6px 10px"
                          hasArrow
                          label={
                            isExpired ? (
                              <Box minW="180px">
                                <VStack spacing={1} align="start">
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="white">
                                    This task has been expired for
                                  </Text>
                                  <Text
                                    fontSize="14px"
                                    fontWeight="600"
                                    color="#FF4444">
                                    {formatExpiredTime(expiredTime)}
                                  </Text>
                                </VStack>
                              </Box>
                            ) : null
                          }
                          placement="bottom-start"
                          openDelay={300}
                          isDisabled={!isExpired}>
                          <Box>
                            <Flex gap="6px">
                              <Text fontSize="14px" color={"#181d27"}>
                                {formatScheduleDate(item?.arrive_by)}
                              </Text>
                              {isExpired && (
                                <img src="/img/delayIcon.svg" alt="" />
                              )}
                            </Flex>
                            {Boolean(!isBroker) && (
                              <Button
                                mt="8px"
                                h="20px"
                                p="0"
                                bg="none"
                                color="#EF6820"
                                borderRadius="8px"
                                fontSize="14px"
                                fontWeight="600"
                                _hover={{bg: "none"}}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPickup(item);
                                  setIsReportDelayOpen(true);
                                }}>
                                Report delay
                              </Button>
                            )}
                          </Box>
                        </Tooltip>
                      );
                    })()}
                  </CTableTd>

                  {Boolean(!isBroker) && (
                    <CTableTd py="12px" px="20px">
                      <Flex>
                        <Text>
                          {item?.drivers_1?.first_name ?? " "}{" "}
                          {item?.drivers_1?.last_name ?? " "}
                        </Text>
                        <Text>
                          {" "}
                          {item?.drivers_2?.first_name ?? " "}{" "}
                          {item?.drivers_2?.last_name ?? " "}
                        </Text>
                      </Flex>
                    </CTableTd>
                  )}
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

      <ReportDelay
        isOpen={isReportDelayOpen}
        onClose={() => {
          setIsReportDelayOpen(false);
          setSelectedPickup(null);
        }}
        trip={trip}
        pickup={selectedPickup}
      />

      <StickyButtons
        trip={trip}
        handleRowClick={handleRowClick}
        navigate={navigate}
        tableScrollRef={tableScrollRef}
        sidebarOpen={sidebarOpen}
        parentContainerRef={tripRowDetailsRef}
      />
    </Box>
  );
};

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

const TripDriverVerification = ({
  trip = {},
  tripData = {},
  pickUpindex = 0,
}) => {
  const getTruckImage = () => {
    let isVerified = false;

    if (tripData?.current_index === pickUpindex) {
      isVerified = trip?.is_truck_verified;
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
    <Flex gap="14px" alignItems="center">
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
