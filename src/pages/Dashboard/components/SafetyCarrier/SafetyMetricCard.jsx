import React from "react";
import {Box, Text, Flex, Progress} from "@chakra-ui/react";

const SafetyMetricCard = ({
  title,
  value,
  hasData,
  progressValue = 0,
  progressColor = "#E5E7EB",
  statusText,
  icon = "",
}) => {
  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #E5E7EB"
      p="20px"
      position="relative"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)">
      <Flex gap="12px" justifyContent="space-between">
        <Text
          maxW="170px"
          fontSize="14px"
          fontWeight="600"
          color="#181D27"
          mb="12px"
          lineHeight="1.4">
          {title}
        </Text>
        <Box
          // position="absolute"
          // top="20px"
          // right="20px"
          w="48px"
          h="48px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}>
          <img src={icon} alt="" />
        </Box>
      </Flex>

      <Box>
        {hasData ? (
          <>
            <Flex
              mt="40px"
              alignItems="baseline"
              justifyContent="space-between"
              mb="12px"
              flexWrap="wrap"
              gap="8px">
              <Text
                fontSize="26px"
                fontWeight="700"
                color="#181D27"
                lineHeight="1.2">
                {value}
              </Text>
              <Text
                fontSize="14px"
                fontWeight="400"
                color="#6B7280"
                whiteSpace="nowrap">
                {statusText}
              </Text>
            </Flex>
            <Progress
              value={progressValue}
              colorScheme="custom"
              bg="#F3F4F6"
              borderRadius="4px"
              h="8px"
              sx={{
                "& > div": {
                  backgroundColor: progressColor,
                },
              }}
            />
          </>
        ) : (
          <>
            <Text fontSize="24px" fontWeight="700" color="#181D27" mb="8px">
              {value}
            </Text>
            <Text fontSize="14px" fontWeight="400" color="#6B7280">
              {statusText}
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SafetyMetricCard;
