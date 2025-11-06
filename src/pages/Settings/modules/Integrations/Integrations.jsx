import { Button } from "@chakra-ui/react";
import style from "./style.module.scss";
import { GoPlus } from "react-icons/go";
import { BiDotsVerticalRounded } from "react-icons/bi";
import MainTabs from "../../../../components/MainTabs";
import { ViewAll } from "./components/ViewAll";

export const Integrations = () => {

  return <div>
    <div className={style.integrationsHeader}>
      <div className={style.integrationsTitle}>
        <h3 className={style.integrationsTitleText}>Integrations and connected apps</h3>
        <p className={style.integrationsTitleDescription}>Supercharge your workflow and connect the tool you use every day.</p>
      </div>
      <div className={style.integrationsActions}>
        <Button
          variant="outline"
          leftIcon={<GoPlus size={"20px"} />}>Request integration</Button>
        <button>
          <BiDotsVerticalRounded size={"20px"}/>
        </button>
      </div>
    </div>
    <div className={style.tabsContainer}>
      <MainTabs
        tabList={[
          "View all",
          "Developer tools",
          "Communication",
          "Productivity",
          "Browser tools",
          "Marketplace",
        ]}
        tabPanels={[<ViewAll key={"View all"} />,
          <>Developer tools</>,
          <>Communication</>,
          <>Productivity</>,
          <>Browser tools</>,
          <>Marketplace</>,
        ]} 
      />
    </div>
  </div>;
};
