import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import MainHeading from "../../components/MainHeading";
import {CarrierProfile} from "./modules/CarrierProfile";

const CompanyProfile = () => {
  return (
    <div>
      <HeadBreadCrumb title={"Carriers"} />
      <MainHeading mt="20px" mb="20px">
        Carrier Info
      </MainHeading>
      <CarrierProfile />
    </div>
  );
};

export default CompanyProfile;
