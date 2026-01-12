import React from 'react';
import { Box, Flex, Spinner, Text } from '@chakra-ui/react';

const LoadingState = ({ 
  message = "Loading...", 
  height = "200px",
  size = "xl",
  showMessage = false,
  ...props 
}) => {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH={height}
      py="24px"
      px="20px"
      {...props}
    >
      <Spinner
        thickness="3px"
        speed="0.65s"
        emptyColor="gray.200"
        color="#EF6820"
        size={size}
      />
      {showMessage && (
        <Text
          fontSize="12px"
          color="#6B7280"
          mt="12px"
        >
          {message}
        </Text>
      )}
    </Flex>
  );
};

export default LoadingState;

