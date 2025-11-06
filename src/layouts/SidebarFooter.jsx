import {
  Box,
  Flex,
  Text,
  Button,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {authActions} from "../store/auth/auth.slice";
import styles from "./AdminLayout.module.scss";
import React, {useState, useRef, useEffect} from "react";

const SidebarFooter = ({sidebarOpen = true}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const userData = useSelector((state) => state.auth.user_data);

  const handleLogout = () => {
    dispatch(authActions.logout());
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    navigate("/login", {replace: true});
  };

  const handleSettingsClick = () => {
    navigate("settings");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  return (
    <div className={styles.sidebarFooter}>
      {sidebarOpen ? (
        <>
          <Button
            variant="ghost"
            p={"8px 12px"}
            h={"40px"}
            mb={"16px"}
            cursor={"pointer"}
            borderRadius={"6px"}
            bg="transparent"
            _hover={{bg: "rgba(255, 255, 255, 0.1)"}}
            _active={{bg: "rgba(255, 255, 255, 0.1)"}}
            onClick={handleSettingsClick}
            gap="8px"
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="flex-start">
            <img src="/img/setting.svg" alt="" width="20" height="20" />
            <Text fontSize={"16px"} fontWeight={"600"} color={"#CECFD2"}>
              Settings
            </Text>
          </Button>
          <Box ref={profileRef} position="relative" zIndex={99999}>
            <Menu
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              placement="right-start">
              <Button
                as={Flex}
                justifyContent={"flex-start"}
                position={"relative"}
                bg={"transparent"}
                alignItems={"center"}
                gap={"8px"}
                borderRadius={"12px"}
                border={"0.5px solid #eee"}
                p={"8px 12px"}
                h={"64px"}
                cursor={"pointer"}
                _hover={{bg: "transparent"}}
                _active={{bg: "#1a1f2a"}}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                width="100%">
                <Box
                  cursor={"pointer"}
                  position={"absolute"}
                  right={"12px"}
                  top={"12px"}>
                  <img src="/img/chevron.svg" alt="" />
                </Box>
                <Box
                  w={"40px"}
                  h={"40px"}
                  bg={"transparent"}
                  borderRadius={"50%"}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  color={"#94979C"}
                  fontWeight={"600"}
                  border={"0.5px solid #eee"}
                  fontSize={"16px"}>
                  {(userData?.login || "").charAt(0).toUpperCase()}
                </Box>
                <Flex
                  flexDirection={"column"}
                  gap={"0px"}
                  flex={1}
                  minWidth={0}
                  mr={"40px"}>
                  <Text fontSize={"14px"} fontWeight={"600"} color={"#fff"}>
                    {userData?.login || ""}
                  </Text>
                  <Tooltip
                    label={userData?.email}
                    placement="top"
                    hasArrow
                    bg="#1a1a1a"
                    color="#fff"
                    fontSize="12px">
                    <Text
                      fontSize={"12px"}
                      fontWeight={"400"}
                      color={"#94979C"}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      maxWidth="100%">
                      {userData?.email}
                    </Text>
                  </Tooltip>
                </Flex>
              </Button>
              <MenuList
                bg="#1a1a1a"
                border="1px solid #333"
                borderRadius="8px"
                minW="200px"
                zIndex={99999}
                position="absolute"
                left="250px"
                top="0"
                mt="0">
                <MenuItem
                  onClick={handleLogout}
                  bg="transparent"
                  _hover={{bg: "rgba(255, 255, 255, 0.1)"}}
                  color="#ef4444"
                  icon={
                    <Box w="16px" h="16px" fontSize="12px" fontWeight="bold">
                      L
                    </Box>
                  }>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </>
      ) : (
        <>
          <Tooltip label="Settings" placement="right" hasArrow>
            <Button
              as={Button}
              variant="ghost"
              alignItems={"center"}
              justifyContent={"center"}
              p={"8px"}
              borderRadius={"8px"}
              _hover={{bg: "rgba(255, 255, 255, 0.1)"}}
              _active={{bg: "rgba(255, 255, 255, 0.1)"}}
              cursor={"pointer"}
              w={"48px"}
              h={"48px"}
              bg="transparent"
              className={styles.footerIconButton}
              onClick={handleSettingsClick}
              mb="8px">
              <img src="/img/setting.svg" alt="Settings" />
            </Button>
          </Tooltip>

          <Box ref={profileRef} position="relative" zIndex={99999}>
            <Menu
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              placement="right-start">
              <Tooltip label="Profile" placement="right" hasArrow>
                <Button
                  as={Button}
                  variant="ghost"
                  alignItems={"center"}
                  justifyContent={"center"}
                  p={"8px"}
                  borderRadius={"8px"}
                  _hover={{bg: "rgba(255, 255, 255, 0.1)"}}
                  _active={{bg: "rgba(255, 255, 255, 0.1)"}}
                  cursor={"pointer"}
                  w={"48px"}
                  h={"48px"}
                  bg="transparent"
                  className={styles.footerIconButton}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <Box
                    w={"24px"}
                    h={"24px"}
                    bg={"#22262F"}
                    borderRadius={"50%"}
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    color={"#94979C"}
                    fontWeight={"600"}
                    fontSize={"12px"}>
                    {(userData?.name || userData?.email || "J")
                      .charAt(0)
                      .toUpperCase()}
                  </Box>
                </Button>
              </Tooltip>
              <MenuList
                bg="#1a1a1a"
                border="1px solid #333"
                borderRadius="8px"
                minW="150px"
                zIndex={99999}
                position="absolute"
                left="60px"
                top="0"
                mt="0">
                <MenuItem
                  onClick={handleLogout}
                  bg="transparent"
                  _hover={{bg: "rgba(255, 255, 255, 0.1)"}}
                  color="#ef4444"
                  icon={
                    <Box w="16px" h="16px" fontSize="12px" fontWeight="bold">
                      L
                    </Box>
                  }>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </>
      )}
    </div>
  );
};

export default SidebarFooter;
