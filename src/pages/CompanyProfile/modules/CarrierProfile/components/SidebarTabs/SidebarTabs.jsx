import {useState, useEffect} from "react";
import {Flex, Text} from "@chakra-ui/react";
import styles from "./styles.module.scss";

export const SidebarTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    "Connection Status",
    "Assessment",
    "Insights",
    "Victim Identity",
    "State",
    "Authority",
    "Insurance",
    "Safety",
    "Inspections",
    "Equipment",
    "Operations",
    "Certifications",
    "Bluewire",
    "Performane",
    "Matched Data",
  ];

  const getTabId = (tabName) => {
    return tabName.replace(/\s+/g, "-").toLowerCase();
  };

  const handleTabClick = (tab, index) => {
    setActiveTab(index);
    const tabId = getTabId(tab);
    const element = document.getElementById(tabId);

    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      window.history.pushState(null, "", `#${tabId}`);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const tabIndex = tabs.findIndex(
        (tab) => getTabId(tab) === hash.toLowerCase()
      );
      if (tabIndex !== -1) {
        setActiveTab(tabIndex);
        setTimeout(() => {
          const element = document.getElementById(hash.toLowerCase());
          if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (let i = tabs.length - 1; i >= 0; i--) {
        const tabId = getTabId(tabs[i]);
        const element = document.getElementById(tabId);

        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            setActiveTab(i);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabs]);

  return (
    <Flex
      flexDir={"column"}
      gap={"4px"}
      w="175px"
      flexShrink={0}
      position="sticky"
      top="32px"
      alignSelf="flex-start">
      {tabs.map((tab, index) => (
        <Text
          as="a"
          w="100%"
          href={`#${getTabId(tab)}`}
          onClick={(e) => {
            e.preventDefault();
            handleTabClick(tab, index);
          }}
          className={
            activeTab === index ? styles.sidebarTabInactive : styles.sidebarTab
          }
          cursor={"pointer"}
          p="8px 12px"
          fontSize={"13px"}
          fontWeight={"600"}
          borderRadius={"8px"}
          key={tab}
          _hover={{
            textDecoration: "none",
            color: "#181d27",
          }}>
          {tab}
        </Text>
      ))}
    </Flex>
  );
};
