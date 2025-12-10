import {
  Box,
  Flex,
  Text,
  HStack,
  VStack,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import {useEquipmentProps} from "./useEquipmentProps";
import {DataTable} from "@components/DataTable";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {InfoCard} from "../InfoCard";
import {LuChevronUp, LuChevronDown} from "react-icons/lu";

export const Equipment = () => {
  const {
    headData,
    bodyData,
    page,
    setPage,
    limit,
    setLimit,
    count,
    getEquipmentData,
    isLoading,
  } = useEquipmentProps();

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton onClick={getEquipmentData}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between">
            <InfoAccordionTitle>Equipment</InfoAccordionTitle>
          </Box>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="20px" align="stretch">
            <Flex gap="20px" flexWrap={{base: "wrap", md: "nowrap"}}>
              <Box
                flex="1"
                bg="#F9FAFB"
                border="1px solid #E5E7EB"
                borderRadius="12px"
                p="20px">
                <Text
                  fontSize="16px"
                  fontWeight="600"
                  color="#181D27"
                  mb="20px">
                  Preferred Areas
                </Text>
                <Badge
                  bg="#F3F4F6"
                  color="#374151"
                  px="12px"
                  py="4px"
                  borderRadius="16px"
                  fontSize="12px"
                  fontWeight="500">
                  27 States
                </Badge>
              </Box>
              <Box
                flex="1"
                bg="#F9FAFB"
                border="1px solid #E5E7EB"
                borderRadius="12px"
                p="20px">
                <Text
                  fontSize="16px"
                  fontWeight="600"
                  color="#181D27"
                  mb="20px">
                  Cross Border
                </Text>
                <Badge
                  bg="#F3F4F6"
                  color="#374151"
                  px="12px"
                  py="4px"
                  borderRadius="16px"
                  fontSize="12px"
                  fontWeight="500">
                  No Preferred Lanes
                </Badge>
              </Box>
            </Flex>

            <Box
              bg="white"
              border="1px solid #E5E7EB"
              borderRadius="12px"
              p="20px">
              <Text fontSize="16px" fontWeight="600" color="#181D27" mb="20px">
                Average Fleet Age
              </Text>
              <Flex gap="16px" flexWrap={{base: "wrap", md: "nowrap"}}>
                <Box
                  flex="1"
                  bg="#F9FAFB"
                  border="1px solid #E5E7EB"
                  borderRadius="12px"
                  p="20px"
                  minW={{base: "100%", md: "200px"}}>
                  <Box
                    as="img"
                    src="/img/truck.svg"
                    alt="truck"
                    w="24px"
                    h="24px"
                    filter="brightness(0) saturate(100%) invert(60%) sepia(95%) saturate(2000%) hue-rotate(0deg) brightness(100%) contrast(100%)"
                  />
                  <HStack spacing="12px" mb="12px">
                    <Text fontSize="18px" fontWeight="600" color="#181D27">
                      2 years old
                    </Text>
                  </HStack>
                  <HStack spacing="8px" mb="8px">
                    <Badge
                      bg="#DEFFEE"
                      color="#16B364"
                      px="8px"
                      py="2px"
                      borderRadius="4px"
                      fontSize="11px"
                      fontWeight="600">
                      Top 10%
                    </Badge>
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
                  <Text fontSize="12px" color="#6B7280" fontWeight="400">
                    Percentile Ranking Compared to Peers
                  </Text>
                </Box>

                <Box
                  flex="1"
                  bg="#F9FAFB"
                  border="1px solid #E5E7EB"
                  borderRadius="12px"
                  p="20px"
                  minW={{base: "100%", md: "200px"}}>
                  <Box
                    as="img"
                    src="/img/truck.svg"
                    alt="truck"
                    w="24px"
                    h="24px"
                    filter="brightness(0) saturate(100%) invert(60%) sepia(95%) saturate(2000%) hue-rotate(0deg) brightness(100%) contrast(100%)"
                  />
                  <HStack spacing="12px" mb="12px">
                    <Text fontSize="18px" fontWeight="600" color="#181D27">
                      4 years old
                    </Text>
                  </HStack>
                  <HStack spacing="8px" mb="8px">
                    <Badge
                      bg="#DEFFEE"
                      color="#16B364"
                      px="8px"
                      py="2px"
                      borderRadius="4px"
                      fontSize="11px"
                      fontWeight="600">
                      Top 30%
                    </Badge>
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
                  <Text fontSize="12px" color="#6B7280" fontWeight="400">
                    Percentile Ranking Compared to Peers
                  </Text>
                </Box>

                <Box
                  flex="1"
                  bg="#F9FAFB"
                  border="1px solid #E5E7EB"
                  borderRadius="12px"
                  p="20px"
                  minW={{base: "100%", md: "200px"}}>
                  <Box
                    as="img"
                    src="/img/truck.svg"
                    alt="truck"
                    w="24px"
                    h="24px"
                    filter="brightness(0) saturate(100%) invert(60%) sepia(95%) saturate(2000%) hue-rotate(0deg) brightness(100%) contrast(100%)"
                  />
                  <HStack spacing="12px" mb="12px">
                    <Text fontSize="18px" fontWeight="600" color="#181D27">
                      Less than 1 years old
                    </Text>
                  </HStack>
                  <HStack spacing="8px" mb="8px">
                    <Badge
                      bg="#DEFFEE"
                      color="#16B364"
                      px="8px"
                      py="2px"
                      borderRadius="4px"
                      fontSize="11px"
                      fontWeight="600">
                      Top 10%
                    </Badge>
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
                  <Text fontSize="12px" color="#6B7280" fontWeight="400">
                    Percentile Ranking Compared to Peers
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Box
              bg="white"
              border="1px solid #E5E7EB"
              borderRadius="12px"
              overflow="hidden">
              <Box
                overflowX="auto"
                overflowY="auto"
                maxH="500px"
                flex="1"
                minH="0">
                <DataTable
                  headData={headData}
                  data={bodyData}
                  pagination
                  count={count}
                  page={page}
                  limit={limit}
                  setLimit={setLimit}
                  setPage={setPage}
                  isLoading={isLoading}
                  tableProps={{
                    layout: "fixed",
                    variant: "simple",
                    minW: "max-content",
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
