import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  Text,
  Flex,
  HStack,
  AccordionIcon,
} from "@chakra-ui/react";
import {AiOutlineExclamationCircle} from "react-icons/ai";

export const InsightAddress = ({
  item,
  physicalAddress = false,
  mailingAddress = false,
}) => {
  return (
    <Accordion key={item} allowToggle>
      <AccordionItem
        overflow="hidden"
        border="1px solid #EF6820"
        borderRadius="8px"
        bg="white">
        <AccordionButton
          p="12px"
          _hover={{bg: "#fff"}}
          _expanded={{bg: "#fff"}}
          textAlign="left">
          <Flex
            minW="300px"
            w={"100%"}
            bg="#FAFAFA"
            borderRadius="8px"
            p="12px 16px"
            gap="12px"
            justifyContent="space-between"
            alignItems="center">
            <Box flex="1" textAlign="left">
              <Text
                color="#181D27"
                fontSize="14px"
                fontWeight="500"
                textAlign="left">
                {item.address}
              </Text>
              <Text
                color="#000"
                fontSize="14px"
                fontWeight="400"
                textAlign="left">
                {physicalAddress
                  ? "Physical Address"
                  : mailingAddress
                  ? "Mailing Address"
                  : "Virtual Address"}
              </Text>
            </Box>
            <HStack spacing="8px" flexShrink={0}>
              <Box>
                <AiOutlineExclamationCircle
                  width="20px"
                  height="20px"
                  fontSize="20px"
                  color="#EF6820"
                />
              </Box>
              <AccordionIcon color="#181D27" fontSize="16px" />
            </HStack>
          </Flex>
        </AccordionButton>
        <AccordionPanel>
          <Text fontSize="14px" color="#000" pl="10px" lineHeight="1.6">
            {physicalAddress
              ? item?.physical_address
              : mailingAddress
              ? item?.mailing_address
              : item?.virtual_address}
          </Text>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
