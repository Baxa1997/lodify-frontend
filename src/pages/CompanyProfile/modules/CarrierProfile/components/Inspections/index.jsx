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

export const Inspections = () => {
  const {headData, bodyData, page, setPage, limit, setLimit, count} =
    useInspectionsProps();

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton>
          <InfoAccordionTitle>Inspections</InfoAccordionTitle>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="24px" align="stretch">
            {/* Inspection Insights Card */}
            <Box
              bg="white"
              border="1px solid #F38744"
              borderRadius="12px"
              p="20px">
              <HStack spacing="12px" align="flex-start" mb="16px">
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="50%"
                  bg="#FEF6EE"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}>
                  <Box
                    as="img"
                    src="/img/info.svg"
                    alt="info"
                    w="16px"
                    h="16px"
                  />
                </Box>
                <Badge
                  bg="#DEFFEE"
                  color="#16B364"
                  px="8px"
                  py="4px"
                  borderRadius="6px"
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

            {/* Metric Cards */}
            <Flex gap="16px" flexWrap={{base: "wrap", md: "nowrap"}}>
              {/* Card 1: Observed vs Reported */}
              <Box
                flex="1"
                bg="#F9FAFB"
                border="1px solid #E5E7EB"
                borderRadius="12px"
                p="20px"
                minW="0">
                <Text fontSize="24px" fontWeight="600" color="#16B364" mb="8px">
                  782/586
                </Text>
                <Text fontSize="14px" color="#6B7280" lineHeight="1.5">
                  Observed vs Reported Power Units in Fleet
                </Text>
              </Box>

              {/* Card 2: Percentile Ranking */}
              <Box
                flex="1"
                bg="#F9FAFB"
                border="1px solid #E5E7EB"
                borderRadius="12px"
                p="20px"
                minW="0">
                <HStack spacing="8px" align="center" mb="8px">
                  <Text
                    fontSize="24px"
                    fontWeight="600"
                    color="#16B364"
                    lineHeight="1">
                    Top 30%
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
                <Text fontSize="14px" color="#6B7280" lineHeight="1.5">
                  Percentile Ranking Compared to Peers
                </Text>
              </Box>

              {/* Card 3: Length of Authority */}
              <Box
                flex="1"
                bg="#F9FAFB"
                border="1px solid #E5E7EB"
                borderRadius="12px"
                p="20px"
                minW="0">
                <Text fontSize="24px" fontWeight="600" color="#16B364" mb="8px">
                  24+ months
                </Text>
                <Text fontSize="14px" color="#6B7280" lineHeight="1.5">
                  Length of Authority
                </Text>
              </Box>
            </Flex>

            {/* Inspection History Section */}
            <Box>
              <Text fontSize="16px" fontWeight="600" color="#181D27" mb="16px">
                Inspection History
              </Text>
              <DataTable
                headData={headData}
                data={bodyData}
                pagination
                border="1px solid"
                borderColor="gray.border-main"
                borderRadius="12px"
                count={count}
                page={page}
                limit={limit}
                setLimit={setLimit}
                setPage={setPage}
                tableProps={{
                  layout: "fixed",
                }}
              />
            </Box>
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
