import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import MainHeading from "../../components/MainHeading";
import MainTabs from "../../components/MainTabs";
import { CarrierProfile } from "./modules/CarrierProfile";
import { CompanyInfo } from "./modules/CompanyInfo";
import { Report } from "./modules/Report";

const CompanyProfile = () => {
  return (
    <div>
      <HeadBreadCrumb title={"Carriers"} />
      <MainHeading
        mt="20px"
        mb="20px">
        Carrier Info
      </MainHeading>
      <CarrierProfile />
      {/* <MainTabs
        tabList={[
          "Company Info",
          "Equipment",
          "Domicile(s)",
          "Certifications",
          "Business Ownership Information",
          "FMCSA Report",
          "Carrier Profile",
        ]}
        tabPanels={[
          <CompanyInfo key={"Company Info"} />,
          <></>,
          <></>,
          <></>,
          <></>,
          <Report key={"FMCSA Report"} />,
          <CarrierProfile key={"Carrier Profile"} />,
        ]} 
      /> */}
    </div>
  );
};

export default CompanyProfile;
