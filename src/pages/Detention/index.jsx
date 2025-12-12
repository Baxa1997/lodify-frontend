import React from "react";
import {Box, Text} from "@chakra-ui/react";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import RequestsTab from "./components/RequestsTab";

const Detention = () => {
  return (
    <>
      <HeadBreadCrumb />

      <Text
        my="20px"
        h={"32px"}
        color={"#181D27"}
        fontWeight={"600"}
        fontSize={"24px"}>
        Detention
      </Text>

      <Tabs className={styles.tabsContainer}>
        <TabList>
          <Tab>Requests</Tab>
          <Tab>Resolution</Tab>
          <Tab>Disputes</Tab>
        </TabList>
        <TabPanel>
          <RequestsTab />
        </TabPanel>
        <TabPanel>
          <Text>Closed</Text>
        </TabPanel>
      </Tabs>
    </>
  );
};

export default Detention;
