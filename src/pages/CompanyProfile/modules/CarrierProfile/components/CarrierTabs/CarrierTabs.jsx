import {Tabs, TabList, Tab, TabPanel} from "react-tabs";
import {Box, Text} from "@chakra-ui/react";
import styles from "@styles/tabs.module.scss";
import tabStyles from "./styles.module.scss";
import {Overview} from "../Overview";
import {Users} from "../Users";
import {Classifications} from "../Classifications";
import {InfoAccordion} from "../../../../components/InfoAccordion";
import {Agreements} from "../Agreements";

export const CarrierTabs = ({generalInfo, operation}) => {
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
        <Overview generalInfo={generalInfo} operation={operation} />
      </TabPanel>
      <TabPanel>
        <Users generalInfo={generalInfo} operation={operation} />
      </TabPanel>
      <TabPanel>
        <Box className={tabStyles.classificationsTabPanel}>
          <InfoAccordion
            className={tabStyles.classificationsAccordion}
            defaultIndex={[0]}>
            <Classifications generalInfo={generalInfo} operation={operation} />
          </InfoAccordion>
        </Box>
      </TabPanel>

      <TabPanel>
        <Text>Associations</Text>
      </TabPanel>

      <TabPanel>
        <Text>Questionnaire</Text>
      </TabPanel>

      <TabPanel>
        <Agreements />
      </TabPanel>
    </Tabs>
  );
};
