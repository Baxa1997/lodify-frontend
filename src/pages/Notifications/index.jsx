import {Text} from "@chakra-ui/react";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import NotificationActionNeeded from "./components/NotificationActionNeeded";
import NotificationTab from "./components/NotificationTab";

function Notifications() {
  return (
    <>
      <HeadBreadCrumb />

      <Text
        my="16px"
        h={"32px"}
        color={"#181D27"}
        fontWeight={"600"}
        fontSize={"24px"}>
        Notifications
      </Text>

      <Tabs className={styles.tabsContainer}>
        <TabList>
          <Tab>Action Needed</Tab>
          <Tab>Notification</Tab>
        </TabList>
        <TabPanel>
          <Text>
            <NotificationActionNeeded />
          </Text>
        </TabPanel>
        <TabPanel>
          <NotificationTab />
        </TabPanel>
      </Tabs>
    </>
  );
}

export default Notifications;
