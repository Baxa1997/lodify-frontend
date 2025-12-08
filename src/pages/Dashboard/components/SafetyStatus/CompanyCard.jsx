import React from "react";
import {Box, Text, Flex, Badge} from "@chakra-ui/react";
import {SemiCircularGauge} from "../TripsNeedingAttention/SemiCircularGauge";

export const CompanyCard = ({
  companyName,
  logo,
  completedLoads,
  grade,
  percentage,
  gaugeColor,
  profilePictures = [],
}) => {
  const getGradeColor = (grade) => {
    if (grade === "A+")
      return {bg: "#dcfae6", border: "#abefc6", text: "#079455"};
    if (grade === "A")
      return {bg: "#dcfae6", border: "#abefc6", text: "#079455"};
    if (grade === "B+")
      return {bg: "#fef3c7", border: "#fde68a", text: "#d97706"};
    if (grade === "B")
      return {bg: "#fef3c7", border: "#fde68a", text: "#d97706"};
    if (grade === "C")
      return {bg: "#fed7aa", border: "#fdba74", text: "#ea580c"};
    if (grade === "D")
      return {bg: "#fee2e2", border: "#fecaca", text: "#dc2626"};
    return {bg: "#f3f4f6", border: "#e5e7eb", text: "#6b7280"};
  };

  const gradeColors = getGradeColor(grade);

  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #E5E7EB"
      p="20px"
      position="relative"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)">
      <Flex justifyContent="space-between" alignItems="flex-start" mb="16px">
        <Flex alignItems="center" gap="12px" flex="1">
          <Box
            w="40px"
            h="40px"
            borderRadius="8px"
            bg="#F3F4F6"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid #E5E7EB"
            flexShrink={0}>
            {logo ? (
              <Box
                as="img"
                src={logo}
                alt={companyName}
                w="100%"
                h="100%"
                objectFit="contain"
                borderRadius="8px"
              />
            ) : (
              <Text fontSize="14px" fontWeight="700" color="#181D27">
                {companyName.substring(0, 2).toUpperCase()}
              </Text>
            )}
          </Box>
          <Box flex="1" minW="0">
            <Text
              fontSize="16px"
              fontWeight="600"
              color="#181D27"
              noOfLines={1}>
              {companyName}
            </Text>
          </Box>
        </Flex>
      </Flex>

      <Box
        position="relative"
        h="120px"
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        pb="8px">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          position="relative"
          w="100%">
          <Box>
            <Text mb="4px" fontSize="14px" color="#6B7280" fontWeight="400">
              Completed Loads:
            </Text>
            <Text mb="4px" fontSize="16px" fontWeight="600" color="#181D27">
              {completedLoads.toLocaleString()}
            </Text>
            <Badge
              bg={gradeColors.bg}
              border="1px solid"
              borderColor={gradeColors.border}
              color={gradeColors.text}
              fontSize="14px"
              fontWeight="700"
              px="10px"
              py="4px"
              borderRadius="6px">
              {grade}
            </Badge>
          </Box>

          <Box
            w="160px"
            display="flex"
            justifyContent="center"
            position="relative">
            <SemiCircularGauge
              value={percentage}
              maxValue={100}
              color={gaugeColor}
              label=""
              showValue={false}
            />
            <Box
              position="absolute"
              bottom="8px"
              left="50%"
              transform="translateX(-50%)"
              textAlign="center"
              w="100%">
              <Text fontSize="20px" fontWeight="700" color="#181D27">
                {percentage}%
              </Text>
            </Box>
          </Box>
        </Flex>

        {profilePictures.length > 0 && (
          <Flex
            position="absolute"
            top="0"
            right="0"
            gap="-8px"
            alignItems="center"
            zIndex={10}>
            {profilePictures.slice(0, 2).map((pic, index) => (
              <Box
                key={index}
                w="32px"
                h="32px"
                borderRadius="50%"
                border="2px solid white"
                overflow="hidden"
                ml={index > 0 ? "-8px" : "0"}
                boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)">
                {pic ? (
                  <Box
                    as="img"
                    src={pic}
                    alt={`Profile ${index + 1}`}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                  />
                ) : (
                  <Box
                    w="100%"
                    h="100%"
                    bg="#E5E7EB"
                    display="flex"
                    alignItems="center"
                    justifyContent="center">
                    <Text fontSize="12px" fontWeight="600" color="#6B7280">
                      {companyName.substring(0, 1)}
                    </Text>
                  </Box>
                )}
              </Box>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
};
