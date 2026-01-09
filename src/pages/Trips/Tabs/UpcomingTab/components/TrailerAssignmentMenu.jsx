import React from "react";
import {Text, Flex, Box, Tooltip, VStack, Button} from "@chakra-ui/react";
import {MdMoreVert} from "react-icons/md";

const TrailerAssignmentMenu = ({trip, onAssignClick}) => {
  const trailerPlate = trip?.trailers?.plate_number || "";

  return (
    <Flex alignItems="center" gap={2} onClick={(e) => e.stopPropagation()}>
      {trailerPlate ? (
        <>
          <Tooltip
            bg="linear-gradient(to bottom, #1a365d, #2d3748)"
            color="white"
            borderRadius="md"
            p="6px 10px"
            placement="bottom-start"
            label={
              <Box minW="180px">
                <VStack spacing={1} align="start">
                  <Text fontSize="14px" fontWeight="600" color="white">
                    Trailer: {trailerPlate}
                  </Text>
                </VStack>
              </Box>
            }>
            <Box flex="1">
              <Text color="#535862" fontWeight="400" fontSize="14px">
                {trailerPlate}
              </Text>
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
        </>
      ) : (
        <Button
          bg="none"
          border="none"
          color="#EF6820"
          fontWeight="600"
          px="0"
          fontSize="14px"
          _hover={{bg: "none"}}
          onClick={onAssignClick}>
          Assign Trailer
        </Button>
      )}
    </Flex>
  );
};

export default TrailerAssignmentMenu;
