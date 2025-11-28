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
          <Text color="#A4A7AE" fontWeight="400" fontSize="14px">
            No driver assigned
          </Text>
        )}
      </Box>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<MdMoreVert />}
          variant="ghost"
          size="sm"
          onClick={(e) => e.stopPropagation()}
          _hover={{bg: "gray.100"}}
        />
        <MenuList onClick={(e) => e.stopPropagation()}>
          <MenuItem onClick={onAssignClick}>Assign Drivers</MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default DriverAssignmentMenu;
