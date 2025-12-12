import {Flex, Text, Box, VStack, Link} from "@chakra-ui/react";
import {MdKeyboardArrowRight} from "react-icons/md";
import Chart from "react-google-charts";

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
            <CircularProgress
              percentage={data?.percentage}
              color={data?.color}
            />
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

const CircularProgress = ({percentage, color}) => {
  const remaining = 100 - percentage;
  const chartData = [
    ["Label", "Value"],
    ["Progress", percentage],
    ["Remaining", remaining],
  ];

  const options = {
    pieHole: 0.75,
    pieSliceText: "none",
    legend: "none",
    tooltip: {trigger: "none"},
    slices: {
      0: {color: color},
      1: {color: "#F3F4F6"},
    },
    chartArea: {left: 0, top: 0, width: "100%", height: "100%"},
    backgroundColor: "transparent",
  };

  return (
    <Box position="relative" w="100%" h="100%" overflow="hidden">
      <Box w="160px" h="160px" position="relative">
        <Chart
          chartType="PieChart"
          data={chartData}
          options={options}
          style={{width: "100%", height: "100%"}}
        />
      </Box>
      <Box
        position="absolute"
        top="50%"
        left="45%"
        transform="translate(-50%, -50%)"
        textAlign="center"
        w="100%"
        pointerEvents="none">
        <Text fontSize="22px" fontWeight="600" color="#181D27" lineHeight="1.2">
          {percentage}%
        </Text>
      </Box>
    </Box>
  );
};

export default DetailedMetricCard;
