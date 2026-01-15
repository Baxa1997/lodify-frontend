import React, {useState} from "react";
import {Text, Button, Flex} from "@chakra-ui/react";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import styles from "../../styles/tabs.module.scss";
import RequestsTab from "./components/RequestsTab";
import ResolutionTab from "./components/ResolutionTab";
import DisputesTab from "./components/DisputesTab";
import AddDetentionModal from "./components/AddDetentionModal";
import {useSelector} from "react-redux";

const Detention = () => {
  const userData = useSelector((state) => state.auth.user_data);
  const isBroker = Boolean(userData.brokers_id);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [tabType, setTabType] = useState("Request");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <HeadBreadCrumb />

      <Text
        my="20px"
        h={"32px"}
        color={"#181D27"}
        fontWeight={"600"}
        fontSize={"24px"}>
        Detention
      </Text>

      <Tabs
        className={styles.tabsContainer}
        selectedIndex={activeTabIndex}
        onSelect={(index) => {
          setActiveTabIndex(index);
          setTabType(
            index === 0 ? "Request" : index === 1 ? "Resolution" : "Dispute"
          );
        }}>
        <Flex alignItems="center" justifyContent="space-between" mb="0px">
          <TabList>
            <Tab>Requests</Tab>
            <Tab>Resolution</Tab>
            <Tab>Disputes</Tab>
          </TabList>

          {activeTabIndex === 0 && !isBroker && (
            <Button
              bg="#EF6820"
              color="white"
              fontSize="14px"
              fontWeight="600"
              h="40px"
              px="20px"
              borderRadius="8px"
              onClick={() => setIsAddModalOpen(true)}
              _hover={{bg: "#D55A1A"}}
              _active={{bg: "#C14E15"}}>
              Add Trip
            </Button>
          )}
        </Flex>
        <TabPanel>
          <RequestsTab tabType="Request" isActive={activeTabIndex === 0} />
        </TabPanel>
        <TabPanel>
          <ResolutionTab tabType="Resolution" isActive={activeTabIndex === 1} />
        </TabPanel>
        <TabPanel>
          <DisputesTab tabType="Dispute" isActive={activeTabIndex === 2} />
        </TabPanel>
      </Tabs>

      <AddDetentionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </>
  );
};

export default Detention;
