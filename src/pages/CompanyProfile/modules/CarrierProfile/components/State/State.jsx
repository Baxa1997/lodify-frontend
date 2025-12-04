import {Box, Flex, Text, HStack, VStack} from "@chakra-ui/react";
import {
  InfoAccordionButton,
  InfoAccordionDescription,
  InfoAccordionItem,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {USMap} from "./USMap";
import {InfoCard} from "../InfoCard";

export const State = () => {
  return (
    <InfoAccordionItem>
      <InfoAccordionButton>
        <Flex flexDir="column" alignItems="flex-start" gap="4px">
          <InfoAccordionTitle>State</InfoAccordionTitle>
          <InfoAccordionDescription>
            Origin and Destination based on current search criteria
          </InfoAccordionDescription>
        </Flex>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        <Box>
          <Flex gap="20px">
            <InfoCard title="Preferred Areas" badgeText="27 States" />
            <InfoCard
              title="Cross Border"
              badgeText="No Preferrred Lanes"
              isEmpty
            />
          </Flex>

          <Box mt="20px" display="flex" justifyContent="center">
            <USMap />
          </Box>

          <Box
            mt="24px"
            bg="white"
            border="1px solid #E5E7EB"
            borderRadius="12px"
            p="20px">
            <Flex gap="60px" mb="20px" justify="space-between">
              <Text fontSize="14px" fontWeight="600" color="#181D27">
                Legend
              </Text>
              <Text fontSize="14px" fontWeight="600" color="#181D27">
                Inspections in last 24 month
              </Text>
            </Flex>
            <Box
              display="grid"
              gridTemplateColumns="repeat(4, 1fr)"
              gap="14px 30px">
              <Flex flexDir="column" gap="12px">
                <HStack spacing="12px" align="center">
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="50%"
                    border="2px solid #EF4444"
                    bg="transparent"
                    flexShrink={0}
                  />
                  <Text fontSize="13px" color="#181D27" fontWeight="400">
                    Recently Logged by ELD
                  </Text>
                </HStack>

                <HStack spacing="12px" align="center">
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="50%"
                    bg="#9CA3AF"
                    flexShrink={0}
                  />
                  <Text fontSize="13px" color="#181D27" fontWeight="400">
                    Univerified Vehicle
                  </Text>
                </HStack>
              </Flex>

              <Flex flexDir="column" gap="12px">
                <HStack spacing="12px" align="center">
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="50%"
                    border="2px solid #1570EF"
                    bg="transparent"
                    flexShrink={0}
                  />
                  <Text fontSize="13px" color="#181D27" fontWeight="400">
                    Historical Inspection
                  </Text>
                </HStack>

                <HStack spacing="12px" align="center">
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="50%"
                    bg="#000000"
                    position="relative"
                    flexShrink={0}>
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      w="7px"
                      h="7px"
                      borderRadius="50%"
                      bg="white"
                    />
                  </Box>
                  <Text fontSize="13px" color="#181D27" fontWeight="400">
                    Carrier HQ / Terminal
                  </Text>
                </HStack>
              </Flex>

              <Flex flexDir="column" gap="12px">
                <HStack spacing="12px" align="center">
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="3px"
                    position="relative"
                    overflow="hidden"
                    flexShrink={0}
                    style={{
                      background: `repeating-linear-gradient(
                      45deg,
                      #D4A574 0px,
                      #D4A574 2.5px,
                      #B8865B 2.5px,
                      #B8865B 5px
                    )`,
                    }}
                  />
                  <Text fontSize="13px" color="#181D27" fontWeight="400">
                    Preferred Lane
                  </Text>
                </HStack>

                <HStack spacing="12px" align="center">
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="3px"
                    bg="#E6A85C"
                    flexShrink={0}
                  />
                  <Text fontSize="13px" color="#181D27" fontWeight="400">
                    1-5 Inspections
                  </Text>
                </HStack>
              </Flex>

              <Flex flexDir="column" gap="12px">
                <HStack spacing="12px" align="center">
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="3px"
                    bg="#FF8C42"
                    flexShrink={0}
                  />
                  <Text fontSize="13px" color="#181D27" fontWeight="400">
                    6-9 Inspections
                  </Text>
                </HStack>

                <HStack spacing="12px" align="center">
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="3px"
                    bg="#E85D3D"
                    flexShrink={0}
                  />
                  <Text fontSize="13px" color="#181D27" fontWeight="400">
                    10+ Inspections
                  </Text>
                </HStack>
              </Flex>
            </Box>
          </Box>
        </Box>
      </InfoAccordionPanel>
    </InfoAccordionItem>
  );
};
