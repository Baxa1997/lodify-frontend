import React from "react";
import {Box, Flex, Text} from "@chakra-ui/react";
import {useWatch} from "react-hook-form";
import HFSelect from "../../../../components/HFSelect";

function StopAssignments({control, index}) {
  const driverType = useWatch({
    control,
    name: "driver_type",
  });

  const isTeam =
    Array.isArray(driverType) && driverType.includes("Team")
      ? true
      : driverType === "Team";

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
          name={`trip_pickups.${index}.drivers_id`}
          options={[]}
          view_fields={["first_name", "last_name"]}
        />
      </Box>
      {isTeam && (
        <Box w="100%">
          <Text mb="6px" fontWeight="500" fontSize="14px" color="#181D27">
            Drivers 2
          </Text>
          <HFSelect
            placeholder="Select Driver 2"
            backgroundColor="#fff"
            border="1px solid #D5D7DA"
            control={control}
            table_slug="drivers"
            name={`trip_pickups.${index}.drivers_id_2`}
            options={[]}
            view_fields={["first_name", "last_name"]}
          />
        </Box>
      )}
    </Flex>
  );
}

export default StopAssignments;
