import React from "react";
import {useFieldArray} from "react-hook-form";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import PickupFields from "./PickupFields";

function AddressSection({control, isLoading = false, onCancel}) {
  const {fields, append, remove} = useFieldArray({
    control,
    name: "trip_pickups",
  });

  return (
    <Box>
      {fields.map((field, index) => (
        <PickupFields
          key={field.id}
          control={control}
          index={index}
          removePickup={remove}
          field={field}
        />
      ))}

      <Flex mt="20px" pt="20px" gap="12px" justifyContent="flex-start">
        <Button
          mr={2}
          colorScheme="blue"
          bg="transparent"
          border="1px solid #84CAFF"
          _hover={{bg: "transparent"}}
          borderRadius="8px"
          p="10px 16px"
          onClick={() =>
            append({
              type: ["Pickup"],
              name: "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
            })
          }>
          <img
            src="/img/addIconColor.svg"
            alt="add"
            width="14px"
            height="14px"
          />
          <Text ml="6px" fontSize="14px" fontWeight="600" color="#175CD3">
            Add Pickup
          </Text>
        </Button>
        <Button
          colorScheme="green"
          border="1px solid #84CAFF"
          bg="transparent"
          _hover={{bg: "transparent"}}
          borderRadius="8px"
          fontSize="14px"
          fontWeight="600"
          color="#175CD3"
          p="10px 16px"
          onClick={() =>
            append({
              type: ["Delivery"],
              name: "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
            })
          }>
          <img
            src="/img/addIconColor.svg"
            alt="add"
            width="14px"
            height="14px"
          />
          <Text ml="6px" fontSize="14px" fontWeight="600" color="#175CD3">
            Add Delivery
          </Text>
        </Button>

        <Button
          colorScheme="green"
          border="1px solid #84CAFF"
          bg="transparent"
          _hover={{bg: "transparent"}}
          borderRadius="8px"
          fontSize="14px"
          fontWeight="600"
          color="#175CD3"
          p="10px 16px"
          onClick={() =>
            append({
              type: ["Pickup and Delivery"],
              name: "",
              address: "",
              city: "",
              state: "",
              zipCode: "",
            })
          }>
          <img
            src="/img/addIconColor.svg"
            alt="add"
            width="14px"
            height="14px"
          />
          <Text ml="6px" fontSize="14px" fontWeight="600" color="#175CD3">
            Pickup And Delivery
          </Text>
        </Button>
      </Flex>
    </Box>
  );
}

export default AddressSection;
