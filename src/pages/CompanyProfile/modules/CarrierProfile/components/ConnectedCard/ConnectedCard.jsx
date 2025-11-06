import { HStack, Image, Text, VStack } from "@chakra-ui/react";

export const ConnectedCard = () => {

  return <HStack
    p="16px"
    align="start"
    spacing={3}
    border="1px solid #E9EAEB"
    borderRadius="12px"
  >
    <Image
      src="/img/done-circle.svg"
      w="38px"
      h="38px" />
    <VStack
      align="start"
      spacing={1}>
      <Text
        fontSize="16px"
        fontWeight="600"
        color="#181d27">
        Connected
      </Text>
      <Text
        fontSize="14px"
        color="#6b7280"
      >
        The carrier has a connected and active ELD providing a clear
        physical and digital footprint
      </Text>
      <Text
        fontSize="12px"
        color="#9ca3af"
      >
        Connected on 4/2/2025, Updated 13 minutes ago
      </Text>
    </VStack>
  </HStack>;
};
