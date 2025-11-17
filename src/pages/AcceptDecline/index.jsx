import {Flex, Text} from "@chakra-ui/react";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import AcceptedTrips from "./modules/AcceptedTrips";
import DeclinedTrips from "./modules/DeclinedTrips";

const AcceptDecline = () => {
  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Text h={"32px"} color={"#181D27"} fontWeight={"600"} fontSize={"24px"}>
          Accept / Decline
        </Text>

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab>Accepted</Tab>

            <Tab>Declined</Tab>
          </TabList>

          <TabPanel>
            <AcceptedTrips />
          </TabPanel>
          <TabPanel>
            <DeclinedTrips />
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
};

export default AcceptDecline;
