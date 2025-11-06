import { Box, Flex } from "@chakra-ui/react";
import { InfoAccordionButton, InfoAccordionDescription, InfoAccordionItem, InfoAccordionPanel, InfoAccordionTitle } from "../../../../components/InfoAccordion";
import { USMap } from "./USMap";
import { InfoCard } from "../InfoCard";

export const State = () => {

  return <InfoAccordionItem>
    <InfoAccordionButton>
      <Flex
        flexDir="column"
        alignItems="flex-start"
        gap="4px"
      >
        <InfoAccordionTitle>
        State
        </InfoAccordionTitle>
        <InfoAccordionDescription>
        Origin and Destination based on current search criteria
        </InfoAccordionDescription>
      </Flex>
    </InfoAccordionButton>
    <InfoAccordionPanel>
      <Box>
        <Flex gap="20px">
          <InfoCard
            title="Preferred Areas"
            badgeText="27 States"
          />
          <InfoCard
            title="Cross Border"
            badgeText="No Preferrred Lanes"
            isEmpty
          />
        </Flex>

        <Box
          mt="20px"
          display="flex"
          justifyContent="center"
        >
          <USMap />
        </Box>
      </Box>
    </InfoAccordionPanel>
  </InfoAccordionItem>;
};
