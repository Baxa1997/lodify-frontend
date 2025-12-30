import {Flex, Text} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import styles from "../../styles/tabs.module.scss";
import {useState} from "react";
import Heading from "./components/Heading";
import BrokerTab from "./components/BrokerTab";
import FacilityTab from "./components/FacilityTab";
import ReviewDriverTab from "./components/ReviewDriverTab";

const Reviews = () => {
  const clientType = useSelector((state) => state.auth.clientType);
  const [tripType, setTripType] = useState("tender");

  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Heading />

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab onClick={() => setTripType("upcoming")}>Carrier</Tab>
            <Tab onClick={() => setTripType("in_transit")}>Facility</Tab>
            <Tab onClick={() => setTripType("completed")}>Driver</Tab>
          </TabList>

          <TabPanel>
            <BrokerTab tripType={tripType} />
          </TabPanel>

          <TabPanel>
            <FacilityTab tripType={tripType} />
          </TabPanel>

          <TabPanel>
            <ReviewDriverTab tripType={tripType} />
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
};

export default Reviews;
