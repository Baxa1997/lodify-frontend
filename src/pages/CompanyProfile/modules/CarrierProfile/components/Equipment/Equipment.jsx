import {Box, Flex, Text, HStack, VStack, Badge} from "@chakra-ui/react";
import {useEquipmentProps} from "./useEquipmentProps";
import {DataTable} from "@components/DataTable";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {InfoCard} from "../InfoCard";

export const Equipment = () => {
  const {headData, bodyData, page, setPage, limit, setLimit, count} =
    useEquipmentProps();

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton>
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
              <InfoCard title="Preferred Areas" badgeText="27 States" />
              <InfoCard
                title="Cross Border"
                badgeText="No Preferred Lanes"
                isEmpty
              />
            </Flex>

            <Box>
              <Text fontSize="16px" fontWeight="600" color="#181D27" mb="16px">
                Average Fleet Age
              </Text>
              <Flex gap="16px" flexWrap={{base: "wrap", md: "nowrap"}}>
                <Box
                  flex="1"
                  bg="white"
                  border="1px solid #E5E7EB"
                  borderRadius="12px"
                  p="20px"
                  minW={{base: "100%", md: "200px"}}>
                  <HStack spacing="12px" mb="12px">
                    <Box
                      as="img"
                      src="/img/truck.svg"
                      alt="truck"
                      w="24px"
                      h="24px"
                      color="#EF4444"
                    />
                    <Text fontSize="18px" fontWeight="600" color="#181D27">
                      2 years old
                    </Text>
                  </HStack>
                  <Badge
                    bg="#DEFFEE"
                    color="#16B364"
                    px="8px"
                    py="4px"
                    borderRadius="6px"
                    fontSize="12px"
                    fontWeight="600"
                    mb="8px"
                    display="inline-block">
                    Top 10%
                  </Badge>
                  <Text fontSize="12px" color="#6B7280" fontWeight="400">
                    Percentile Ranking Compared to Peers
                  </Text>
                </Box>

                <Box
                  flex="1"
                  bg="white"
                  border="1px solid #E5E7EB"
                  borderRadius="12px"
                  p="20px"
                  minW={{base: "100%", md: "200px"}}>
                  <HStack spacing="12px" mb="12px">
                    <Box
                      as="img"
                      src="/img/truck.svg"
                      alt="truck"
                      w="24px"
                      h="24px"
                      color="#EF4444"
                    />
                    <Text fontSize="18px" fontWeight="600" color="#181D27">
                      4 years old
                    </Text>
                  </HStack>
                  <Badge
                    bg="#DEFFEE"
                    color="#16B364"
                    px="8px"
                    py="4px"
                    borderRadius="6px"
                    fontSize="12px"
                    fontWeight="600"
                    mb="8px"
                    display="inline-block">
                    Top 30%
                  </Badge>
                  <Text fontSize="12px" color="#6B7280" fontWeight="400">
                    Percentile Ranking Compared to Peers
                  </Text>
                </Box>

                <Box
                  flex="1"
                  bg="white"
                  border="1px solid #E5E7EB"
                  borderRadius="12px"
                  p="20px"
                  minW={{base: "100%", md: "200px"}}>
                  <HStack spacing="12px" mb="12px">
                    <Box
                      as="img"
                      src="/img/truck.svg"
                      alt="truck"
                      w="24px"
                      h="24px"
                      color="#EF4444"
                    />
                    <Text fontSize="18px" fontWeight="600" color="#181D27">
                      Less than 1 year old
                    </Text>
                  </HStack>
                  <Badge
                    bg="#DEFFEE"
                    color="#16B364"
                    px="8px"
                    py="4px"
                    borderRadius="6px"
                    fontSize="12px"
                    fontWeight="600"
                    mb="8px"
                    display="inline-block">
                    Top 10%
                  </Badge>
                  <Text fontSize="12px" color="#6B7280" fontWeight="400">
                    Percentile Ranking Compared to Peers
                  </Text>
                </Box>
              </Flex>
            </Box>

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
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
