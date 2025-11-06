import React from "react";
import { Box, Text } from "@chakra-ui/react";

// Custom Checkbox Component
const CustomCheckbox = ({
  checked,
  onChange,
  children,
  name,
  value,
  ...props
}) => {
  return (
    <Box
      as="label"
      cursor="pointer"
      display="inline-flex"
      alignItems="center">
      <input
        type="checkbox"
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
        borderRadius="4px"
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
            width="10px"
            height="10px"
            color="white"
            fontSize="12px"
            display="flex"
            alignItems="center"
            justifyContent="center">
            ✓
          </Box>
        )}
      </Box>
      {children && (
        <Text
          fontSize="14px"
          color="#181D27">
          {children}
        </Text>
      )}
    </Box>
  );
};

export default CustomCheckbox;
