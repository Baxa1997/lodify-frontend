import React, {useState, useRef, useEffect, memo, useMemo} from "react";
import {Box, Text, VStack, HStack, Input, Badge, Flex} from "@chakra-ui/react";
import {LuChevronDown, LuCheck} from "react-icons/lu";
import {MdOutlineClear} from "react-icons/md";
import {LuSearch} from "react-icons/lu";

const SearchableSelectDrivers = ({
  placeholder = "Select drivers",
  options = [],
  value = [],
  onChange = () => {},
  maxSelections = 2,
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
  searchPlaceholder = "Search...",
  searchText = "",
  setSearchText = () => {},
  handleOptions = () => {},
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedValues = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return [value];
  }, [value]);

  const selectedOptions = useMemo(() => {
    return selectedValues
      .map((val) => {
        if (typeof val === "object" && val !== null) {
          const matchingOption = options.find((opt) => {
            if (opt.value === val.value) return true;
            if (opt.value && val.value) {
              if (String(opt.value) === String(val.value)) return true;
            }
            if (opt.label && val.label) {
              if (opt.label.toLowerCase() === val.label.toLowerCase())
                return true;
            }
            return false;
          });
          return matchingOption || val;
        }

        return options.find((opt) => {
          if (opt.value === val) return true;
          if (opt.value && val) {
            return String(opt.value) === String(val);
          }
          return false;
        });
      })
      .filter(Boolean);
  }, [selectedValues, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
        setSearchText("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearchText("");
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!isDisabled) {
      setIsOpen(!isOpen);
      setIsFocused(!isOpen);
    }
  };

  const handleSelect = (option) => {
    if (!option) return;

    handleOptions(option);

    // Check if option is already selected with multiple comparison methods
    const isSelected = selectedOptions.some((opt) => {
      // Direct value comparison
      if (opt.value === option.value) return true;
      // String comparison
      if (opt.value && option.value) {
        if (String(opt.value) === String(option.value)) return true;
      }
      // Label comparison
      if (opt.label && option.label) {
        if (opt.label.toLowerCase() === option.label.toLowerCase()) return true;
      }
      // Object reference comparison
      return opt === option;
    });

    let newSelection;
    if (isSelected) {
      // Remove the selected option
      newSelection = selectedOptions.filter((opt) => {
        // Use same comparison logic to find the one to remove
        if (opt.value === option.value) return false;
        if (opt.value && option.value) {
          if (String(opt.value) === String(option.value)) return false;
        }
        if (opt.label && option.label) {
          if (opt.label.toLowerCase() === option.label.toLowerCase())
            return false;
        }
        return opt !== option;
      });
    } else {
      // Add the option
      if (selectedOptions.length < maxSelections) {
        newSelection = [...selectedOptions, option];
      } else {
        // Remove first and add new (sliding window)
        newSelection = [...selectedOptions.slice(1), option];
      }
    }

    onChange(newSelection);

    // Don't close the dropdown - let user select multiple drivers
    // Only clear search text after selection
    setSearchText("");
  };

  const handleRemove = (optionToRemove, e) => {
    e.stopPropagation();
    const newSelection = selectedOptions.filter(
      (opt) => opt.value !== optionToRemove.value
    );
    onChange(newSelection);
  };

  const handleSearchChange = (e) => {
    const val = e?.target?.value ?? e ?? "";
    setSearchText(val);
  };

  const filteredOptions = options.filter((option) => {
    const searchValue = typeof searchText === "string" ? searchText : "";
    return option.label?.toLowerCase().includes(searchValue.toLowerCase());
  });

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {height: "32px", py: "6px", px: "12px", fontSize: "14px"};
      case "lg":
        return {height: "48px", py: "12px", px: "20px", fontSize: "18px"};
      default:
        return {height: "40px", py: "8px", px: "16px", fontSize: "16px"};
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
            <Box as="span" color="blue.500">
              *
            </Box>
          )}
        </Box>
      )}
      <Box position="relative" ref={dropdownRef} {...props}>
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
          {...getSizeStyles()}
          minH={selectedOptions.length > 0 ? "auto" : undefined}
          py={selectedOptions.length > 0 ? "4px" : undefined}>
          <Box
            flex="1"
            minW="0"
            overflow="hidden"
            pr={showIcon ? "30px" : "0"}
            display="flex"
            flexWrap="wrap"
            gap="4px"
            alignItems="center"
            minH="20px">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((opt, idx) => (
                <Badge
                  key={opt.value}
                  bg="transparent"
                  border="1px solid #D5D7DA"
                  color="#414651"
                  fontSize="13px"
                  fontWeight="400"
                  textTransform="none"
                  px="6px"
                  py="2px"
                  borderRadius="8px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap="4px"
                  w="48%">
                  <Text
                    fontSize="13px"
                    fontWeight="400"
                    textTransform="none"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    maxW="180px">
                    {opt.label}
                  </Text>
                  <Box
                    as="button"
                    onClick={(e) => handleRemove(opt, e)}
                    ml="2px"
                    _hover={{opacity: 0.7}}
                    cursor="pointer"
                    flexShrink={0}>
                    <MdOutlineClear size={12} />
                  </Box>
                </Badge>
              ))
            ) : (
              <Text
                color={placeholderStyle.color}
                fontSize={placeholderStyle.fontSize}>
                {placeholder}
              </Text>
            )}
            {selectedOptions.length < maxSelections && (
              <Text
                color={placeholderStyle.color}
                fontSize="11px"
                ml={selectedOptions.length > 0 ? "4px" : "0"}
                flexShrink={0}>
                ({selectedOptions.length}/{maxSelections})
              </Text>
            )}
          </Box>
          {isClearable && selectedOptions.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              style={{padding: "6px", marginRight: "24px", flexShrink: 0}}>
              <MdOutlineClear />
            </button>
          )}

          {showIcon && (
            <Box
              position="absolute"
              right="12px"
              top="50%"
              color={iconColor}
              zIndex={2}
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
            maxH="300px"
            overflow="hidden"
            display="flex"
            flexDirection="column"
            mt={dropdownPosition === "top" ? "0" : "2px"}
            mb={dropdownPosition === "top" ? "2px" : "0"}>
            <Box p="8px" borderBottom="1px solid" borderColor="gray.200">
              <Box position="relative">
                <Box
                  position="absolute"
                  left="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.400"
                  zIndex={1}
                  pointerEvents="none">
                  <LuSearch size={16} />
                </Box>
                <Input
                  ref={searchInputRef}
                  value={searchText}
                  onChange={handleSearchChange}
                  placeholder={searchPlaceholder}
                  pl="36px"
                  pr="12px"
                  py="8px"
                  fontSize="14px"
                  border="1px solid"
                  borderColor="gray.300"
                  borderRadius="md"
                  _focus={{
                    borderColor: focusBorderColor,
                    boxShadow: `0 0 0 1px var(--chakra-colors-blue-400)`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsOpen(false);
                      setSearchText("");
                    }
                  }}
                />
              </Box>
            </Box>

            <Box overflowY="auto" maxH="200px">
              <VStack spacing={0} align="stretch">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => {
                    const isSelected = selectedOptions.some((opt) => {
                      if (opt.value === option.value) return true;
                      if (opt.value && option.value) {
                        if (String(opt.value) === String(option.value))
                          return true;
                      }
                      if (opt.label && option.label) {
                        if (
                          opt.label.toLowerCase() === option.label.toLowerCase()
                        )
                          return true;
                      }

                      return opt === option;
                    });
                    const isDisabled = option.isDisabled || false;

                    return (
                      <Box
                        key={index}
                        onClick={() => handleSelect(option)}
                        px="16px"
                        py="8px"
                        cursor={isDisabled ? "not-allowed" : "pointer"}
                        bg={isSelected ? "blue.50" : "transparent"}
                        color={isDisabled ? "gray.400" : color}
                        opacity={isDisabled ? 0.6 : 1}
                        _hover={{
                          bg: isDisabled ? "transparent" : "gray.50",
                        }}
                        transition="all 0.2s ease">
                        <HStack justify="space-between" align="center">
                          <Text fontSize="16px">{option.label}</Text>
                          {isSelected && (
                            <LuCheck
                              size={16}
                              color="var(--chakra-colors-blue-500)"
                            />
                          )}
                        </HStack>
                      </Box>
                    );
                  })
                ) : (
                  <Box px="16px" py="8px" color="gray.500" textAlign="center">
                    <Text fontSize="16px">
                      {searchText ? "No results found" : "No options"}
                    </Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default memo(SearchableSelectDrivers);
