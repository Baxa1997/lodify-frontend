import {Box, Text} from "@chakra-ui/react";
import tripsService from "@services/tripsService";
import {useQuery} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import HFSearchableSelect from "@components/HFSearchableSelect";
import useDebounce from "@hooks/useDebounce";

function AssignTripCarrier({control, name = "carrier"}) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const envId = useSelector((state) => state.auth.environmentId);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);

  const debouncedSetSearch = useDebounce((value) => {
    setDebouncedSearchText(value);
  }, 300);

  useEffect(() => {
    debouncedSetSearch(searchText);
  }, [searchText, debouncedSetSearch]);

  const {data: carriersData, isLoading} = useQuery({
    queryKey: ["CARRIERS_LIST", brokersId],
    queryFn: () =>
      tripsService.getCarriersList({
        environment_id: envId,
        method: "list",
        object_data: {
          broker_id: brokersId,
          own_carriers: true,
          offset: 0,
        },
        table: "carriers",
      }),
    select: (res) =>
      res.data?.response?.map((item) => ({
        label: item?.legal_name,
        value: item?.guid,
      })),
    enabled: !!brokersId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Box w={"100%"}>
        <Text mb={"6px"} fontSize={"14px"} fontWeight={"500"} color={"#414651"}>
          Carrier
        </Text>
        <HFSearchableSelect
          size="md"
          control={control}
          name={name}
          options={carriersData}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </Box>
    </>
  );
}

export default AssignTripCarrier;
