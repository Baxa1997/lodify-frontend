import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import styles from "./style.module.scss";

const MainTabs = ({ tabList = [], tabPanels = [] }) => {

  return <Tabs className={styles.tabsContainer}>
    <TabList>
      {
        tabList?.map(item => <Tab key={item}>{item}</Tab>)
      }
    </TabList>
    {
      tabPanels?.map((item, index) => (
        <TabPanel key={index}>
          {item}
        </TabPanel>
      ))
    }
  </Tabs>;
};

export default MainTabs;
