import React from "react";
import {Box, Text, Flex, VStack, HStack, Link} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {DataTable} from "@components/DataTable";
import {useMatchedDataProps} from "./useMatchedDataProps";

export const MatchedData = () => {
  const {
    mcRecordData,
    dotRecordData,
    addressMatchesData,
    vinMatchesData,
    ipMatchesData,
    addressMatchesHeadData,
    addressMatchesBodyData,
    addressMatchesCount,
    addressMatchesPage,
    setAddressMatchesPage,
    addressMatchesLimit,
    setAddressMatchesLimit,
  } = useMatchedDataProps();

  const MatchedDateSection = () => (
    <Flex gap="24px" flexWrap={{base: "wrap", md: "nowrap"}}>
      <Box
        flex="1"
        bg="white"
        border="1px solid #E5E7EB"
        borderRadius="12px"
        p="24px"
        minW="0">
        <Text fontSize="16px" fontWeight="600" color="#181D27" mb="20px">
          Carrier MC Record (L&I)
        </Text>
        <VStack spacing="16px" align="stretch">
          <Box>
            <Text fontSize="14px" fontWeight="500" color="#6B7280" mb="8px">
              Business Address
            </Text>
            <Text fontSize="14px" color="#181D27" mb="4px">
              {mcRecordData.businessAddress}
            </Text>
            <Link
              href="#"
              fontSize="14px"
              color="#175CD3"
              fontWeight="500"
              _hover={{textDecoration: "underline"}}>
              View on Map
            </Link>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" color="#6B7280" mb="8px">
              Business Phone
            </Text>
            <Text fontSize="14px" color="#181D27" mb="4px">
              {mcRecordData.businessPhone}
            </Text>
            <Link
              href="#"
              fontSize="14px"
              color="#175CD3"
              fontWeight="500"
              _hover={{textDecoration: "underline"}}>
              View on Map
            </Link>
          </Box>
        </VStack>
      </Box>

      <Box
        flex="1"
        bg="white"
        border="1px solid #E5E7EB"
        borderRadius="12px"
        p="24px"
        minW="0">
        <Text fontSize="16px" fontWeight="600" color="#181D27" mb="20px">
          Carrier DOT Record (SAFER)
        </Text>
        <VStack spacing="16px" align="stretch">
          <Box>
            <Text fontSize="14px" fontWeight="500" color="#6B7280" mb="8px">
              Physical Address
            </Text>
            <Text fontSize="14px" color="#181D27" mb="4px">
              {dotRecordData.physicalAddress}
            </Text>
            <Link
              href="#"
              fontSize="14px"
              color="#175CD3"
              fontWeight="500"
              _hover={{textDecoration: "underline"}}>
              View on Map
            </Link>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" color="#6B7280" mb="8px">
              Mailing Address
            </Text>
            <Text fontSize="14px" color="#181D27" mb="4px">
              {dotRecordData.mailingAddress}
            </Text>
            <Link
              href="#"
              fontSize="14px"
              color="#175CD3"
              fontWeight="500"
              _hover={{textDecoration: "underline"}}>
              View on Map
            </Link>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" color="#6B7280" mb="8px">
              Office Phone
            </Text>
            <Text fontSize="14px" color="#181D27" mb="4px">
              {dotRecordData.officePhone}
            </Text>
            <Link
              href="#"
              fontSize="14px"
              color="#175CD3"
              fontWeight="500"
              _hover={{textDecoration: "underline"}}>
              View on Map
            </Link>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" color="#6B7280" mb="8px">
              Cell Phone
            </Text>
            <Text fontSize="14px" color="#181D27" mb="4px">
              {dotRecordData.cellPhone}
            </Text>
            <Link
              href="#"
              fontSize="14px"
              color="#175CD3"
              fontWeight="500"
              _hover={{textDecoration: "underline"}}>
              View on Map
            </Link>
          </Box>
          <Box>
            <Text fontSize="14px" fontWeight="500" color="#6B7280" mb="8px">
              Email Address
            </Text>
            <Text fontSize="14px" color="#181D27">
              {dotRecordData.emailAddress}
            </Text>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );

  const MatchesSection = ({
    title,
    address,
    matchedCount,
    headData,
    bodyData,
    count,
    page,
    setPage,
    limit,
    setLimit,
  }) => (
    <Box>
      <Text fontSize="16px" fontWeight="600" color="#181D27" mb="12px">
        {title}
      </Text>
      <Text fontSize="14px" color="#6B7280" mb="20px">
        Adress:{" "}
        <Text as="span" fontWeight="600" color="#175CD3">
          {address}
        </Text>{" "}
        matched by {matchedCount} Carriers
      </Text>
      <Box
        bg="white"
        border="1px solid #E5E7EB"
        borderRadius="12px"
        overflow="hidden">
        <DataTable
          headData={headData}
          data={bodyData}
          pagination
          count={count}
          page={page}
          limit={limit}
          setLimit={setLimit}
          setPage={setPage}
          tableProps={{
            layout: "fixed",
            variant: "simple",
            size: "md",
          }}
        />
      </Box>
    </Box>
  );

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton>
          <InfoAccordionTitle>Matched Date</InfoAccordionTitle>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="32px" align="stretch">
            <MatchedDateSection />

            <MatchesSection
              title="Address Matches"
              address="606 Hillrose ave, Dayton, OH 45404"
              matchedCount={13}
              headData={addressMatchesHeadData}
              bodyData={addressMatchesBodyData}
              count={addressMatchesCount}
              page={addressMatchesPage}
              setPage={setAddressMatchesPage}
              limit={addressMatchesLimit}
              setLimit={setAddressMatchesLimit}
            />

            <MatchesSection
              title="VIN Matches"
              address="606 Hillrose ave, Dayton, OH 45404"
              matchedCount={13}
              headData={addressMatchesHeadData}
              bodyData={vinMatchesData}
              count={addressMatchesCount}
              page={addressMatchesPage}
              setPage={setAddressMatchesPage}
              limit={addressMatchesLimit}
              setLimit={setAddressMatchesLimit}
            />

            <MatchesSection
              title="IP Address Matches"
              address="606 Hillrose ave, Dayton, OH 45404"
              matchedCount={13}
              headData={addressMatchesHeadData}
              bodyData={ipMatchesData}
              count={addressMatchesCount}
              page={addressMatchesPage}
              setPage={setAddressMatchesPage}
              limit={addressMatchesLimit}
              setLimit={setAddressMatchesLimit}
            />
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
