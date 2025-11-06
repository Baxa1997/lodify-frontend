import HeadBreadCrumb from "@components/HeadBreadCrumb";
import React from "react";
import {Flex, Text} from "@chakra-ui/react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import MapComponent from "./modules/Map";
import ActiveComponent from "./modules/Active";

function GoReadyTrucks() {
  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Text h={"32px"} color={"#181D27"} fontWeight={"600"} fontSize={"24px"}>
          Go Ready™ Trucks
        </Text>

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab>Map</Tab>
            <Tab>Active</Tab>
          </TabList>

          <TabPanel>
            <MapComponent />
          </TabPanel>

          <TabPanel>
            <ActiveComponent />
          </TabPanel>
          {/* 
          <TabPanel>
            <ActionsNeeded />
          </TabPanel> */}
        </Tabs>
      </Flex>
    </>
  );
}

export default GoReadyTrucks;
