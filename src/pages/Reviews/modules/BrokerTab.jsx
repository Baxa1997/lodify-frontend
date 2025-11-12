import React, {useState, useMemo, useEffect, useRef} from "react";
import {Box, Flex, Spinner, Text} from "@chakra-ui/react";
import {useInfiniteQuery} from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import {useSelector} from "react-redux";
import useDebounce from "@hooks/useDebounce";
import ReviewElement from "./ReviewElement";

const mockData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "1234567890",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "1234567890",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "1234567890",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "1234567890",
  },
];

const BrokerTab = () => {
  const containerRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
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
    queryKey: ["BROKERS", brokersId, envId, searchQuery],
    queryFn: ({pageParam = 0}) =>
      tripsService.getList({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "list",
        object_data: {
          carrier_id: brokersId,
          own_brokers: true,
          limit: 20,
          offset: Boolean(searchQuery) ? 0 : pageParam,
          search: searchQuery,
        },
        table: "brokers",
      }),
    getNextPageParam: (lastPage, allPages) => {
      if (Boolean(searchQuery)) {
        return allPages?.data?.response;
      } else {
        const loadedItems = allPages.reduce(
          (sum, page) => sum + (page?.data?.response?.length || 0),
          0
        );
        const hasMore =
          lastPage?.data?.response && lastPage.data.response.length === 20;
        return hasMore ? loadedItems : undefined;
      }
    },
  });

  const brokersData =
    data?.pages.flatMap((page) => page?.data?.response || []) || [];

  const filteredBrokers = useMemo(() => {
    if (!searchQuery.trim()) return brokersData;

    const query = searchQuery.toLowerCase();
    return brokersData.filter((broker) => {
      const companyName = (
        broker.company_name ||
        broker.legal_name ||
        ""
      ).toLowerCase();
      const email = (broker.email || "").toLowerCase();
      const phone = (broker.phone || "").toLowerCase();

      return (
        companyName.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });
  }, [brokersData, searchQuery]);

  const handleViewBroker = (broker) => {
    console.log("View broker:", broker);
  };

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

  const debouncedSearch = useDebounce((value) => {
    setSearchQuery(value);
  }, 500);

  return (
    <Box>
      <Box
        ref={containerRef}
        h="calc(100vh - 220px)"
        overflowY="auto"
        style={{scrollbarWidth: "none"}}
        mt="20px">
        <>
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap="20px"
            mb="20px">
            {mockData?.map((broker) => (
              <ReviewElement
                key={broker.guid}
                review={broker}
                onView={handleViewBroker}
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
        </>
      </Box>
    </Box>
  );
};

export default BrokerTab;
