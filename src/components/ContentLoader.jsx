import React, { memo } from "react";
import { Box, Spinner, Center, Text } from "@chakra-ui/react";

const ContentLoader = ({ message = "Loading..." }) => {
  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="white"
      zIndex="1">
      <Center flexDirection="column">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text
          mt={4}
          color="gray.600"
          fontSize="sm">
          {message}
        </Text>
      </Center>
    </Box>
  );
};

export default memo(ContentLoader);
