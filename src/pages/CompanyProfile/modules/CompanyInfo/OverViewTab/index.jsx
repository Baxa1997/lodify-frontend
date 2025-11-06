import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import SidebarTabs from "./SidebarTabs";
import MainContent from "./MainContent";

const OverViewTab = () => {
  return (
    <>
      <Flex
        pt="20px"
        gap="24px">
        <SidebarTabs />

        <MainContent />
      </Flex>
    </>
  );
};

export default OverViewTab;
