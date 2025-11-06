import { Box } from "@chakra-ui/react";

export const CardData = ({ children, ...props }) => {
  return <Box
    padding="20px"
    border="1px solid"
    borderColor="gray.border-main"
    borderRadius="12px"
    {...props}
  >
    {children}
  </Box>;
};
