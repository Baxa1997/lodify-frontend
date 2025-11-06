import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import {useNavigate} from "react-router-dom";

const AddTripMenu = ({setIsAutomatedAddTrip = false}) => {
  const navigate = useNavigate();
  return (
    <>
      <Flex alignItems={"center"} justifyContent={"space-between"} h={"32px"}>
        <Text h={"32px"} color={"#181D27"} fontWeight={"600"} fontSize={"24px"}>
          All Loads
        </Text>

        <Menu>
          <MenuButton p="0" as={Button}>
            <Button
              outline={"2px solid #EF6820"}
              outlineOffset={"2px"}
              gap={"4px"}
              display={"flex"}
              alignItems={"center"}
              bg={"#EF6820"}
              color={"#fff"}
              borderRadius={"8px"}
              h={"40px"}
              w={"114px"}
              fontSize={"14px"}
              fontWeight={"600"}
              _hover={{bg: "#EF6820"}}>
              <Text color={"#fff"} fontWeight={600}>
                Add Trip
              </Text>
              <ChevronDownIcon w="20px" h="20px" />
            </Button>
          </MenuButton>
          <MenuList border={"1px solid #E9EAEB"} p="4px 6px">
            <MenuItem
              display={"flex"}
              alignItems={"center"}
              gap={"8px"}
              borderRadius={"8px"}
              _hover={{bg: "#F5F5F5"}}
              onClick={() => setIsAutomatedAddTrip(true)}>
              <img src="/img/automated.svg" alt="" />
              <Text color={"#414651"} fontSize={"14px"} fontWeight={"600"}>
                Automated by Lodify AI
              </Text>
            </MenuItem>
            <MenuItem
              onClick={() => navigate("/admin/trips/add-trip")}
              display={"flex"}
              alignItems={"center"}
              gap={"8px"}
              borderRadius={"8px"}
              _hover={{bg: "#F5F5F5"}}>
              <img src="/img/manual.svg" alt="" />
              <Text color={"#414651"} fontSize={"14px"} fontWeight={"600"}>
                Manual
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </>
  );
};

export default AddTripMenu;
