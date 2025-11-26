import React from "react";
import {Box} from "@chakra-ui/react";
import FiltersComponent from "../../components/FiltersComponent";
import GoogleMapComponent from "./GoogleMapComponent";
import {useSelector} from "react-redux";
import {useQuery} from "@tanstack/react-query";
import goReadyTrucksService from "@services/goReadyTrucksService";

const MapComponent = () => {
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );
  const {data: trucksData, isLoading} = useQuery({
    queryKey: ["MAP_TRUCKS_DATA"],
    queryFn: () => {
      return goReadyTrucksService.getTrucks({
        method: "get",
        object_data: {
          companies_id: companiesId,
        },
        table: "trucks_with_drivers",
      });
    },
    select: (data) => data?.data?.response || [],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return (
    <Box>
      <FiltersComponent
        onSearchChange={() => {}}
        onActionButtonClick={() => {}}
      />

      <GoogleMapComponent trucksData={trucksData} isLoading={isLoading} />
    </Box>
  );
};

export default MapComponent;
