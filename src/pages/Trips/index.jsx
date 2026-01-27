import {Flex} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {useSearchParams} from "react-router-dom";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import styles from "../../styles/tabs.module.scss";
import AddTripMenu from "./modules/AddTripMenu";
import ActionsNeeded from "./Tabs/ActionsNeeded/ActionsNeeded";
import HistoryTab from "./Tabs/HistoryTab";
import TransitTab from "./Tabs/TransitTab.jsx";
import UpcomingTab from "./Tabs/UpcomingTab";
import {useState, useMemo, useEffect} from "react";
import AutomatedAddTrip from "./modules/AutomatedAddTrip";

const TAB_PARAM = "tab";
const TAB_MAP = {
  actions: 0,
  "0": 0,
  one: 0,
  "1": 1,
  upcoming: 1,
  "2": 2,
  transit: 2,
  "in_transit": 2,
  "3": 3,
  history: 3,
  completed: 3,
};
const INDEX_TO_TAB = ["actions", "upcoming", "transit", "history"];

const Trips = () => {
  const [isAutomatedAddTrip, setIsAutomatedAddTrip] = useState(false);
  const [tripType, setTripType] = useState("tender");
  const [searchParams, setSearchParams] = useSearchParams();
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const isBroker = Boolean(brokersId);

  const tabFromQuery = searchParams.get(TAB_PARAM);
  const selectedTabIndex = useMemo(() => {
    if (!tabFromQuery) return 0;
    const normalized = String(tabFromQuery).toLowerCase().trim();
    return TAB_MAP[normalized] ?? 0;
  }, [tabFromQuery]);

  useEffect(() => {
    if (selectedTabIndex === 1) {
      setTripType("upcoming");
    } else if (selectedTabIndex === 2) {
      setTripType("in_transit");
    } else if (selectedTabIndex === 3) {
      setTripType("completed");
    }
  }, [selectedTabIndex]);

  const handleTabSelect = (index) => {
    setSearchParams({[TAB_PARAM]: INDEX_TO_TAB[index]});
    if (index === 1) {
      setTripType("upcoming");
    } else if (index === 2) {
      setTripType("in_transit");
    } else if (index === 3) {
      setTripType("completed");
    }
  };

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
          selectedIndex={selectedTabIndex}
          onSelect={handleTabSelect}>
          <TabList data-tour="trips-tabs">
            <Tab>Actions Needed</Tab>
            <Tab>Upcoming</Tab>
            <Tab>In Transit</Tab>
            <Tab>
                {isBroker
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
