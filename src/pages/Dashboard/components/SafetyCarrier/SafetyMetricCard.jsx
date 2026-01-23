import React from "react";
import {Box, Text, Flex, Progress, Tooltip, VStack} from "@chakra-ui/react";
import {AiOutlineExclamationCircle} from "react-icons/ai";

const SafetyMetricCard = ({
  title,
  value,
  hasData,
  statusText,
  icon = "",
  count = 0,
  basic_desc = "",
}) => {
  const hasWarning = count > 0;
  const warningMessage = hasWarning ? (
    <>
      {basic_desc || title} has <div style={{fontWeight: 'bold', fontSize: '14px', display: 'inline-flex'}}>{count}</div>{" "}
      {count === 1 ? "violation" : "violations"}
    </>
  ) : null;

  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #E5E7EB"
      p="14px"
      position="relative"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)">
      <Flex gap="12px" justifyContent="space-between">
        <Text
          maxW="170px"
          fontSize="14px"
          fontWeight="600"
          color="#181D27"
          mb="12px"
          lineHeight="1.4" width='120px' h='60px'>
          {title}
        </Text>

        {hasWarning ? (
          <Tooltip
            hasArrow
            placement="top"
            bg="#fff"
            color="#181D27"
            borderRadius="8px"
            boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
            p={3}
            label={
              <Box minW="180px">
                <VStack align="start" spacing={2}>
                  <Text fontSize="12px" fontWeight="600" color="#EF6820">
                    ⚠️ Warning
                  </Text>
                  <VStack align="start" spacing={1}>
                    <Text fontSize="11px" color="#6B7280" lineHeight="1.4">
                      {warningMessage}
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            }>
            <Box
              w="36px"
              h="36px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={1}
              cursor="pointer">
              <AiOutlineExclamationCircle
                width="24px"
                height="24px"
                fontSize="24px"
                color="#EF6820"
              />
            </Box>
          </Tooltip>
        ) : (
          <Tooltip label={title}>
            <Box
              w="36px"
              h="36px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={1}>
              <img src={icon} alt="" />
            </Box>
          </Tooltip>
        )}
      </Flex>

      <Box>
        {hasData ? (
          <>
            <Flex
              mt="10px"
              alignItems="baseline"
              justifyContent="space-between"
              mb="12px"
              flexWrap="wrap"
              gap="4px">
              <Text
                fontSize="22px"
                fontWeight="700"
                color="#181D27"
                lineHeight="1.2">
                {value}
              </Text>
            </Flex>
          </>
        ) : (
          <>
            {Boolean(value) ? (
              <Text fontSize="24px" fontWeight="700" color="#181D27" mb="8px">
                {value}
              </Text>
            ) : (
              <Text fontSize="20px" fontWeight="700" color="#777">
                No Data
              </Text>
            )}
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
