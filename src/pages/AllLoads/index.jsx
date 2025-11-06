import React, {useState} from "react";
import {Flex, Text} from "@chakra-ui/react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import tabsStyles from "../../styles/tabs.module.scss";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import ActiveLoads from "./modules/ActiveLoads";
import ClosedTrips from "./modules/ClosedTrips";
import {useSelector} from "react-redux";

const AllLoads = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Text h={"32px"} color={"#181D27"} fontWeight={"600"} fontSize={"24px"}>
          All Loads
        </Text>

        <Tabs className={tabsStyles.tabsContainer}>
          <TabList>
            <Tab onClick={() => setSelectedTabIndex(0)}>Active</Tab>
            <Tab onClick={() => setSelectedTabIndex(1)}>Closed</Tab>
          </TabList>

          <TabPanel>
            <ActiveLoads selectedTabIndex={selectedTabIndex} />
          </TabPanel>
          <TabPanel>
            <ClosedTrips selectedTabIndex={selectedTabIndex} />
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
};

export default AllLoads;
