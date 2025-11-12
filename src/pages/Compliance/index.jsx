import React from "react";
import {Flex, Box, Text} from "@chakra-ui/react";
import Insurance from "./modules/Insurance";

const Compliance = () => {
  return (
    <>
      <Flex
        position="absolute"
        width="100%"
        left="0"
        top="0"
        bg="#FAFAFA"
        p="20px 24px"
        gap="16px"
        borderBottom={"1px solid #d6d7da"}>
        <Flex
          bg="#fff"
          border={"1px solid #d6d7da"}
          alignItems="center"
          justifyContent="center"
          w="52px"
          h="53px"
          borderRadius="12px">
          <img src="/img/registerUserIcon.svg" alt="" width="28px" h="28px" />
        </Flex>

        <Box>
          <Text color="#181D27" fontWeight="600" fontSize="16px">
            Eagle eye trucking LLC
          </Text>
          <Text mt="4px" color="#535862" fontSize="13px" fontWeight="400">
            DOT 03472971 MC 1137201
          </Text>
        </Box>
      </Flex>

      <Box pt="100px">
        <Insurance />
      </Box>
    </>
  );
};

export default Compliance;
