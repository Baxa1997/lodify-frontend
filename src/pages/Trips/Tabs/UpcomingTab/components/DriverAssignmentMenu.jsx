import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Text,
  Flex,
  Box,
  Tooltip,
  VStack,
  Button,
} from "@chakra-ui/react";
import {MdMoreVert} from "react-icons/md";

const DriverAssignmentMenu = ({trip, onAssignClick}) => {
  const driver1Name = trip?.drivers
    ? `${trip.drivers.first_name || ""} ${trip.drivers.last_name || ""}`.trim()
    : "";
  const driver2Name = trip?.drivers_2
    ? `${trip.drivers_2.first_name || ""} ${
        trip.drivers_2.last_name || ""
      }`.trim()
    : "";

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
              <Text fontSize="14px" fontWeight="600" color="white">
                {trip?.drivers?.company_name}
              </Text>
              <Text fontSize="14px" fontWeight="600" color="white">
                {`${trip?.drivers?.first_name} ${trip?.drivers?.last_name}`}
              </Text>
              {trip?.driver_type === "Team" && (
                <Text fontSize="14px" fontWeight="600" color="white">
                  {`${trip?.drivers_2?.first_name} ${trip?.drivers_2?.last_name}`}
                </Text>
              )}
            </VStack>
          </Box>
        }>
        <Box flex="1">
          {driver1Name && (
            <Text color="#535862" fontWeight="400" fontSize="14px">
              {driver1Name}
            </Text>
          )}
          {driver2Name && (
            <Text color="#535862" fontWeight="400" fontSize="14px">
              {driver2Name}
            </Text>
          )}
          {!driver1Name && !driver2Name && (
            <Text
              onClick={onAssignClick}
              color="#A4A7AE"
              fontWeight="400"
              fontSize="14px">
              No driver assigned
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
      {/* <Menu>
        <MenuButton
          as={IconButton}
          icon={<MdMoreVert />}
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
          _hover={{bg: "gray.100"}}
        />
        <MenuList zIndex={9} onClick={(e) => e.stopPropagation()}>
          <MenuItem onClick={onAssignClick}>
            {driver1Name || driver2Name ? "Reassign Drivers" : "Assign Drivers"}
          </MenuItem>
        </MenuList>
      </Menu> */}
    </Flex>
  );
};

export default DriverAssignmentMenu;
