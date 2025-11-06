
// import { CompanyInformation } from "./CompanyInformation";
// import { ValidateCarrier } from "./ValidateCarrier";
// import { ValidateEquipment } from "./ValidateEquipment";
// import { CaliforniaAirResources } from "./CaliforniaAirResources";
// import { MainSection } from "../MainSection";
// import { LaneInsights } from "../LaneInsights";
// import { SmsResult } from "../SmsResult";
// import { CrashIndicator } from "../CrashIndicator";
// import { Authority } from "../Authority";
// import { Insurance } from "../Insurance";
// import { ActiveAndPendingInsurance } from "../ActiveAndPendingInsurance";
// import { RejectedInsurance } from "../RejectedInsurance";
// import { Revocation } from "../Revocation";
// import { Safety } from "../Safety";
// import { Operations } from "../Operations";
import { SidebarTabs } from "../SidebarTabs";
import { InfoAccordion } from "../../../../components/InfoAccordion";
import { Connection } from "../Connection";
import { VictimIdentity } from "../VictimIdentity";
import { ConnectedCard } from "../ConnectedCard";
import { Box } from "@chakra-ui/react";
import { State } from "../State";
import { Equipment } from "../Equipment";
import { Authority } from "../Authority";
import { Safety } from "../Safety";
import { ActiveAndPendingInsurance } from "../ActiveAndPendingInsurance";
import { Operations } from "../Operations";
import { Violation } from "../Violation";

export const Overview = ({
  generalInfo,
  companySnapshot,
  carrierDetails,
  insuranceHistory,
  operation,
}) => {

  return <Box
    display="flex"
    alignItems="flex-start"
    gap="24px"
    pt="32px"
  >
    <SidebarTabs />
    <InfoAccordion>
      {/* <Connection />
      <VictimIdentity />
      <ConnectedCard /> */}
      <State />
      <Equipment />
      <Authority
        carrierDetails={carrierDetails}
        companySnapshot={companySnapshot}
      />
      <ActiveAndPendingInsurance />
      <Safety data={companySnapshot} />
      <Operations
        companySnapshot={companySnapshot}
        operation={operation}
      />
      <Violation />
    </InfoAccordion>
    {/* <MainSection
      data={generalInfo}
      companySnapshot={companySnapshot}
    /> */}
    {/* <LaneInsights data={companySnapshot} /> */}
    {/* <CompanyInformation data={companySnapshot} /> */}
    {/* <SmsResult /> */}
    {/* <CrashIndicator /> */}
    {/* <ValidateCarrier />
  <ValidateEquipment /> */}
    {/* <Authority data={carrierDetails} />
    <Insurance
      data={insuranceHistory}
      carrierDetails={carrierDetails}
    />
    <ActiveAndPendingInsurance />
    <RejectedInsurance />
    <Revocation />
    <Safety data={companySnapshot} /> */}
    {/* <CaliforniaAirResources /> */}
    {/* <Operations data={companySnapshot} /> */}
  </Box>;
};
