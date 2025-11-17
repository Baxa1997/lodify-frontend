import React from "react";
import {Box, Text, MenuItem} from "@chakra-ui/react";
import {useLocation} from "react-router-dom";

const SidebarChildMenu = ({menuItem, onNavigate}) => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    const lastPath = location.pathname.split("/").pop();
    return lastPath === path;
  };

  if (!menuItem || !menuItem.children || menuItem.children.length === 0) {
    return null;
  }

  return (
    <>
      <Box px={4} py={3} borderBottom="1px solid rgba(255, 255, 255, 0.1)">
        <Text fontSize="16px" fontWeight="600" color="white">
          {menuItem.label}
        </Text>
      </Box>
      <Box as="ul" listStyleType="none" m={0} p={2}>
        {menuItem.children.map((child) => {
          const isActive = isActiveRoute(child.path);
          return (
            <MenuItem
              key={child.id}
              onClick={() => onNavigate(child.path)}
              bg={isActive ? "rgba(255, 255, 255, 0.15)" : "transparent"}
              color="white"
              fontWeight={isActive ? "600" : "400"}
              borderRadius="md"
              px={3}
              py={2}
              mb={1}
              _hover={{
                bg: isActive
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(255, 255, 255, 0.1)",
              }}
              _focus={{
                bg: isActive
                  ? "rgba(255, 255, 255, 0.15)"
                  : "rgba(255, 255, 255, 0.1)",
              }}>
              <Text color="white" fontWeight="600" fontSize="16px">
                {child.label}
              </Text>
            </MenuItem>
          );
        })}
      </Box>
    </>
  );
};

export default SidebarChildMenu;
