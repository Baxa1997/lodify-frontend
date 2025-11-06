import {Flex, Text} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import {useState} from "react";
import HeadBreadCrumb from "@components/HeadBreadCrumb";
import MyCarriers from "./modules/MyCarriers";
import AllCarriers from "./modules/AllCarriers";

const Carriers = () => {
  const [isAutomatedAddTrip, setIsAutomatedAddTrip] = useState(false);
  const clientType = useSelector((state) => state.auth.clientType);
  const [tripType, setTripType] = useState("tender");

  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab onClick={() => setTripType("tender")}>My Carriers</Tab>
            <Tab onClick={() => setTripType("tender")}>All Carriers</Tab>
            <Tab onClick={() => setTripType("tender")}>Invitations</Tab>
          </TabList>

          <TabPanel>
            <MyCarriers />
          </TabPanel>
          <TabPanel>
            <AllCarriers />
          </TabPanel>
          {/* <TabPanel>
            <Invitations />
          </TabPanel> */}
        </Tabs>
      </Flex>
    </>
  );
};

export default Carriers;
