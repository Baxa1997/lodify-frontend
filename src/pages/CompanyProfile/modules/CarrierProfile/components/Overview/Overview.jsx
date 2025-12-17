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

export const Overview = ({
  companySnapshot,
  carrierDetails,
  operation,
  generalInfo,
}) => {
  const {new_info, performance} = generalInfo;

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
          <Box id="connection-status">
            <Connection new_info={new_info} />
          </Box>
          <Box id="assessment">
            <Assessments />
          </Box>
          <Box id="insights">
            <Insights />
          </Box>
          <Box id="document">
            <VictimIdentity />
          </Box>
          <Box id="lane-preferences">
            <State />
          </Box>
          <Box id="authory">
            <Authority
              new_info={new_info}
              carrierDetails={carrierDetails}
              companySnapshot={companySnapshot}
            />
          </Box>
          <Box id="insurance">
            <ActiveAndPendingInsurance new_info={new_info} />
          </Box>
          <Box id="safety">
            <Safety data={companySnapshot} />
          </Box>
          <Box id="inspections">
            <Inspections new_info={new_info} />
          </Box>
          <Box id="crashes">
            <Equipment />
          </Box>
          <Box id="operations">
            <Operations
              companySnapshot={companySnapshot}
              operation={operation}
            />
          </Box>
          <Box id="certifications">
            <Violation new_info={new_info} />
          </Box>
          <Box id="performane">
            <Performance performanceData={performance} />
          </Box>
          <Box id="matched-data">
            <MatchedData />
          </Box>
        </InfoAccordion>
      </Box>
    </Box>
  );
};
