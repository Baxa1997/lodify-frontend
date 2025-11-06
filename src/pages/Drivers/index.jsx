import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import { DriversTab } from "./modules/DriversTab";
import { DocumentsTab } from "./modules/DocumentsTab";

const Drivers = () => {
  return (
    <>
      <Flex
        flexDir={"column"}
        gap={"20px"}>
        <HeadBreadCrumb />
        <Box h={"32px"}>
          <Text
            h={"32px"}
            color={"#181D27"}
            fontWeight={"600"}
            fontSize={"24px"}>
            Drivers
          </Text>
        </Box>

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab>Drivers</Tab>
            <Tab>Documents</Tab>
          </TabList>

          <TabPanel>
            <DriversTab />
          </TabPanel>
          <TabPanel>
            <DocumentsTab />
          </TabPanel>
        </Tabs>
      </Flex>
    </>
  );
};

export default Drivers;
