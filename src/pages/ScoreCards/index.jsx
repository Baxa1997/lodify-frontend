import React from "react";
import HeadBreadCrumb from "@components/HeadBreadCrumb";
import {Text} from "@chakra-ui/react";
import styles from "../../styles/tabs.module.scss";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import Performance from "./modules/Performance";

const ScoreCards = () => {
  return (
    <>
      <HeadBreadCrumb />
      <Text
        h={"32px"}
        my="12px"
        color={"#181D27"}
        fontWeight={"600"}
        fontSize={"24px"}>
        Score Cards
      </Text>

      <Tabs className={styles.tabsContainer}>
        <TabList>
          <Tab>Performance</Tab>
          <Tab>Safety</Tab>
          <Tab>Company Execution</Tab>
          <Tab>Driver Execution</Tab>
        </TabList>

        <TabPanel>
          <Performance />
        </TabPanel>
        <TabPanel>
          <Text>My</Text>
        </TabPanel>
      </Tabs>
    </>
  );
};

export default ScoreCards;
