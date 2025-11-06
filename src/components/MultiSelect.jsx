import React, { useState, useRef, useEffect, memo } from "react";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { LuChevronDown, LuCheck, LuX } from "react-icons/lu";

const MultiSelect = ({
  placeholder = "Select options",
  options = [],
  value = [],
  onChange = () => {},
  size = "md",
  customSize,
  variant = "outline",
  bg = "white",
  borderColor = "gray.300",
  focusBorderColor = "blue.400",
  color = "gray.700",
  placeholderStyle = {
    color: "#6B7280",
    fontSize: "16px",
  },
  width = "100%",
  iconColor = "#6B7280",
  iconSize = 20,
  showIcon = true,
  isDisabled = false,
  isRequired = false,
  isInvalid = false,
  errorBorderColor = "red.400",
  label,
  name,
  dropdownPosition = "bottom",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const handleSelect = (option) => {
    if (option.isDisabled) return;

    let newValue;
    if (value.includes(option.value)) {
      newValue = value.filter((v) => v !== option.value);
    } else {
      newValue = [...value, option.value];
    }

    onChange(newValue);
  };

  const handleRemove = (val) => {
    onChange(value.filter((v) => v !== val));
  };

  const getSizeStyles = () => {
    if (customSize) return customSize;

    switch (size) {
    case "xs":
      return { height: "28px", py: "4px", px: "8px", fontSize: "12px" };
    case "sm":
      return { height: "32px", py: "6px", px: "12px", fontSize: "14px" };
    case "md":
      return { height: "40px", py: "8px", px: "16px", fontSize: "16px" };
    case "lg":
      return { height: "48px", py: "12px", px: "20px", fontSize: "18px" };
    case "xl":
      return { height: "56px", py: "14px", px: "24px", fontSize: "20px" };
    default:
      return { height: "40px", py: "8px", px: "16px", fontSize: "16px" };
    }
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <Box w={width}>
      {label && (
        <Box
          as="label"
          color="#414651"
          fontWeight={500}
          mb="6px"
          display="block"
          htmlFor={name}>
          {label}
          {isRequired && (
            <Box
              as="span"
              color="blue.500">
              *
            </Box>
          )}
        </Box>
      )}
      <Box
        position="relative"
        ref={dropdownRef}
        {...props}>
        <Box
          ref={selectRef}
          onClick={handleToggle}
          onFocus={() => setIsFocused(true)}
          bg={bg}
          border="1px solid"
          borderColor={
            isInvalid
              ? errorBorderColor
              : isFocused || isOpen
                ? focusBorderColor
                : borderColor
          }
          color={color}
          borderRadius="8px"
          pr={showIcon ? "40px" : "20px"}
          pl="16px"
          cursor={isDisabled ? "not-allowed" : "pointer"}
          opacity={isDisabled ? 0.6 : 1}
          transition="all 0.2s ease"
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          gap="4px"
          minH={getSizeStyles().height}
          _hover={{
            borderColor: isDisabled ? borderColor : focusBorderColor,
          }}
          _focus={{
            outline: "none",
            borderColor: isInvalid ? errorBorderColor : focusBorderColor,
            boxShadow: `0 0 0 1px var(--chakra-colors-${
              isInvalid ? "red" : "blue"
            }-400)`,
          }}>
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <HStack
                border="1px solid #D5D7DA"
                key={opt.value}
                spacing="4px"
                bg="#fff"
                borderRadius="8px"
                px="8px"
                py="2px">
                <Text
                  color="#414651"
                  fontWeight={500}
                  fontSize="14px">
                  {opt.label}
                </Text>
                <Box
                  as="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(opt.value);
                  }}
                  display="flex"
                  alignItems="center">
                  <LuX size={14} />
                </Box>
              </HStack>
            ))
          ) : (
            <Text
              color={placeholderStyle.color}
              fontSize={placeholderStyle.fontSize}>
              {placeholder}
            </Text>
          )}

          {showIcon && (
            <Box
              position="absolute"
              right="12px"
              top="50%"
              color={iconColor}
              zIndex={1}
              pointerEvents="none"
              transition="transform 0.2s ease"
              transform={`translateY(-50%) ${isOpen ? "rotate(180deg)" : ""}`}>
              <LuChevronDown size={iconSize} />
            </Box>
          )}
        </Box>

        {isOpen && !isDisabled && (
          <Box
            position="absolute"
            top={dropdownPosition === "top" ? "auto" : "100%"}
            bottom={dropdownPosition === "top" ? "100%" : "auto"}
            left="0"
            right="0"
            bg="white"
            border="1px solid"
            borderColor={borderColor}
            borderRadius="lg"
            boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
            zIndex={1000}
            maxH="200px"
            overflowY="auto"
            mt={dropdownPosition === "top" ? "0" : "2px"}
            mb={dropdownPosition === "top" ? "2px" : "0"}>
            <VStack
              spacing={0}
              align="stretch">
              {options.length > 0 ? (
                options.map((option, index) => (
                  <Box
                    key={index}
                    onClick={() => handleSelect(option)}
                    px="16px"
                    py="8px"
                    cursor={option.isDisabled ? "not-allowed" : "pointer"}
                    bg={
                      value.includes(option.value) ? "blue.50" : "transparent"
                    }
                    color={option.isDisabled ? "gray.400" : color}
                    opacity={option.isDisabled ? 0.6 : 1}
                    _hover={{
                      bg: option.isDisabled ? "transparent" : "gray.50",
                    }}
                    transition="all 0.2s ease">
                    <HStack
                      justify="space-between"
                      align="center">
                      <Text fontSize="16px">{option.label}</Text>
                      {value.includes(option.value) && (
                        <LuCheck
                          size={16}
                          color="var(--chakra-colors-blue-500)"
                        />
                      )}
                    </HStack>
                  </Box>
                ))
              ) : (
                <Box
                  px="16px"
                  py="8px"
                  color="gray.500"
                  textAlign="center">
                  <Text fontSize="16px">No options</Text>
                </Box>
              )}
            </VStack>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default memo(MultiSelect);
