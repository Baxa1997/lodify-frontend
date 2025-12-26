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
import {useState, useEffect} from "react";
import carrierService from "@services/carrierService";

export const Overview = ({carrierDetails, generalInfo}) => {
  const [searchParams] = useSearchParams();
  const {new_info, performance} = generalInfo;
  const companies_id = searchParams.get("id");
  const [accordionIndex, setAccordionIndex] = useState([]);

  useEffect(() => {
    setAccordionIndex([]);
  }, [companies_id]);

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

  const {data: contactsMatchesData} = useQuery({
    queryKey: ["GET_CONTACTS_MATCHES_DATA", companies_id],
    queryFn: () =>
      carrierService.getMatchedData({
        data: {
          method: "contact",
          object_data: {
            companies_id: companies_id,
          },
          table: "matches",
        },
      }),
    select: (res) => res?.data || {},
    enabled: Boolean(companies_id),
  });

  const {data: pendingInsuranceData} = useQuery({
    queryKey: [
      "GET_PENDING_INSURANCE_DATA",
      companies_id,
      new_info?.dot_number,
    ],
    queryFn: () =>
      carrierService.getCarrierInfo({
        data: {
          method: "list",
          object_data: {
            dot_number: new_info?.dot_number,
            companies_id: companies_id,
          },
          table: "insurance",
        },
      }),
    select: (res) => res?.data?.response || [],
    enabled: Boolean(companies_id && new_info?.dot_number),
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
        <InfoAccordion index={accordionIndex} onChange={setAccordionIndex}>
          <Box id="connection-status">
            <Connection new_info={new_info} />
          </Box>
          <Box id="assessment">
            <Assessments />
          </Box>
          <Box id="insights" key={`insights-wrapper-${companies_id}`}>
            <Insights
              new_info={new_info}
              vinMatchesData={vinMatchesData}
              contactsMatchesData={contactsMatchesData}
              addressMatchesBodyData={addressMatchesBodyData}
              pendingInsuranceData={pendingInsuranceData}
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
            <ActiveAndPendingInsurance
              new_info={new_info}
              pendingInsuranceData={pendingInsuranceData}
            />
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
              contactsMatchesData={contactsMatchesData}
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
