import { Box, Flex, Text } from "@chakra-ui/react";
import { InfoAccordionButton, InfoAccordionDescription, InfoAccordionItem, InfoAccordionPanel, InfoAccordionTitle } from "../../../../components/InfoAccordion";

export const Connection = () => {

  return <InfoAccordionItem>
    <InfoAccordionButton>
      <Flex
        justify="space-between"
        align="center"
        width="100%">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          gap="4px"
        >
          <InfoAccordionTitle>
            Connection
          </InfoAccordionTitle>
          <InfoAccordionDescription>
            Completed at 2:28 PM on 26/03/2025
          </InfoAccordionDescription>
        </Box>
      </Flex>
    </InfoAccordionButton>
    <InfoAccordionPanel>
      <Text>Connection details content here...</Text>
    </InfoAccordionPanel>
  </InfoAccordionItem>;
};