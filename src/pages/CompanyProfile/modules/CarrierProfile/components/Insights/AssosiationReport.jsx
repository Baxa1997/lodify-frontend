import React from "react";
import {Flex, Box, Text} from "@chakra-ui/react";
import {AiOutlineExclamationCircle} from "react-icons/ai";

export const AssosiationReport = ({insight, label = ""}) => {
  return (
    <Flex
      minW="280px"
      w={"fit-content"}
      bg="#FAFAFA"
      borderRadius="8px"
      p="12px 16px"
      gap="12px"
      justifyContent="space-between">
      <Box>
        <Text color="#181D27" fontSize="14px" fontWeight="500">
          {label || insight?.title}
        </Text>
        <Text color="#6B7280" fontSize="14px" fontWeight="400">
          {insight?.date}
        </Text>
      </Box>
      <Box>
        <AiOutlineExclamationCircle
          width="20px"
          height="20px"
          fontSize="20px"
          color="#EF6820"
        />
      </Box>
    </Flex>
  );
};
