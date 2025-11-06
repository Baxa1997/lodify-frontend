import React from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";

const AddingChat = ({setIsAddRoomOpen = () => {}}) => {
  const menuItems = [
    {
      index: 1,
      label: "Mentions",
      icon: "/img/mailChat.svg",
    },
    {
      index: 2,
      label: "New Direct Message",
      icon: "/img/edit.svg",
      action: () => {
        setIsAddRoomOpen(true);
      },
    },
    {
      index: 3,
      label: "New Group",
      icon: "/img/group.svg",
    },

    {
      index: 4,
      label: "Dark Mode",
      icon: "/img/darkmode.svg",
    },
    {
      index: 5,
      label: "Sign Out",
      icon: "/img/signout.svg",
    },
  ];
  return (
    <>
      <Menu>
        <MenuButton
          bg="transparent"
          p={0}
          _hover={{bg: "transparent"}}
          borderRadius="50%"
          as={Button}>
          <Button
            // onClick={() => setIsAddChatOpen(true)}
            p="13px 9px"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
            gap="2px"
            borderRadius={"50%"}
            bg="#E9EAED">
            <Box w="100%" h="2px" bg="#005FFF"></Box>
            <Box w="100%" h="2px" bg="#005FFF"></Box>
            <Box w="100%" h="2px" bg="#005FFF"></Box>
          </Button>
        </MenuButton>
        <MenuList>
          <MenuItem py="6px" px={"12px"}>
            <Flex w="100%" gap="10px" alignItems="center">
              <Flex
                w="36px"
                h="36px"
                bg="#fff"
                borderRadius="50%"
                border="1px solid #E9EAED"
                alignItems="center"
                justifyContent="center">
                F
              </Flex>
              <Text fontSize="14px" fontWeight="500" color="#080707">
                Cristal Parker
              </Text>
            </Flex>
          </MenuItem>
          {menuItems?.map((item) => (
            <MenuItem onClick={item?.action} py="6px" px={"12px"}>
              <Flex w="100%" gap="10px" alignItems="center">
                <Flex
                  w="36px"
                  h="36px"
                  bg="#fff"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="50%">
                  <img src={item?.icon} alt="" />
                </Flex>
                <Text fontSize="14px" fontWeight="500" color="#080707">
                  {item?.label}
                </Text>
              </Flex>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </>
  );
};

export default AddingChat;
