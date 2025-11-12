import {Flex, Text} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import {useState} from "react";
import HeadBreadCrumb from "@components/HeadBreadCrumb";
import AllBrokers from "./modules/AllBrokers";
import MyBrokers from "./modules/MyBrokers";

const Brokers = () => {
  const [isAutomatedAddTrip, setIsAutomatedAddTrip] = useState(false);
  const clientType = useSelector((state) => state.auth.clientType);
  const [tripType, setTripType] = useState("tender");

  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Tabs className={styles.tabsContainer}>
          <TabList>
            {/* <Tab onClick={() => setTripType("tender")}>My Brokers</Tab> */}
            <Tab onClick={() => setTripType("tender")}>All Brokers</Tab>
            <Tab onClick={() => setTripType("tender")}>Invitations</Tab>
          </TabList>

          {/* <TabPanel>
            <MyBrokers />
          </TabPanel> */}
          <TabPanel>
            <AllBrokers />
          </TabPanel>

          <TabPanel>
            <AllBrokers />
          </TabPanel>
          {/* <TabPanel>
            <Invitations />
          </TabPanel> */}
        </Tabs>
      </Flex>
    </>
  );
};

export default Brokers;
