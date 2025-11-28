import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import MainHeading from "../../components/MainHeading";
import {Integrations} from "./modules/Integrations";
import {Permissions} from "./modules/Permissions";
import MainTabs from "../../components/MainTabs";

const Settings = () => {
  return (
    <div>
      <HeadBreadCrumb />
      {/* <MainTabs
        tabList={["Integrations", "Permissions"]}
        tabPanels={[
          <Integrations key={"Integrations"} />,
          <Permissions key={"Permissions"} />,
        ]}
      /> */}
      <Integrations key={"Integrations"} />
    </div>
  );
};

export default Settings;
