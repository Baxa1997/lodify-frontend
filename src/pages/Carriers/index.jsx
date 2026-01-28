import {useMemo, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {Flex, Text} from "@chakra-ui/react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import HeadBreadCrumb from "@components/HeadBreadCrumb";
import MyCarriers from "./modules/MyCarriers";
import AllCarriers from "./modules/AllCarriers";

const TAB_KEYS = ["my", "all", "invitations"];
const TAB_INDEX_MAP = {my: 0, all: 1, invitations: 2};

const Carriers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab");
  const selectedIndex = useMemo(() => {
    if (tabParam && TAB_INDEX_MAP[tabParam] !== undefined) {
      return TAB_INDEX_MAP[tabParam];
    }
    return 0;
  }, [tabParam]);

  useEffect(() => {
    if (!tabParam || TAB_INDEX_MAP[tabParam] === undefined) {
      setSearchParams({tab: "my"}, {replace: true});
    }
  }, [tabParam, setSearchParams]);

  const handleTabSelect = (index) => {
    const key = TAB_KEYS[index];
    if (key) {
      setSearchParams({tab: key});
    }
  };

  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Tabs
          className={styles.tabsContainer}
          selectedIndex={selectedIndex}
          onSelect={handleTabSelect}>
          <TabList>
            <Tab>My Carriers</Tab>
            <Tab>All Carriers</Tab>
            <Tab>Invitations</Tab>
          </TabList>

          <TabPanel>
            <MyCarriers />
          </TabPanel>
          <TabPanel>
            <AllCarriers />
          </TabPanel>
          <TabPanel>
            <Flex h={"calc(100vh - 200px)"} justify="center" align="center">
              <Text>No Data Available</Text>
            </Flex>
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
};

export default Carriers;
