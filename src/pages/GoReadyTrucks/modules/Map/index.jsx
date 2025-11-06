import React from "react";
import {Box, Text} from "@chakra-ui/react";
import FiltersComponent from "../../components/FiltersComponent";
import GoogleMapComponent from "./GoogleMapComponent";

const MapComponent = () => {
  return (
    <Box>
      <FiltersComponent
        onSearchChange={() => {}}
        onActionButtonClick={() => {}}
      />

      <GoogleMapComponent />
    </Box>
  );
};

export default MapComponent;
