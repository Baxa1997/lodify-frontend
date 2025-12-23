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
import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "react-router-dom";
import carrierService from "@services/carrierService";

export const Overview = ({carrierDetails, generalInfo}) => {
  const [searchParams] = useSearchParams();
  const {new_info, performance} = generalInfo;
  const companies_id = searchParams.get("id");

  const {data: vinMatchesData} = useQuery({
    queryKey: ["GET_VIN_MATCHES_DATA", companies_id],
    queryFn: () =>
      carrierService.getMatchedData({
        data: {
          method: "vin",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => res?.data?.response || [],
    enabled: Boolean(companies_id),
  });

  const {data: addressMatchesBodyData} = useQuery({
    queryKey: ["GET_ADDRESS_MATCHES_DATA", companies_id],
    queryFn: () =>
      carrierService.getMatchedData({
        data: {
          method: "addresses",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(companies_id),
  });

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
            <Insights
              new_info={new_info}
              vinMatchesData={vinMatchesData}
              addressMatchesBodyData={addressMatchesBodyData}
            />
          </Box>
          <Box id="victim-identity">
            <VictimIdentity />
          </Box>
          <Box id="state">
            <State />
          </Box>
          <Box id="authority">
            <Authority new_info={new_info} carrierDetails={carrierDetails} />
          </Box>
          <Box id="insurance">
            <ActiveAndPendingInsurance new_info={new_info} />
          </Box>
          <Box id="safety">
            <Safety />
          </Box>
          <Box id="inspections">
            <Inspections new_info={new_info} />
          </Box>
          <Box id="equipment">
            <Equipment />
          </Box>
          <Box id="operations">
            <Operations new_info={new_info} />
          </Box>
          <Box id="certifications">
            <Violation new_info={new_info} />
          </Box>
          <Box id="performane">
            <Performance performanceData={performance} />
          </Box>
          <Box id="matched-data">
            <MatchedData
              ipMatchesData={addressMatchesBodyData?.ip_address}
              vinMatchesData={vinMatchesData}
              addressMatchesBodyData={addressMatchesBodyData}
            />
          </Box>
        </InfoAccordion>
      </Box>
    </Box>
  );
};
