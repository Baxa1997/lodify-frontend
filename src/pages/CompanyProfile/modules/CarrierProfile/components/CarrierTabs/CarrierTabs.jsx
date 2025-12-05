import {Tabs, TabList, Tab, TabPanel} from "react-tabs";
import styles from "@styles/tabs.module.scss";
import {Overview} from "../Overview";
import {Users} from "../Users";

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
        <Tab>Users</Tab>
        <Tab>Classifications</Tab>
        <Tab>Associations</Tab>
        <Tab>Questionnaire</Tab>
        <Tab>Agreements</Tab>
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

      <TabPanel>
        <Users
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
