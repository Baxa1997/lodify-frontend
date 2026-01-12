import React from 'react';
import { Box, Flex, Text, Icon } from '@chakra-ui/react';
import { RiDatabase2Line } from 'react-icons/ri';

const EmptyState = ({ 
  message = "No Data Available", 
  description, 
  icon = RiDatabase2Line,
  height = "200px",
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
      <Box
        bg="#F5F5F5"
        borderRadius="50%"
        p="12px"
        mb="12px"
      >
        <Icon
          as={icon}
          w="32px"
          h="32px"
          color="#A0AEC0"
        />
      </Box>
      <Text
        fontSize="14px"
        fontWeight="600"
        color="#181D27"
        mb={description ? "6px" : 0}
      >
        {message}
      </Text>
      {description && (
        <Text
          fontSize="12px"
          color="#6B7280"
          textAlign="center"
          maxW="350px"
        >
          {description}
        </Text>
      )}
    </Flex>
  );
};

export default EmptyState;

