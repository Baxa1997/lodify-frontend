import React, {memo} from "react";
import {Box} from "@chakra-ui/react";

const CTableTd = ({children, ...props}) => {
  return (
    <Box
      as="td"
      py={"8px"}
      px={6}
      fontSize="14px"
      color="gray.700"
      borderBottom="1px solid"
      borderColor="#E9EAEB"
      minWidth="80px"
      width="auto"
      whiteSpace="nowrap"
      {...props}>
      {children}
    </Box>
  );
};

export default memo(CTableTd);
