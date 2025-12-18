import React from "react";
import {Box, Text, VStack} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {useMatchedDataProps} from "./useMatchedDataProps";
import {MatchesSection} from "./components/MatchedSection";

export const MatchedData = () => {
  const {
    addressMatchesHeadData,
    addressMatchesBodyData,
    addressMatchesCount,
    addressMatchesPage,
    setAddressMatchesPage,
    addressMatchesLimit,
    setAddressMatchesLimit,
    addressMatchesContacts,
  } = useMatchedDataProps();
  console.log(
    "addressMatchesContactsaddressMatchesContacts",
    addressMatchesContacts
  );
  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton>
          <InfoAccordionTitle>Matched Date</InfoAccordionTitle>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="32px" align="stretch">
            {/* <MatchedDateSection /> */}

            <MatchesSection
              title="Physical Address Matches"
              address={
                addressMatchesBodyData?.physical_address?.[0]?.physical_address
              }
              matchedByLabel="Address"
              matchedCount={addressMatchesBodyData?.physical_address?.length}
              headData={addressMatchesHeadData}
              bodyData={addressMatchesBodyData?.physical_address}
              count={addressMatchesCount}
              page={addressMatchesPage}
              setPage={setAddressMatchesPage}
              limit={addressMatchesLimit}
              setLimit={setAddressMatchesLimit}
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
              count={addressMatchesCount}
              page={addressMatchesPage}
              setPage={setAddressMatchesPage}
              limit={addressMatchesLimit}
              setLimit={setAddressMatchesLimit}
            />

            <MatchesSection
              title="Email Address Matches"
              matchedCount={addressMatchesContacts?.email?.length}
              matchedByLabel="Email Address"
              address={addressMatchesContacts?.email?.[0]?.email}
              headData={addressMatchesHeadData}
              bodyData={addressMatchesContacts?.email}
              count={addressMatchesCount}
              page={addressMatchesPage}
              limit={addressMatchesLimit}
              setLimit={setAddressMatchesLimit}
            />

            <MatchesSection
              title="Phone Number Matches"
              matchedCount={addressMatchesContacts?.phone?.length}
              matchedByLabel="Phone Number"
              address={addressMatchesContacts?.phone?.[0]?.phone}
              headData={addressMatchesHeadData}
              bodyData={addressMatchesContacts?.phone}
              count={addressMatchesCount}
              page={addressMatchesPage}
              limit={addressMatchesLimit}
              setLimit={setAddressMatchesLimit}
            />
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
