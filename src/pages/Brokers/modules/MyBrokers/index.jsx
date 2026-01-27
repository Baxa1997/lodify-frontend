import React, {useState, useMemo, useEffect, useRef} from "react";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Button,
  HStack,
  Icon,
  Badge,
  VStack,
} from "@chakra-ui/react";
import {StarIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {useInfiniteQuery} from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import {useSelector} from "react-redux";
import useDebounce from "@hooks/useDebounce";
import SearchInput from "@components/SearchInput";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";

const MyBrokers = () => {
  const navigate = useNavigate();
  const containerRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const envId = useSelector((state) => state.auth.environmentId);
  const carriersId = useSelector(
    (state) => state.auth?.user_data?.companies_id
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["MY_BROKERS", carriersId, envId, searchQuery],
    queryFn: ({pageParam = 0}) =>
      tripsService.getList({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "list",
        object_data: {
          carrier_id: carriersId,
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
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const carriersData =
    data?.pages.flatMap((page) => page?.data?.response || []) || [];

  const filteredCarriers = useMemo(() => {
    return carriersData;
  }, [carriersData]);

  const handleViewBroker = (broker) => {
    navigate(`/admin/company?id=${broker.guid}`);
  };

  const getCompanyInitials = (name) => {
    if (!name) return "B";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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

  useEffect(() => {
    if (document.getElementById("my-carrier")) {
      document
        .getElementById("my-carrier")
        .scrollIntoView({behavior: "smooth"});
    }
  }, []);

  const debouncedSearch = useDebounce((value) => {
    setSearchQuery(value);
  }, 500);

  return (
    <Box>
      <Box mt="20px" mb="16px">
        <SearchInput bg="#fff" color="#000" onSearch={debouncedSearch} />
      </Box>

      <Box
        id="my-carrier"
        ref={containerRef}
        h="calc(100vh - 220px)"
        overflowY="auto"
        style={{scrollbarWidth: "none"}}>
        {isLoading ? (
          <Flex justify="center" align="center" h="400px">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="#fff"
              color="#ff5b04"
              size="lg"
            />
          </Flex>
        ) : filteredCarriers.length > 0 ? (
          <Box
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap="24px"
            width="100%">
            {filteredCarriers.map((broker) => {
              const companyName =
                broker.company_name || broker.legal_name || "N/A";
              const rating = broker.rating ?? "5.0";
              const email = broker.email || "";
              const connectedDate = broker.connected_date
                ? format(new Date(broker.connected_date), "MM/dd/yyyy")
                : format(new Date(), "MM/dd/yyyy");

              return (
                <Box
                  key={broker.guid}
                  w="100%"
                  h="100%"
                  minH="240px"
                  bg="white"
                  borderRadius="12px"
                  border="1px solid #E2E8F0"
                  boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
                  display="flex"
                  flexDirection="column"
                  transition="all 0.2s">
                  <Flex
                    p="20px 20px 0"
                    justify="space-between"
                    align="flex-start"
                    mb="14px">
                    <Box
                      w="48px"
                      h="48px"
                      borderRadius="8px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      border="1px solid #E2E8F0">
                      <Text fontSize="18px" fontWeight="700" color="#181D27">
                        {getCompanyInitials(companyName)}
                      </Text>
                    </Box>
                    <VStack align="flex-end" spacing="8px">
                      <Badge
                        bg="#10B981"
                        color="white"
                        px="12px"
                        py="4px"
                        borderRadius="16px"
                        fontSize="12px"
                        fontWeight="500">
                        Access Enabled
                      </Badge>
                      <HStack spacing="4px">
                        <Text fontSize="14px" fontWeight="600" color="#181D27">
                          {rating}
                        </Text>
                        <HStack spacing="2px">
                          {[...Array(5)].map((_, i) => (
                            <Icon
                              key={i}
                              as={StarIcon}
                              w="14px"
                              h="14px"
                              color="gold"
                              fill="currentColor"
                            />
                          ))}
                        </HStack>
                      </HStack>
                    </VStack>
                  </Flex>

                  <Box flex="1" display="flex" flexDirection="column">
                    <Text
                      px="20px"
                      fontSize="16px"
                      fontWeight="600"
                      color="#181D27"
                      mb="8px"
                      noOfLines={2}>
                      {companyName}
                    </Text>

                    <Text
                      px="20px"
                      fontSize="14px"
                      fontWeight="400"
                      color="#535862">
                      Phone: {broker.phone || "N/A"}
                    </Text>

                    <Text
                      px="20px"
                      fontSize="14px"
                      fontWeight="400"
                      color="#535862"
                      minH="24px">
                      Address: {broker.physical_address || "N/A"}
                    </Text>

                    <Text
                      px="20px"
                      fontSize="14px"
                      fontWeight="400"
                      color="#535862"
                      mb="8px">
                      Connected {connectedDate}
                    </Text>

                    <HStack px="20px" spacing="6px" mb="12px">
                      <Text fontSize="14px" color="#EF6820" fontWeight="500">
                        {email || "N/A"}
                      </Text>
                      {email && (
                        <Icon
                          as={ExternalLinkIcon}
                          w="14px"
                          h="14px"
                          color="#EF6820"
                        />
                      )}
                    </HStack>
                  </Box>

                  <Flex
                    p="10px 24px"
                    borderTop="1px solid #E2E8F0"
                    justify="flex-end"
                    mt="auto">
                    <Button
                      size="sm"
                      color="#EF6820"
                      variant="ghost"
                      fontWeight="700"
                      fontSize="14px"
                      _hover={{bg: "#FEF3EE"}}
                      onClick={() => handleViewBroker(broker)}>
                      View
                    </Button>
                  </Flex>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Flex
            justify="center"
            align="center"
            h="400px"
            color="#6B7280"
            fontSize="16px">
            No brokers found
          </Flex>
        )}

        {isFetchingNextPage && (
          <Flex justify="center" align="center" py="20px">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="#fff"
              color="#ff5b04"
              size="md"
            />
          </Flex>
        )}

        {/* {!hasNextPage && carriersData.length > 0 && (
          <Text textAlign="center" py="20px" color="#6B7280" fontSize="14px">
            No more carriers to load
          </Text>
        )} */}
      </Box>
    </Box>
  );
};

export default MyBrokers;
