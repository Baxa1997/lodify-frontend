import React, { useState, useRef, useEffect, memo } from "react";
import { Box, Text, VStack, HStack, IconButton } from "@chakra-ui/react";
import { LuChevronDown, LuCheck } from "react-icons/lu";
import { MdOutlineClear } from "react-icons/md";

const Select = ({
  placeholder = "Select an option",
  options = [],
  value,
  onChange = () => {},
  size = "md",
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
  isClearable = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((option) => value && option.value === value);
  console.log({ value });
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
    if (onChange) {
      onChange(option ? option.value : option);
    }
    setIsOpen(false);
    setIsFocused(false);
  };

  const getSizeStyles = () => {
    switch (size) {
    case "sm":
      return { height: "32px", py: "6px", px: "12px", fontSize: "14px" };
    case "lg":
      return { height: "48px", py: "12px", px: "20px", fontSize: "18px" };
    default:
      return { height: "40px", py: "8px", px: "16px", fontSize: "16px" };
    }
  };

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
          position="relative"
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
          borderRadius="lg"
          pr={showIcon ? "40px" : "20px"}
          pl="16px"
          cursor={isDisabled ? "not-allowed" : "pointer"}
          opacity={isDisabled ? 0.6 : 1}
          transition="all 0.2s ease"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          _hover={{
            borderColor: isDisabled ? borderColor : focusBorderColor,
          }}
          _focus={{
            outline: "none",
            borderColor: isInvalid ? errorBorderColor : focusBorderColor,
            boxShadow: `0 0 0 1px var(--chakra-colors-${
              isInvalid ? "red" : "blue"
            }-400)`,
          }}
          {...getSizeStyles()}>
          <Text
            color={selectedOption ? color : placeholderStyle.color}
            fontSize={selectedOption ? "inherit" : placeholderStyle.fontSize}>
            {selectedOption ? selectedOption.label : placeholder}
          </Text>
          {
            isClearable && selectedOption && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect("");
                }}
                style={{ padding: "6px", marginRight: "24px" }}>
                <MdOutlineClear />
              </button>
            )
          }

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
                    bg={option.value === value ? "blue.50" : "transparent"}
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
                      {option.value === value && (
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

export default memo(Select);
