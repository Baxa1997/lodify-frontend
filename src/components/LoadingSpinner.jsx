import React, { memo } from "react";
import { Box, Spinner, Center, Text } from "@chakra-ui/react";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <Center
      h="100vh"
      flexDirection="column">
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
  );
};

export default memo(LoadingSpinner);
