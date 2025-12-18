import React from "react";
import {
  Box,
  Text,
  Flex,
  HStack,
  VStack,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {DataTable} from "@components/DataTable";
import {useInspectionsProps} from "./useInspectionsProps";

export const Inspections = ({new_info}) => {
  const {
    headData,
    inspectionsData,
    page,
    setPage,
    limit,
    setLimit,
    count,
    isLoading,
    isFetching,
    inspectionsCountData,
    refetch,
    refetchInspectionsCount,
  } = useInspectionsProps();
  console.log(
    "inspectionsCountDatainspectionsCountData",
    inspectionsCountData,
    new_info
  );
  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton
          onClick={refetchInspectionsCount}
          isLoading={isFetching}>
          <InfoAccordionTitle>Inspections</InfoAccordionTitle>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="24px" align="stretch">
            <Box
              bg="white"
              border="1px solid #F38744"
              borderRadius="12px"
              p="16px">
              <HStack
                spacing="12px"
                align="flex-start"
                alignItems="center"
                mb="8px">
                <Box
                  w="38px"
                  h="38px"
                  borderRadius="50%"
                  bg="#FEF6EE"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}>
                  <Box
                    as="img"
                    src="/img/inspectionsIcon.svg"
                    alt="info"
                    w="38px"
                    h="38px"
                  />
                </Box>
                <Badge
                  bg="#17B26A"
                  color="#fff"
                  px="8px"
                  py="4px"
                  textTransform="capitalize"
                  borderRadius="24px"
                  fontSize="12px"
                  fontWeight="600">
                  Good Inspection-to-Fleet Ratio
                </Badge>
              </HStack>
              <Text fontSize="16px" fontWeight="600" color="#181D27" mb="8px">
                Inspection Insights
              </Text>
              <Text fontSize="14px" color="#6B7280" lineHeight="1.5">
                This carrier has an above average number of inspections per its
                fleet size.
              </Text>
            </Box>

            <Flex gap="16px" flexWrap={{base: "wrap", md: "nowrap"}}>
              <Box
                flex="1"
                bg="#fff"
                border="1px solid #E5E7EB"
                borderRadius="12px"
                p="14px"
                minW="0">
                <Text
                  fontSize="24px"
                  h="32px"
                  fontWeight="600"
                  color="#079455"
                  mb="8px">
                  {inspectionsCountData?.inspection_count}/
                  {new_info?.power_units}
                </Text>
                <Text fontSize="13px" color="#6B7280" lineHeight="1.5">
                  Observed vs Reported Power Units in Fleet
                </Text>
              </Box>

              <Box
                flex="1"
                bg="#fff"
                border="1px solid #E5E7EB"
                borderRadius="12px"
                p="14px"
                minW="0">
                <HStack spacing="8px" align="center" mb="8px">
                  <Text
                    fontSize="24px"
                    fontWeight="600"
                    color="#079455"
                    lineHeight="1"
                    h="32px">
                    Top {inspectionsCountData?.top_percent?.toFixed(0) || 0}%
                  </Text>
                  <Tooltip
                    label="Percentile Ranking Compared to Peers"
                    placement="top"
                    bg="#1a365d"
                    color="white"
                    borderRadius="md"
                    p="6px 10px"
                    fontSize="12px">
                    <Box
                      as="img"
                      src="/img/questionRound.svg"
                      alt="info"
                      w="14px"
                      h="14px"
                      cursor="pointer"
                    />
                  </Tooltip>
                </HStack>
                <Text fontSize="13px" color="#6B7280" lineHeight="1.5">
                  Percentile Ranking Compared to Peers
                </Text>
              </Box>
              {/* 
              <Box
                flex="1"
                bg="#fff"
                border="1px solid #E5E7EB"
                borderRadius="12px"
                p="14px"
                minW="0">
                <Text
                  h="32px"
                  fontSize="24px"
                  fontWeight="600"
                  color="#079455"
                  mb="8px">
                  24+ months
                </Text>
                <Text fontSize="13px" color="#6B7280" lineHeight="1.5">
                  Length of Authority
                </Text>
              </Box> */}
            </Flex>

            <Box>
              <Text fontSize="16px" fontWeight="600" color="#181D27" mb="16px">
                Inspection History
              </Text>
              <Box
                border="1px solid #E5E7EB"
                borderRadius="12px"
                overflow="hidden">
                <DataTable
                  headData={headData}
                  data={inspectionsData?.response || []}
                  pagination
                  count={inspectionsData?.total_count || 0}
                  page={page}
                  limit={limit}
                  height="500px"
                  setLimit={setLimit}
                  setPage={setPage}
                  refetch={refetch}
                  isLoading={isLoading}
                  tableProps={{
                    layout: "fixed",
                  }}
                />
              </Box>
            </Box>
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
