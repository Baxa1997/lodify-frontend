import {Button, Flex, Text} from "@chakra-ui/react";
import React from "react";

const Heading = () => {
  return (
    <>
      <Flex alignItems={"center"} justifyContent={"space-between"} h={"32px"}>
        <Text h={"32px"} color={"#181D27"} fontWeight={"600"} fontSize={"24px"}>
          Reviews
        </Text>

        <Button
          w={"159px"}
          h={"40px"}
          borderRadius={"8px"}
          bg={"#EF6820"}
          fontSize={"14px"}
          fontWeight={"600"}>
          <Text color={"#fff"}>Advanced Search</Text>
        </Button>
      </Flex>
    </>
  );
};

export default Heading;
