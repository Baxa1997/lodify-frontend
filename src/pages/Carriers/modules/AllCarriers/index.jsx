import React, {useEffect, useRef, useState, useMemo} from "react";
import {
  Box,
  Flex,
  Spinner,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Icon,
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {StarIcon, SearchIcon} from "@chakra-ui/icons";
import {useInfiniteQuery} from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import carrierService from "@services/carrierService";
import {useSelector} from "react-redux";

const tableElements = [
  {label: "Company Name", key: "500px"},
  {label: "Email", key: "250px"},
  {label: "Phone", key: "250px"},
  {label: "Rating", key: "150px"},
  {label: "Action", key: "150px"},
];

const AllCarriers = () => {
  const containerRef = useRef();
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingCarrierId, setLoadingCarrierId] = useState(null);
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

  // Filter carriers based on search query
  const filteredCarriers = useMemo(() => {
    if (!searchQuery.trim()) return carriersData;

    const query = searchQuery.toLowerCase();
    return carriersData.filter((carrier) => {
      const companyName = (
        carrier.company_name ||
        carrier.legal_name ||
        ""
      ).toLowerCase();
      const email = (carrier.email || "").toLowerCase();
      const phone = (carrier.phone || "").toLowerCase();

      return (
        companyName.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });
  }, [carriersData, searchQuery]);

  const handleAddCarrier = (carrier) => {
    setLoadingCarrierId(carrier?.guid);
    const data = {
      joined_at: new Date().toISOString(),
      brokers_id: brokersId,
      companies_id: carrier?.guid,
    };
    carrierService
      .addCarrier(data)
      .then(() => {
        refetch();
        toast({
          title: "Carrier Added Successfully!",
          description: "The carrier has been added to your list",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      })
      .catch((error) => {
        console.log("error", error);
        toast({
          title: "Failed to Add Carrier",
          description: error?.response?.data?.message || "Please try again",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      })
      .finally(() => {
        setLoadingCarrierId(null);
      });
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
    <Box>
      <Box mt="20px" mb="16px">
        <InputGroup maxW="400px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="#94A3B8" />
          </InputLeftElement>
          <Input
            placeholder="Search by company, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            bg="white"
            border="1px solid #E2E8F0"
            borderRadius="8px"
            _focus={{
              borderColor: "#EF6820",
              boxShadow: "0 0 0 1px #EF6820",
            }}
            _hover={{
              borderColor: "#CBD5E0",
            }}
          />
        </InputGroup>
      </Box>

      <Box
        id="carrier"
        ref={containerRef}
        h="calc(100vh - 220px)"
        overflowY="auto"
        style={{scrollbarWidth: "none"}}
        border="1px solid #E2E8F0"
        borderRadius="12px">
        <Table variant="simple" bg="white" borderRadius="12px">
        <Thead
          bg="#FFFFFF"
          position="sticky"
          top="-1px"
          zIndex="10"
          boxShadow="0 2px 4px rgba(0, 0, 0, 0.08)">
          <Tr>
            {tableElements.map((element) => (
              <Th
                key={element}
                width={element?.key}
                color="#1E293B"
                fontSize="14px"
                textTransform="capitalize"
                fontWeight="600"
                borderBottom="none"
                py="16px">
                {element?.label}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {filteredCarriers.length > 0 ? (
            filteredCarriers.map((carrier) => (
              <Tr
                key={carrier.guid}
                _hover={{bg: "#F9FAFB"}}
                borderBottom="1px solid #E5E7EB"
                _last={{borderBottom: "none"}}>
                <Td py="14px" borderBottom="none">
                  <Text fontSize="14px" fontWeight="600" color="#181D27">
                    {carrier.company_name || carrier.legal_name || "N/A"}
                  </Text>
                </Td>
                <Td py="14px" borderBottom="none">
                  <Text fontSize="14px" color="#535862">
                    {carrier.email || "N/A"}
                  </Text>
                </Td>
                <Td py="14px" borderBottom="none">
                  <Text fontSize="14px" color="#535862">
                    {carrier.phone || "N/A"}
                  </Text>
                </Td>
                <Td py="14px" borderBottom="none">
                  <HStack spacing={1}>
                    <Text fontSize="14px" fontWeight="600" color="#181D27">
                      {carrier.rating ?? "5.0"}
                    </Text>
                    <Icon as={StarIcon} w="14px" h="14px" color="gold" />
                  </HStack>
                </Td>
                <Td textAlign="left" py="14px" borderBottom="none">
                  <Button
                    size="sm"
                    color="#EF6820"
                    variant="ghost"
                    fontWeight="500"
                    isDisabled={loadingCarrierId === carrier.guid}
                    isLoading={loadingCarrierId === carrier.guid}
                    loadingText="Adding..."
                    _hover={{bg: "#FEF3EE"}}
                    onClick={() => handleAddCarrier(carrier)}>
                    Add
                  </Button>
                </Td>
              </Tr>
            ))
          ) : (
            <Tr>
              <Td colSpan={5} textAlign="center" py="40px">
                <Text fontSize="14px" color="#94A3B8">
                  No carriers match your search
                </Text>
              </Td>
            </Tr>
          )}
        </Tbody>
      </Table>

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
