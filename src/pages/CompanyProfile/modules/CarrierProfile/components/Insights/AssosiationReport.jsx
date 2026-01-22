import React from "react";
import {Flex, Box, Text} from "@chakra-ui/react";
import {VinmatchedData} from "./VinmatchedData";

export const AssosiationReport = ({
  insight,
  label = "",
  matchData = {},
  matchTitle = "",
  matchDescription = "",
}) => {
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
        {insight?.date && (
          <Text color="#6B7280" fontSize="14px" fontWeight="400">
            {insight?.date}
          </Text>
        )}
      </Box>
      {Object.keys(matchData).length > 0 && (
        <VinmatchedData
          matchData={matchData}
          title={matchTitle}
          description={matchDescription}
        />
      )}
    </Flex>
  );
};
