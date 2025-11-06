import React from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import styles from "../../../../styles/tabs.module.scss";
import OverViewTab from "./OverViewTab";
const TabsSection = () => {
  return (
    <Tabs className={styles.tabsContainer}>
      <TabList>
        <Tab>Overview</Tab>
      </TabList>
      <TabPanel>
        <OverViewTab />
      </TabPanel>
    </Tabs>
  );
};

export default TabsSection;
