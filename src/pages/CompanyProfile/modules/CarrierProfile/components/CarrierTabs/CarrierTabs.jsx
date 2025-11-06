import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import styles from "@styles/tabs.module.scss";
import { Overview } from "../Overview";

export const CarrierTabs = ({
  carrierDetails,
  companySnapshot,
  generalInfo,
  insuranceHistory,
  operation,
}) => {
  return (
    <Tabs className={styles.tabsContainer}>
      <TabList>
        <Tab>Overview</Tab>
      </TabList>
      <TabPanel>
        <Overview
          carrierDetails={carrierDetails}
          companySnapshot={companySnapshot}
          generalInfo={generalInfo}
          insuranceHistory={insuranceHistory}
          operation={operation}
        />
      </TabPanel>
    </Tabs>
  );
};
