import React from "react";
import { Box, Text } from "@chakra-ui/react";

// Custom Radio Component
const CustomRadio = ({ value, children, name, checked, onChange, ...props }) => {
  return (
    <Box
      as="label"
      cursor="pointer"
      display="inline-flex"
      alignItems="center">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ display: "none" }}
        {...props}
      />
      <Box
        width="16px"
        height="16px"
        borderRadius="50%"
        border="2px solid"
        borderColor={checked ? "#3182CE" : "#E2E8F0"}
        bg={checked ? "#3182CE" : "white"}
        position="relative"
        mr="8px"
        _hover={{
          borderColor: checked ? "#2C5AA0" : "#CBD5E0",
        }}
        transition="all 0.2s">
        {checked && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="6px"
            height="6px"
            borderRadius="50%"
            bg="white"
          />
        )}
      </Box>
      <Text
        fontSize="14px"
        color="#181D27">
        {children}
      </Text>
    </Box>
  );
};

CustomRadio.displayName = "CustomRadio";

export default CustomRadio;
