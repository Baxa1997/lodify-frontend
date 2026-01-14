import React, {useState} from "react";
import {Box, Text} from "@chakra-ui/react";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import RequestsTab from "./components/RequestsTab";
import ResolutionTab from "./components/ResolutionTab";
import DisputesTab from "./components/DisputesTab";

const Detention = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabType, setTabType] = useState("Request");

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

      <Tabs
        className={styles.tabsContainer}
        selectedIndex={activeTabIndex}
        onSelect={(index) => {
          setActiveTabIndex(index);
          setTabType(
            index === 0 ? "Request" : index === 1 ? "Resolution" : "Disputes"
          );
        }}>
        <TabList>
          <Tab>Requests</Tab>
          <Tab>Resolution</Tab>
          <Tab>Disputes</Tab>
        </TabList>
        <TabPanel>
          <RequestsTab tabType="Request" isActive={activeTabIndex === 0} />
        </TabPanel>
        <TabPanel>
          <ResolutionTab tabType="Resolution" isActive={activeTabIndex === 1} />
        </TabPanel>
        <TabPanel>
          <DisputesTab tabType="Disputes" isActive={activeTabIndex === 2} />
        </TabPanel>
      </Tabs>
    </>
  );
};

export default Detention;
