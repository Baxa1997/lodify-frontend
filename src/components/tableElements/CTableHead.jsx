import React, {memo} from "react";
import {Box} from "@chakra-ui/react";

const CTableHead = ({children, bg = "gray.50", ...props}) => {
  return (
    <Box as="thead" bg={bg} position="sticky" top="0" zIndex="10" {...props}>
      {children}
    </Box>
  );
};

export default memo(CTableHead);
