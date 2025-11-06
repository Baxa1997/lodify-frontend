import { Box, Text } from "@chakra-ui/react";

const MainHeading = ({ children, size = "24px", ...props }) => {

  return <Box {...props}>
    <Text
      color={"#181D27"}
      fontWeight={"600"}
      fontSize={size}
      lineHeight={1.3}
    >
      {children}
    </Text>
  </Box>;
};

export default MainHeading;
