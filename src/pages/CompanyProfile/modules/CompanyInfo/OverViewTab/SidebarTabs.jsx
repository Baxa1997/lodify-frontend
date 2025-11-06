import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import styles from "../style.module.scss";

const SidebarTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    "Connection Status",
    "Assessment",
    "Insights",
    "Document",
    "Lane Preferences",
    "Authory",
    "Insurance",
    "Safety",
    "Inspections",
    "Crashes",
    "Operations",
    "Certifications",
    "Bluewire",
    "Performane",
    "Matched Data",
  ];
  return (
    <Flex
      flexDir={"column"}
      gap={"4px"}
      w="175px">
      {tabs.map((tab, index) => (
        <Text
          as="a"
          w="100%"
          href={`#${tab}`}
          onClick={() => setActiveTab(index)}
          className={
            activeTab === index ? styles.sidebarTabInactive : styles.sidebarTab
          }
          cursor={"pointer"}
          p="8px 12px"
          fontSize={"13px"}
          fontWeight={"600"}
          borderRadius={"8px"}
          key={tab}
          _hover={{
            textDecoration: "none",
            color: "#181d27",
          }}
        >
          {tab}
        </Text>
      ))}
    </Flex>
  );
};

export default SidebarTabs;
