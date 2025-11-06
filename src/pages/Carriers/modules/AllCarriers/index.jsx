import React from "react";
import CarrierElement from "../../components/CarrierElement";
import {Box, Flex, Spinner, Text} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import {useSelector} from "react-redux";

const AllCarriers = () => {
  const envId = useSelector((state) => state.auth.environmentId);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);

  const {data: carriersData = [], isLoading} = useQuery({
    queryKey: ["ALL_CARRIERS"],
    queryFn: () =>
      tripsService.getList({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "list",
        object_data: {
          broker_id: brokersId,
          own_carriers: false,
        },
        table: "carriers",
      }),
    select: (data) => data?.data?.response || [],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

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
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      mt="30px"
      gap={"20px"}>
      {carriersData.map((carrier) => (
        <CarrierElement
          allCarriers={true}
          key={carrier.guid}
          carrier={carrier}
        />
      ))}
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
