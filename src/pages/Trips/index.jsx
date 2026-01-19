import {Flex} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import styles from "../../styles/tabs.module.scss";
import AddTripMenu from "./modules/AddTripMenu";
import ActionsNeeded from "./Tabs/ActionsNeeded/ActionsNeeded";
import HistoryTab from "./Tabs/HistoryTab";
import TransitTab from "./Tabs/TransitTab.jsx";
import UpcomingTab from "./Tabs/UpcomingTab";
import {useState} from "react";
import AutomatedAddTrip from "./modules/AutomatedAddTrip";

const Trips = () => {
  const [isAutomatedAddTrip, setIsAutomatedAddTrip] = useState(false);
  const clientType = useSelector((state) => state.auth.clientType);
  const [tripType, setTripType] = useState("tender");
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const isBroker = clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf";

  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        {isBroker && (
          <div data-tour="add-trip">
            <AddTripMenu setIsAutomatedAddTrip={setIsAutomatedAddTrip} />
          </div>
        )}

        <Tabs
          className={styles.tabsContainer}
          onSelect={(index) => {
            setSelectedTabIndex(index);
            if (index === 1) {
              setTripType("upcoming");
            } else if (index === 2) {
              setTripType("in_transit");
            } else if (index === 3) {
              setTripType("completed");
            }
          }}>
          <TabList data-tour="trips-tabs">
            <Tab>Actions Needed</Tab>
            <Tab>Upcoming</Tab>
            <Tab>In Transit</Tab>
            <Tab>
              {clientType?.id === "96ef3734-3778-4f91-a4fb-d8b9ffb17acf"
                ? "History"
                : "Completed"}
            </Tab>
          </TabList>

          <TabPanel>
            <ActionsNeeded />
          </TabPanel>
          <TabPanel>
            <UpcomingTab
              tripType={tripType}
              isActive={selectedTabIndex === 1}
            />
          </TabPanel>
          <TabPanel>
            <TransitTab tripType={tripType} isActive={selectedTabIndex === 2} />
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
