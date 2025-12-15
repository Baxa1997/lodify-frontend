import {Box, Flex, Text} from "@chakra-ui/react";
import {
  InfoAccordionButton,
  InfoAccordionDescription,
  InfoAccordionItem,
  InfoAccordionPanel,
  InfoAccordionTitle,
} from "../../../../components/InfoAccordion";
import {formatDate} from "@utils/dateFormats";

export const Connection = ({new_info}) => {
  return (
    <InfoAccordionItem id="Connection Status">
      <InfoAccordionButton>
        <Flex justify="space-between" align="center" width="100%">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap="4px">
            <InfoAccordionTitle>Connection</InfoAccordionTitle>
            <InfoAccordionDescription>
              Completed {formatDate(new_info?.created_at)}
            </InfoAccordionDescription>
          </Box>
        </Flex>
      </InfoAccordionButton>
      <InfoAccordionPanel>
        <Text>Connection details content here...</Text>
      </InfoAccordionPanel>
    </InfoAccordionItem>
  );
};
