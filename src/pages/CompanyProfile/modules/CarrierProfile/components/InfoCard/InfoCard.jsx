import { Badge, Box, Text } from "@chakra-ui/react";

export const InfoCard = ({ title, badgeText, isEmpty }) => {

  return  <Box
    width="100%"
    display="flex"
    flexDir="column"
    alignItems="flex-start"
    gap="20px"
    padding="20px"
    border="1px solid"
    borderColor="gray.border-main"
    borderRadius="12px"
  >
    <Text
      fontWeight="600"
      fontSize="16px"
      color="primary.500"
    >
      {title}
    </Text>
    <Badge
      padding="4px 12px"
      borderRadius="16px"
      fontSize="12px"
      fontWeight="500"
      color="secondary.700"
      border="1px solid"
      borderColor={isEmpty ? "gray.border-main" : "secondary.700"}
      bgColor={isEmpty ? "gray.50" : "transparent"}
    >
      {badgeText}
    </Badge>
  </Box>;
};