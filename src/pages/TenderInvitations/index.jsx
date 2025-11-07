import React from "react";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import {Flex, Text} from "@chakra-ui/react";
import styles from "../../styles/tabs.module.scss";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import ActiveTenders from "./modules/ActiveTenders";
import ClosedTenders from "./modules/ClosedTenders";

const TenderInvitations = () => {
  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Text h={"32px"} color={"#181D27"} fontWeight={"600"} fontSize={"24px"}>
          Tender Invitations
        </Text>

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab>Active</Tab>

            <Tab>Closed</Tab>
          </TabList>

          <TabPanel>
            <ActiveTenders />
          </TabPanel>
          <TabPanel>
            <ClosedTenders />
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
};

export default TenderInvitations;
