import {Flex, Box, Text, VStack, Link} from "@chakra-ui/react";
import {DataTable} from "@components/DataTable";

export const MatchedDataSection = ({mcRecordData = {}, dotRecordData = {}}) => (
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
            {mcRecordData?.business_address}
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
            {mcRecordData?.business_phone}
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
            {dotRecordData?.physical_address}
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
            {dotRecordData?.mailing_address}
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
            {dotRecordData?.office_phone}
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
            {dotRecordData?.cell_phone}
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
            {dotRecordData?.email_address}
          </Text>
        </Box>
      </VStack>
    </Box>
  </Flex>
);

export const MatchesSection = ({
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
  matchedByLabel = "Address",
}) => (
  <Box>
    <Text fontSize="16px" fontWeight="600" color="#181D27" mb="12px">
      {title}
    </Text>
    <Flex width={"100%"} flexDirection={"row"} gap="8px">
      {address && (
        <>
          {" "}
          <Text fontSize="14px" color="#6B7280" mb="20px">
            {matchedByLabel}:{" "}
            <strong style={{color: "#175CD3"}}>{address}</strong> matched by{" "}
            {matchedCount} Carriers
          </Text>
        </>
      )}
    </Flex>
    <Box
      bg="white"
      border="1px solid #E5E7EB"
      borderRadius="12px"
      overflow="hidden">
      <DataTable
        headData={headData}
        data={bodyData}
        count={count}
        page={page}
        limit={limit}
        setLimit={setLimit}
        setPage={setPage}
        pagination={false}
        tableProps={{
          layout: "fixed",
          variant: "simple",
          size: "md",
        }}
      />
    </Box>
  </Box>
);
