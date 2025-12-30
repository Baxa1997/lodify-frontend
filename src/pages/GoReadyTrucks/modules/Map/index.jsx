import React, {useEffect} from "react";
import {Box} from "@chakra-ui/react";
import FiltersComponent from "../../components/FiltersComponent";
import GoogleMapComponent from "./GoogleMapComponent";
import {useSelector} from "react-redux";
import {useQuery} from "@tanstack/react-query";
import goReadyTrucksService from "@services/goReadyTrucksService";

const MapComponent = ({tabIndex = 0}) => {
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );
  const isActive = tabIndex === 0;

  const {
    data: trucksData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["DASHBOARD_MAP_TRUCKS_DATA", companiesId],
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
    enabled: isActive && !!companiesId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    if (isActive && companiesId) {
      refetch();
    }
  }, [isActive, companiesId, refetch]);

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
