import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import MainHeading from "../../components/MainHeading";
import { Integrations } from "./modules/Integrations";
import { Permissions } from "./modules/Permissions";
import MainTabs from "../../components/MainTabs";

const Settings = () => {

  return <div>
    <HeadBreadCrumb />
    <MainHeading
      mt="20px"
      mb="20px"
    >
      Settings
    </MainHeading>
    <MainTabs 
      tabList={["Integrations", "Permissions"]}
      tabPanels={[<Integrations key={"Integrations"} />, <Permissions key={"Permissions"} />]} 
    />
  </div>;
};

export default Settings;
