import React, {useEffect, useRef} from "react";
import CarrierElement from "../../components/CarrierElement";
import {Box, Flex, Spinner, Text} from "@chakra-ui/react";
import {useInfiniteQuery} from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import {useSelector} from "react-redux";

const AllCarriers = () => {
  const containerRef = useRef();
  const envId = useSelector((state) => state.auth.environmentId);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["ALL_CARRIERS", brokersId, envId],
    queryFn: ({pageParam = 0}) =>
      tripsService.getList({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "list",
        object_data: {
          broker_id: brokersId,
          own_carriers: false,
          limit: 20,
          offset: pageParam,
        },
        table: "carriers",
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loadedItems = allPages.reduce(
        (sum, page) => sum + (page?.data?.response?.length || 0),
        0
      );
      const hasMore =
        lastPage?.data?.response && lastPage.data.response.length === 20;
      return hasMore ? loadedItems : undefined;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const carriersData =
    data?.pages.flatMap((page) => page?.data?.response || []) || [];

  useEffect(() => {
    const handleScroll = (e) => {
      const container = e.target;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (document.getElementById("carrier")) {
      document.getElementById("carrier").scrollIntoView({behavior: "smooth"});
    }
  }, []);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="calc(100vh - 100px)">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="#fff"
          color="#EF6820"
          size="xl"
        />
      </Flex>
    );
  }

  return carriersData.length > 0 ? (
    <Box
      id="carrier"
      ref={containerRef}
      h="calc(100vh - 155px)"
      overflowY="auto"
      style={{scrollbarWidth: "none"}}
      mt="20px">
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={"20px"}>
        {carriersData.map((carrier) => (
          <CarrierElement
            allCarriers={true}
            key={carrier.guid}
            carrier={carrier}
            refetch={refetch}
          />
        ))}
      </Box>

      {isFetchingNextPage && (
        <Flex justify="center" align="center" py="20px">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="#fff"
            color="#EF6820"
            size="md"
          />
        </Flex>
      )}

      {!hasNextPage && carriersData.length > 0 && (
        <Text textAlign="center" py="20px" color="#6B7280" fontSize="14px">
          No more carriers to load
        </Text>
      )}
    </Box>
  ) : (
    <Flex justify="center" align="center" h="calc(100vh - 100px)">
      <Text fontSize="16px" fontWeight="600" color="#EF6820">
        No carriers found
      </Text>
    </Flex>
  );
};

export default AllCarriers;
