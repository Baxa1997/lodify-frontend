import React from "react";
import {Box, Flex, Text} from "@chakra-ui/react";
import HFSelect from "../../../../components/HFSelect";

function StopAssignments({control, index}) {
  return (
    <Flex gap="12px" my="14px" borderRadius="12px">
      <Box w="100%">
        <Text mb="6px" fontWeight="500" fontSize="14px" color="#181D27">
          Drivers
        </Text>
        <HFSelect
          placeholder="Select Driver"
          backgroundColor="#fff"
          border="1px solid #D5D7DA"
          control={control}
          table_slug="drivers"
          name={`trip_pickups.${index}.driver_id`}
          options={[]}
          view_fields={["first_name", "last_name"]}
        />
      </Box>
      <Box w="100%">
        <Text mb="6px" fontWeight="500" fontSize="14px" color="#181D27">
          Trucks
        </Text>
        <HFSelect
          placeholder="Select Truck"
          backgroundColor="#fff"
          border="1px solid #D5D7DA"
          control={control}
          table_slug="tractors"
          name={`trip_pickups.${index}.tractor_id`}
          options={[]}
          view_fields={["plate_number"]}
        />
      </Box>
      <Box w="100%">
        <Text mb="6px" fontWeight="500" fontSize="14px" color="#181D27">
          Trailers
        </Text>
        <HFSelect
          placeholder="Select Trailer"
          backgroundColor="#fff"
          border="1px solid #D5D7DA"
          control={control}
          table_slug="trailers"
          name={`trip_pickups.${index}.trailer_id`}
          options={[]}
          view_fields={["plate_number"]}
        />
      </Box>
    </Flex>
  );
}

export default StopAssignments;
