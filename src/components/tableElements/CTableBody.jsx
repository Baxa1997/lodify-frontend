import React, { memo } from "react";
import { Box } from "@chakra-ui/react";

const CTableBody = ({ children, ...props }) => {
  return (
    <Box
      as="tbody"
      {...props}>
      {children}
    </Box>
  );
};

export default memo(CTableBody);
