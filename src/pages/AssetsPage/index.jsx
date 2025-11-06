import React from "react";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import { Flex, Box, Text } from "@chakra-ui/react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import TrailersTab from "./TrailersTab";
import TractorsTab from "./TractorsTab";

const AssetsPage = () => {
  return (
    <>
      <Flex
        flexDir={"column"}
        gap={"20px"}>
        <HeadBreadCrumb />
        <Box h={"32px"}>
          <Text
            h={"32px"}
            color={"#181D27"}
            fontWeight={"600"}
            fontSize={"24px"}>
            Assets
          </Text>
        </Box>

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab>Tractor</Tab>
            <Tab>Trailer</Tab>
          </TabList>

          <TabPanel>
            <TractorsTab />
          </TabPanel>
          <TabPanel>
            <TrailersTab />
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
};

export default AssetsPage;
