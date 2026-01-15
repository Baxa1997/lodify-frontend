import React, {useEffect, useRef} from "react";
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
import {useNavigate} from "react-router-dom";

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
          <Box></Box>

          <Flex gap="8px">
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
  const clientType = useSelector((state) => state.auth.clientType);
  const sidebarOpen = useSelector((state) => state.sidebar.sidebar);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";
  const tripRowDetailsRef = useRef(null);

  const {
    data: detentionNotes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["TRIP_DETAILS", trip.detention_guid, isExpanded],
    queryFn: () => {
      return tripsService.getTripDetailsByTripId("detention_notes", {
        trip_detention_id: trip.detention_guid,
      });
    },
    enabled: !!trip.detention_guid && isExpanded,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    select: (res) => res?.data?.response || [],
  });

  function getLoadTypeColor(loadType) {
    switch (loadType) {
      case "Resolution":
        return "#16A34A";
      case "Request":
        return "#d9ab06";
      case "Dispute":
        return "#DC2626";
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

  const getTableHeads = () => [
    {
      index: 0,
      label: "Amount",
      key: "amount",
    },
    {
      index: 1,
      label: "Status",
      key: "status",
    },
    {
      index: 2,
      label: "Note",
      key: "note",
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
        {(detentionNotes || []).map((item, index) => (
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
                    ?.filter((head) => !isBroker || head.index !== 5)
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
                    <Text fontSize="14px" color="#181d27">
                      {item?.amoun || 0}
                    </Text>
                  </CTableTd>

                  <CTableTd py="12px" px="20px">
                    <Box>
                      <Badge
                        bg={getLoadTypeColor(item?.status?.[0])}
                        color="white"
                        px={3}
                        py={1}
                        borderRadius="full"
                        fontSize="12px"
                        fontWeight="500">
                        {item?.status?.[0] || "N/A"}
                      </Badge>
                    </Box>
                  </CTableTd>

                  <CTableTd py="12px" px="20px">
                    {" "}
                    <Text fontSize="14px" color="#181d27">
                      {item?.note}
                    </Text>
                  </CTableTd>
                </CTableRow>
              </CTableBody>
            </CTable>
          </Box>
        ))}
      </Box>

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

export default TripRowDetails;
