import React from "react";
import {Flex} from "@chakra-ui/react";
import {FaCheck, FaTimes} from "react-icons/fa";

export const StatusIcon = ({status}) => {
  return status === "success" ? (
    <Flex
      w="17px"
      h="17px"
      borderRadius="50%"
      bg="#EDFCF2"
      justifyContent="center"
      alignItems="center">
      <FaCheck color="#22C55E" size={12} />
    </Flex>
  ) : (
    <Flex
      w="17px"
      h="17px"
      borderRadius="50%"
      bg="#FFEBEA"
      justifyContent="center"
      alignItems="center">
      <FaTimes color="#FF3B30" size={12} />
    </Flex>
  );
};
