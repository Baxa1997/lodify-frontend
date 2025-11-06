import React from "react";
import {Box} from "@chakra-ui/react";

const CTableRow = ({
  children,
  hover = true,
  striped = false,
  index = 0,
  bg = "#fff",
  ...props
}) => {
  return (
    <Box as="tr" _hover={hover ? {bg: "gray.50"} : {}} bg={bg} {...props}>
      {children}
    </Box>
  );
};

export default CTableRow;
