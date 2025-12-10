import {Flex} from "@chakra-ui/react";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import HeadBreadCrumb from "@components/HeadBreadCrumb";
import MyCarriers from "./modules/MyCarriers";
import AllCarriers from "./modules/AllCarriers";

const Carriers = () => {
  return (
    <>
      <Flex flexDir={"column"} gap={"20px"}>
        <HeadBreadCrumb />

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab>My Carriers</Tab>
            <Tab>All Carriers</Tab>
          </TabList>

          <TabPanel>
            <MyCarriers />
          </TabPanel>
          <TabPanel>
            <AllCarriers />
          </TabPanel>

          {/* <TabPanel>
            <AllCarriers />
          </TabPanel> */}
          {/* <TabPanel>
            <Invitations />
          </TabPanel> */}
        </Tabs>
      </Flex>
    </>
  );
};

export default Carriers;
