import React, {useState} from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Switch,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import {
  InfoAccordionItem,
  InfoAccordionButton,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";

export const Classifications = () => {
  const [overrides, setOverrides] = useState({
    interstate_not_active: true,
    interstate_pending_revocation: true,
    dot_inactive: true,
    dot_missing: true,
    out_of_service: true,
    broker_active: true,
    broker_not_active: true,
  });

  const handleOverrideChange = (key) => {
    setOverrides((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const interstateItems = [
    {
      key: "interstate_not_active",
      label: "Interstate authority NOT active",
    },
    {
      key: "interstate_pending_revocation",
      label: "Interstate authority pending revocation",
    },
    {
      key: "dot_inactive",
      label: "DOT is inactive",
    },
    {
      key: "dot_missing",
      label: "DOT Number is missing",
    },
    {
      key: "out_of_service",
      label: "Out of service",
    },
  ];

  const additionalItems = [
    {
      key: "broker_active",
      label: "Broker authority active",
    },
    {
      key: "broker_not_active",
      label: "Broker authority NOT active",
    },
  ];

  const AssessmentSection = ({title, items}) => (
    <Box width="100%" mb="24px">
      <Text fontSize="16px" fontWeight="600" color="#181D27" mb="16px">
        {title}
      </Text>
      <Box
        bg="white"
        border="1px solid #E5E7EB"
        borderRadius="12px"
        overflow="hidden">
        <Table variant="simple">
          <Thead bg="#F9FAFB">
            <Tr>
              <Th
                fontSize="12px"
                fontWeight="600"
                color="#374151"
                textTransform="uppercase"
                px="16px"
                py="12px"
                borderBottom="1px solid #E5E7EB">
                Assessment Item
              </Th>
              <Th
                fontSize="12px"
                fontWeight="600"
                color="#374151"
                textTransform="uppercase"
                px="16px"
                py="12px"
                borderBottom="1px solid #E5E7EB"
                textAlign="center"
                width="120px">
                Override
              </Th>
              <Th
                fontSize="12px"
                fontWeight="600"
                color="#374151"
                textTransform="uppercase"
                px="16px"
                py="12px"
                borderBottom="1px solid #E5E7EB"
                textAlign="center"
                width="150px">
                Override Exp Ride
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => (
              <Tr
                key={item.key}
                borderBottom={
                  index < items.length - 1 ? "1px solid #F3F4F6" : "none"
                }>
                <Td px="16px" py="12px" fontSize="14px" color="#374151">
                  {item.label}
                </Td>
                <Td px="16px" py="12px" textAlign="center">
                  <Switch
                    colorScheme="orange"
                    isChecked={overrides[item.key]}
                    onChange={() => handleOverrideChange(item.key)}
                    size="md"
                  />
                </Td>
                <Td
                  px="16px"
                  py="12px"
                  textAlign="center"
                  fontSize="14px"
                  color="#6B7280">
                  -
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );

  return (
    <Box width="100%" maxW="100%">
      <InfoAccordionItem width="100%">
        <InfoAccordionButton w="100%">
          <HStack spacing="12px" alignItems="center" width="100%">
            <Box
              as="img"
              src="/img/filePhoto.svg"
              alt="authority"
              w="20px"
              h="20px"
              flexShrink={0}
            />
            <InfoAccordionTitle>Authoriy</InfoAccordionTitle>
          </HStack>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack spacing="0" align="stretch" width="100%">
            <AssessmentSection
              title="Interstate Carrier Assessment"
              items={interstateItems}
            />
            <AssessmentSection
              title="Additional Authority Assessment"
              items={additionalItems}
            />
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
