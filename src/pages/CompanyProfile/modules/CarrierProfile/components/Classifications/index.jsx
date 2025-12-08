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
  Flex,
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
    <Box>
      <Table variant="simple">
        <Thead bg="#F9FAFB">
          <Tr>
            <Th
              fontSize="13px"
              fontWeight="600"
              color="#374151"
              py="12px"
              textTransform="capitalize"
              borderBottom="1px solid #E5E7EB">
              Assessment Item
            </Th>
            <Th
              fontSize="13px"
              fontWeight="600"
              color="#374151"
              px="16px"
              py="12px"
              textTransform="capitalize"
              borderBottom="1px solid #E5E7EB"
              textAlign="center"
              width="120px">
              Override
            </Th>
            <Th
              fontSize="13px"
              fontWeight="600"
              color="#374151"
              px="16px"
              py="12px"
              textTransform="capitalize"
              borderBottom="1px solid #E5E7EB"
              textAlign="center"
              width="162px">
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
  );

  return (
    <Box>
      <InfoAccordionItem>
        <InfoAccordionButton>
          <HStack spacing="12px" alignItems="center">
            <Box
              as="img"
              src="/img/filePhoto.svg"
              alt="authority"
              w="20px"
              h="20px"
              flexShrink={1}
            />
            <InfoAccordionTitle>Authoriy</InfoAccordionTitle>
          </HStack>
        </InfoAccordionButton>
        <InfoAccordionPanel>
          <VStack
            my="6px"
            border="1px solid #E5E7EB"
            borderRadius="8px"
            spacing="0"
            align="stretch"
            width="100%">
            <AssessmentSection
              title="Interstate Carrier Assessment"
              items={interstateItems}
            />
            <AssessmentSection
              title="Interstate Carrier Assessment"
              items={interstateItems}
            />
          </VStack>
        </InfoAccordionPanel>
      </InfoAccordionItem>
    </Box>
  );
};
