import React from "react";
import {Box, Text, Flex, HStack} from "@chakra-ui/react";
import {CheckCircleIcon} from "@chakra-ui/icons";

export const SafetyPercentileCard = ({title, value, hasData = true}) => {
  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #E5E7EB"
      p="20px"
      h="140px"
      display="flex"
      flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="16px">
        <Text fontSize="14px" fontWeight="600" color="#181D27">
          {title}
        </Text>
      </Flex>

      {hasData ? (
        <>
          <Text fontSize="32px" fontWeight="700" color="#181D27">
            {value}% <CheckCircleIcon color="#079455" w="28px" h="28px" />
          </Text>
          <Box
            position="relative"
            w="100%"
            h="8px"
            bg="#F3F4F6"
            borderRadius="4px"
            overflow="hidden">
            <Box
              position="absolute"
              left="0"
              top="0"
              h="100%"
              bg="#1570EF"
              borderRadius="4px"
              w={`${value}%`}
              transition="width 0.3s ease"
            />
          </Box>
        </>
      ) : (
        <Text fontSize="24px" fontWeight="500" color="#181D27">
          No data available{" "}
          <CheckCircleIcon color="#079455" w="28px" h="28px" />
        </Text>
      )}
    </Box>
  );
};
