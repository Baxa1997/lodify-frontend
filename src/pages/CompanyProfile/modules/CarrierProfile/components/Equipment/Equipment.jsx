import {Box, Flex, Text, HStack, VStack, Badge} from "@chakra-ui/react";
import {useEquipmentProps} from "./useEquipmentProps";
import {DataTable} from "@components/DataTable";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";

export const Equipment = () => {
  const {
    fleetStatsData,
    headData,
    bodyData,
    page,
    setPage,
    limit,
    setLimit,
    count,
    getEquipmentData,
    isLoading,
    ageCards,
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
                bg="#fff"
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
                  bg="#fff"
                  color="#374151"
                  border="1px solid #535862"
                  px="12px"
                  textTransform="capitalize"
                  py="4px"
                  borderRadius="16px"
                  fontSize="12px"
                  fontWeight="500">
                  27 States
                </Badge>
              </Box>
              <Box
                flex="1"
                bg="#fff"
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
                  bg="#fff"
                  color="#374151"
                  border="1px solid #E5E7EB"
                  py="4px"
                  px="12px"
                  textTransform="capitalize"
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
                {ageCards.map((card, index) => (
                  <AgeCard key={index} {...card} />
                ))}
              </Flex>
            </Box>

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
                pagination
                height="500px"
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
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};

const AgeCard = ({title, value, percentile}) => {
  return (
    <Box
      flex="1"
      bg="#fff"
      border="1px solid #E5E7EB"
      borderRadius="12px"
      p="20px"
      minW={{base: "100%", md: "200px"}}>
      <Box
        as="img"
        src="/img/equipmentTrailer.svg"
        alt="truck"
        w="40px"
        h="40px"
      />
      <HStack spacing="12px" mb="12px">
        <Text fontSize="18px" fontWeight="600" color="#181D27">
          {title}
        </Text>
      </HStack>
      <HStack spacing="8px" mb="8px">
        <Text fontSize="18px" color="#181D27" fontWeight="600">
          Top
        </Text>
        <Badge
          bg="#DEFFEE"
          color="#16B364"
          border="1px solid #abefc6"
          px="8px"
          py="2px"
          borderRadius="4px"
          fontSize="14px"
          fontWeight="600">
          {value}%
        </Badge>
      </HStack>
      <Text fontSize="12px" color="#6B7280" fontWeight="400">
        {percentile}
      </Text>
    </Box>
  );
};
