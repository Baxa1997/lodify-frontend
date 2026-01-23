import React, {useRef, useState, useEffect} from "react";
import {Box, Flex, Text, Tooltip} from "@chakra-ui/react";
import {metrics} from "./MetricsData";
import {StatusIcon} from "./StatusIcon";

const TruncatedText = ({children, value}) => {
  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const isOverflowing =
          textRef.current.scrollWidth > textRef.current.clientWidth;
        setIsTruncated(isOverflowing);
      }
    };

    checkTruncation();
    window.addEventListener("resize", checkTruncation);

    return () => {
      window.removeEventListener("resize", checkTruncation);
    };
  }, [children]);

  const textElement = (
    <Text
      ref={textRef}
      fontSize="14px"
      fontWeight="500"
      color="#181D27"
      whiteSpace="nowrap"
      overflow="hidden"
      textOverflow="ellipsis"
      minW="0">
      {value || "-"}
    </Text>
  );

  if (isTruncated) {
    return (
      <Tooltip
        label={value || "-"}
        placement="top"
        bg="#1a365d"
        color="white"
        borderRadius="md"
        p="6px 10px"
        fontSize="12px"
        hasArrow>
        {textElement}
      </Tooltip>
    );
  }

  return textElement;
};

const MetricsSection = ({generalInfo, new_info}) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(5, minmax(0, 1fr))"
      gap="20px"
      bg="white"
      borderRadius="12px">
      {metrics({generalInfo, new_info}).map((metric, index) => (
        <Flex
          key={index}
          width="100%"
          alignItems="center"
          gap="12px"
          minW="0"
          flexWrap="nowrap">
          <Flex
            flexDir="row"
            alignItems="center"
            gap="6px"
            flex="1"
            minW="0"
            flexWrap="nowrap">
            <Text
              fontSize="14px"
              color="#535862"
              whiteSpace="nowrap"
              flexShrink={0}>
              {metric.label}:
            </Text>
            <TruncatedText value={metric.value}>
              {metric.value || "-"}
            </TruncatedText>
          </Flex>
          <Box flexShrink={0}>
            <StatusIcon status={metric.status} />
          </Box>
        </Flex>
      ))}
    </Box>
  );
};

export default MetricsSection;
