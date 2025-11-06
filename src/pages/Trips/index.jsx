import {Flex, Text} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import styles from "../../styles/tabs.module.scss";
import AddTripMenu from "./modules/AddTripMenu";
import ActionsNeeded from "./Tabs/ActionsNeeded";
import HistoryTab from "./Tabs/HistoryTab";
import TransitTab from "./Tabs/TransitTab.jsx";
import UpcomingTab from "./Tabs/UpcomingTab";
import TenderInvitations from "./Tabs/TenderInvitations";
import {useState} from "react";
import AutomatedAddTrip from "./modules/AutomatedAddTrip";

const Trips = () => {
  const [isAutomatedAddTrip, setIsAutomatedAddTrip] = useState(false);
  const clientType = useSelector((state) => state.auth.clientType);
  const [tripType, setTripType] = useState("tender");

  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <AddTripMenu setIsAutomatedAddTrip={setIsAutomatedAddTrip} />

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab onClick={() => setTripType("tender")}>Tender Invitations</Tab>

            <Tab>Actions Needed</Tab>
            <Tab onClick={() => setTripType("upcoming")}>Upcoming</Tab>
            <Tab onClick={() => setTripType("in_transit")}>In Transit</Tab>
            <Tab onClick={() => setTripType("completed")}>
              {clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
                ? "History"
                : "Completed"}
            </Tab>
          </TabList>

          <TabPanel>
            <TenderInvitations tripType={tripType} />
          </TabPanel>

          <TabPanel>
            <ActionsNeeded />
          </TabPanel>
          <TabPanel>
            <UpcomingTab tripType={tripType} />
          </TabPanel>
          <TabPanel>
            <TransitTab tripType={tripType} />
          </TabPanel>
          <TabPanel>
            <HistoryTab tripType={tripType} />
          </TabPanel>
        </Tabs>
      </Flex>

      <AutomatedAddTrip
        isOpen={isAutomatedAddTrip}
        onClose={() => setIsAutomatedAddTrip(false)}
      />
    </>
  );
};

export default Trips;
