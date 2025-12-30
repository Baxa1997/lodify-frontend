import React from "react";
import HeadBreadCrumb from "@components/HeadBreadCrumb";
import {Text} from "@chakra-ui/react";
import styles from "../../styles/tabs.module.scss";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import Performance from "./modules/Performance";
import Safety from "./modules/Safety";
import CompanyExecution from "./modules/CompanyExecution";
import DriverExecution from "./modules/DriverExecution";
import useScoreCardsProps from "./components/useScoreCardsProps";

const ScoreCards = () => {
  const {brokerSafetyData, driversData, limit, setLimit, page, setPage, count} =
    useScoreCardsProps();
  return (
    <>
      <HeadBreadCrumb />
      <Text
        h={"32px"}
        my="12px"
        color={"#181D27"}
        fontWeight={"600"}
        fontSize={"24px"}>
        Score Cards
      </Text>

      <Tabs className={styles.tabsContainer}>
        <TabList>
          <Tab>Performance</Tab>
          <Tab>Safety</Tab>
          <Tab>Company Execution</Tab>
          <Tab>Driver Execution</Tab>
        </TabList>

        <TabPanel>
          <Performance
            performanceData={brokerSafetyData}
            driversData={driversData}
            limit={limit}
            setLimit={setLimit}
            page={page}
            count={count}
            setPage={setPage}
          />
        </TabPanel>
        <TabPanel>
          <Safety />
        </TabPanel>
        <TabPanel>
          <CompanyExecution />
        </TabPanel>
        <TabPanel>
          <DriverExecution />
        </TabPanel>
      </Tabs>
    </>
  );
};

export default ScoreCards;
