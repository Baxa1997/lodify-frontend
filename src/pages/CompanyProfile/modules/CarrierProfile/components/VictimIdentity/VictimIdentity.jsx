import {  Badge, Flex, Text } from "@chakra-ui/react";
import { InfoAccordionButton, InfoAccordionItem, InfoAccordionPanel, InfoAccordionTitle } from "../../../../components/InfoAccordion";

export const VictimIdentity = () => {
  return <InfoAccordionItem>
    <InfoAccordionButton>
      <Flex
        width="100%"
        gap="8px"
      >
        <InfoAccordionTitle>
          Victim of Identity Theft
        </InfoAccordionTitle>
        <Badge
          bg="#10b981"
          color="white"
          px={3}
          py={1}
          borderRadius="full"
          fontSize="12px"
          fontWeight="500"
        >
            Victim of Identity Theft
        </Badge>
      </Flex>
    </InfoAccordionButton>
    <InfoAccordionPanel>
      <Text>Identity theft details content here...</Text>
    </InfoAccordionPanel>
  </InfoAccordionItem>;
};
