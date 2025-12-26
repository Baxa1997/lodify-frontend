import React from "react";
import {Box, VStack} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {useMatchedDataProps} from "./useMatchedDataProps";
import {MatchesSection} from "./components/MatchedSection";

export const MatchedData = ({
  vinMatchesData,
  addressMatchesBodyData,
  ipMatchesData,
  contactsMatchesData,
}) => {
  const {addressMatchesHeadData, addressMatchesContacts} =
    useMatchedDataProps();

  const {email, phone, company_officer_1, company_officer_2} =
    contactsMatchesData || {};

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton>
          <InfoAccordionTitle>Matched Date</InfoAccordionTitle>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="32px" align="stretch">
            <MatchesSection
              title="Physical Address Matches"
              address={
                addressMatchesBodyData?.physical_address?.[0]?.physical_address
              }
              matchedByLabel="Address"
              matchedCount={addressMatchesBodyData?.physical_address?.length}
              headData={addressMatchesHeadData}
              bodyData={addressMatchesBodyData?.physical_address}
            />

            <MatchesSection
              title="Mailing Address Matches"
              matchedByLabel="Address"
              matchedCount={addressMatchesBodyData?.mailing_address?.length}
              address={
                addressMatchesBodyData?.mailing_address?.[0]?.mailing_address
              }
              headData={addressMatchesHeadData}
              bodyData={addressMatchesBodyData?.mailing_address}
            />

            <MatchesSection
              title="Email Address Matches"
              matchedCount={addressMatchesContacts?.email?.length}
              matchedByLabel="Email Address"
              address={addressMatchesContacts?.email?.[0]?.email}
              headData={addressMatchesHeadData}
              bodyData={addressMatchesContacts?.email}
            />

            <MatchesSection
              title="VIN Matches"
              matchedCount={vinMatchesData?.length}
              matchedByLabel="VIN"
              address={vinMatchesData?.[0]?.vin}
              headData={addressMatchesHeadData}
              bodyData={vinMatchesData}
            />

            <MatchesSection
              title="Phone Number Matches"
              matchedCount={addressMatchesContacts?.phone?.length}
              matchedByLabel="Phone Number"
              address={addressMatchesContacts?.phone?.[0]?.phone}
              headData={addressMatchesHeadData}
              bodyData={addressMatchesContacts?.phone}
            />

            <MatchesSection
              title="IP Address Matches"
              matchedByLabel="IP Address"
              matchedCount={ipMatchesData?.length}
              address={ipMatchesData?.[0]?.ip_address}
              headData={addressMatchesHeadData}
              bodyData={ipMatchesData}
            />

            {email && email.length > 0 && (
              <MatchesSection
                title="Email Matches"
                matchedByLabel="Email"
                matchedCount={email?.length}
                address={email?.[0]?.email}
                headData={addressMatchesHeadData}
                bodyData={email}
              />
            )}

            {phone && phone.length > 0 && (
              <MatchesSection
                title="Phone Matches"
                matchedByLabel="Phone"
                matchedCount={phone?.length}
                address={phone?.[0]?.phone}
                headData={addressMatchesHeadData}
                bodyData={phone}
              />
            )}

            {company_officer_1 && company_officer_1.length > 0 && (
              <MatchesSection
                title="Company Officer 1 Matches"
                matchedByLabel="Officer Name"
                matchedCount={company_officer_1?.length}
                address={
                  company_officer_1?.[0]?.name ||
                  company_officer_1?.[0]?.officer_name ||
                  company_officer_1?.[0]?.contact
                }
                headData={addressMatchesHeadData}
                bodyData={company_officer_1}
              />
            )}

            {company_officer_2 && company_officer_2.length > 0 && (
              <MatchesSection
                title="Company Officer 2 Matches"
                matchedByLabel="Officer Name"
                matchedCount={company_officer_2?.length}
                address={
                  company_officer_2?.[0]?.name ||
                  company_officer_2?.[0]?.officer_name ||
                  company_officer_2?.[0]?.contact
                }
                headData={addressMatchesHeadData}
                bodyData={company_officer_2}
              />
            )}
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
