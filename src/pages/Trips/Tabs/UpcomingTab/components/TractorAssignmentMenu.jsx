import React from "react";
import {Text, Flex, Box, Tooltip, VStack, Button} from "@chakra-ui/react";
import {MdMoreVert} from "react-icons/md";

const TractorAssignmentMenu = ({trip, onAssignClick}) => {
  const tractorPlate =
    trip?.tractors?.plate_number || trip?.tractors?.licence_plate || "";

  return (
    <Flex alignItems="center" gap={2} onClick={(e) => e.stopPropagation()}>
      <Tooltip
        bg="linear-gradient(to bottom, #1a365d, #2d3748)"
        color="white"
        borderRadius="md"
        p="6px 10px"
        placement="bottom-start"
        label={
          <Box minW="180px">
            <VStack spacing={1} align="start">
              {tractorPlate ? (
                <Text fontSize="14px" fontWeight="600" color="white">
                  Tractor: {tractorPlate}
                </Text>
              ) : (
                <Text fontSize="14px" fontWeight="600" color="white">
                  No tractor assigned
                </Text>
              )}
            </VStack>
          </Box>
        }>
        <Box flex="1">
          {tractorPlate ? (
            <Text color="#535862" fontWeight="400" fontSize="14px">
              {tractorPlate}
            </Text>
          ) : (
            <Text
              onClick={onAssignClick}
              color="#A4A7AE"
              fontWeight="400"
              fontSize="14px">
              No tractor assigned
            </Text>
          )}
        </Box>
      </Tooltip>
      <Button
        bg="none"
        border="none"
        px="0"
        minWidth="22px"
        width="22px"
        minHeight="22px"
        height="22px"
        onClick={onAssignClick}>
        <MdMoreVert />
      </Button>
    </Flex>
  );
};

export default TractorAssignmentMenu;
