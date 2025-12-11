import React from "react";
import { Flex, Box, Text, Button } from "@chakra-ui/react";
import { getShortFileName } from "../../../../utils/getFileName";

function Documents({ item = "" }) {
  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        margin="0px 14px"
        p="14px 0px"
        border="1px solid #fff">
        <Flex
          gap={"8px"}
          alignItems={"center"}>
          <img
            src="/img/filePhoto.svg"
            alt="" />

          <Text
            w="100%"
            fontWeight={"500"}
            fontSize={"13px"}
            color={"#414651"}>
            {Boolean(item) && getShortFileName(item, 20)?.shortName}
          </Text>
        </Flex>

        <Button
          w="34px"
          h="20px"
          bg="none"
          _hover={{ bg: "none" }}
          color="#175CD3"
          fontSize={"14px"}
          fontWeight={"600"}>
          View
        </Button>
      </Flex>
    </>
  );
}

export default Documents;
