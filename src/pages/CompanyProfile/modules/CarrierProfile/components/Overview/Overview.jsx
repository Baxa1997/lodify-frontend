import {SidebarTabs} from "../SidebarTabs";
import {InfoAccordion} from "../../../../components/InfoAccordion";
import {Box} from "@chakra-ui/react";
import {State} from "../State";
import {Equipment} from "../Equipment";
import {Authority} from "../Authority";
import {Safety} from "../Safety";
import {Inspections} from "../Inspections";
import {ActiveAndPendingInsurance} from "../ActiveAndPendingInsurance";
import {Operations} from "../Operations";
import {Violation} from "../Violation";
import {Performance} from "../Performance";
import {MatchedData} from "../MatchedData";
import {Connection} from "../Connection";
import {VictimIdentity} from "../VictimIdentity";
import Assessments from "../Assessments";
import Insights from "../Insights";

export const Overview = ({companySnapshot, carrierDetails, operation}) => {
  return (
    <Box
      display="flex"
      alignItems="stretch"
      gap="24px"
      pt="32px"
      minH="100%"
      position="relative">
      <SidebarTabs />
      <Box flex="1" minW="0">
        <InfoAccordion>
          <Connection />
          <VictimIdentity />
          <Assessments />
          <Insights />
          <State />
          <Equipment />
          <Authority
            carrierDetails={carrierDetails}
            companySnapshot={companySnapshot}
          />
          <ActiveAndPendingInsurance />
          <Safety data={companySnapshot} />
          <Inspections />
          <Operations companySnapshot={companySnapshot} operation={operation} />
          <Violation />
          <Performance />
          <MatchedData />
        </InfoAccordion>
      </Box>
    </Box>
  );
};
