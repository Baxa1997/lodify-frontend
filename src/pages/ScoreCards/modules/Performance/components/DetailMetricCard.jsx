import {Flex, Text, Box, VStack, Link} from "@chakra-ui/react";
import {MdKeyboardArrowRight} from "react-icons/md";

const DetailedMetricCard = ({title = "Overall", data = {}}) => {
  return (
    <Flex
      bg="white"
      flexDirection="column"
      border="1px solid #E5E7EB"
      borderRadius="12px">
      <VStack spacing="10px" align="stretch">
        <Text
          borderBottom="1px solid #E5E7EB"
          fontSize="18px"
          fontWeight="600"
          color="#181D27"
          mb="4px"
          p="12px 20px">
          {title}
        </Text>
        <Box px="20px">
          <Text fontSize="16px" color="#181D27" fontWeight="600">
            {data?.subtitle}
          </Text>
          <Text fontSize="14px" color="#6B7280" lineHeight="1.5">
            {data?.description}
          </Text>
        </Box>

        <Flex p="20px" gap="24px">
          <Box position="relative" width="33%" flexShrink={0}>
            <BarChart percentage={data?.percentage} color={data?.color} />
          </Box>

          <VStack
            spacing="16px"
            width="37%"
            align="flex-start"
            pt="8px"
            flex="1">
            {(Array.isArray(data?.details) ? data.details : [data?.details])
              .filter(Boolean)
              .map((detail, index) => (
                <Box key={index}>
                  <Text
                    fontSize="14px"
                    fontWeight="600"
                    color="#181D27"
                    mb="4px">
                    {detail?.value}
                    {detail?.contribution && (
                      <Text
                        as="span"
                        fontSize="12px"
                        color="#6B7280"
                        fontWeight="400"
                        ml="4px">
                        ({detail.contribution})
                      </Text>
                    )}
                  </Text>
                  <Text fontSize="13px" color="#6B7280" fontWeight="400">
                    {detail?.label}
                  </Text>
                </Box>
              ))}
          </VStack>

          <Box
            width="24%"
            w="24px"
            h="24px"
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt="8px">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 18L9 12L13 16L21 8"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 8H15M21 8V14"
                stroke="#10B981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Box>
        </Flex>

        <Flex
          alignItems="center"
          justifyContent="flex-end"
          p="12px 20px"
          borderTop="1px solid #E5E7EB">
          <Link
            href="#"
            fontSize="14px"
            color="#EF6820"
            fontWeight="500"
            _hover={{textDecoration: "underline"}}>
            View details
          </Link>
          <MdKeyboardArrowRight color="#EF6820" w="20px" h="20px" />
        </Flex>
      </VStack>
    </Flex>
  );
};

const BarChart = ({percentage, color}) => {
  const chartHeight = 160;
  const chartWidth = 120;
  const barWidth = 32;
  const normalizedPercentage = Math.min(Math.max(percentage || 0, 0), 100);
  const barHeight = (normalizedPercentage / 100) * chartHeight;
  const xPosition = (chartWidth - barWidth) / 2;

  return (
    <Box
      position="relative"
      w="100%"
      h="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column">
      <Box position="relative" w={`${chartWidth}px`} h={`${chartHeight}px`}>
        <svg width={chartWidth} height={chartHeight}>
          <line
            x1="0"
            y1={chartHeight * 0.75}
            x2={chartWidth}
            y2={chartHeight * 0.75}
            stroke="#F3F4F6"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <line
            x1="0"
            y1={chartHeight * 0.5}
            x2={chartWidth}
            y2={chartHeight * 0.5}
            stroke="#F3F4F6"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
          <line
            x1="0"
            y1={chartHeight * 0.25}
            x2={chartWidth}
            y2={chartHeight * 0.25}
            stroke="#F3F4F6"
            strokeWidth="1"
            strokeDasharray="2,2"
          />

          <rect
            x={xPosition}
            y="0"
            width={barWidth}
            height={chartHeight}
            fill="#F3F4F6"
            rx="4"
          />

          <rect
            x={xPosition}
            y={chartHeight - barHeight}
            width={barWidth}
            height={barHeight}
            fill={color}
            rx="4"
            style={{
              transition: "height 0.5s ease",
            }}
          />
        </svg>

        <Box
          position="absolute"
          top={chartHeight - barHeight - 30}
          left="50%"
          transform="translateX(-50%)"
          textAlign="center"
          pointerEvents="none">
          <Text
            fontSize="22px"
            fontWeight="600"
            color="#181D27"
            lineHeight="1.2">
            {percentage}%
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default DetailedMetricCard;
