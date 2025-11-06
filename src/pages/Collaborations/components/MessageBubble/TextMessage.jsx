import React from "react";
import {Box, Text} from "@chakra-ui/react";

const TextMessage = ({isOwn, content}) => {
  return (
    <Box
      p={isOwn ? "6px 14px 6px 14px" : "6px 14px 6px 14px"}
      color={isOwn ? "#080707" : "#181D27"}
      maxW="100%"
      whiteSpace="pre-wrap"
      wordBreak="normal"
      overflowWrap="break-word"
      textAlign={isOwn ? "right" : "left"}>
      <Text
        fontSize="14px"
        lineHeight="1.4"
        color={isOwn ? "#080707" : "#181D27"}
        whiteSpace="pre-wrap"
        wordBreak="normal"
        overflowWrap="break-word">
        {content}
      </Text>
    </Box>
  );
};

export default TextMessage;
