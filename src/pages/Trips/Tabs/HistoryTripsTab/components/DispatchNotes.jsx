import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

function DispatchNotes({ item = {} }) {
  return (
    <>
      <Box
        id="scrollbar_none"
        minH="70px"
        overflowY={"scroll"}>
        <Box
          p="16px"
          pb="0">
          <Flex
            mb="6px"
            justifyContent={"space-between"}>
            <Text
              fontWeight={"500"}
              fontSize={"12px"}
              color={"#414651"}>
              {item?.id || ""}
            </Text>
            <Text
              fontWeight={"500"}
              fontSize={"10px"}
              color={"#535862"}>
              {item?.time}
            </Text>
          </Flex>

          <Box
            fontSize={"14px"}
            color="#181D27"
            border="1px solid #E9EAEB"
            p="10px 12px"
            borderRadius="8px">
            {item?.note}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default DispatchNotes;
