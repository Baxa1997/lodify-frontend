import React, { useState } from "react";
import { Box, VStack, Text, Heading } from "@chakra-ui/react";
import Select from "./Select";

const SelectExample = () => {
  const [selectedDomicile, setSelectedDomicile] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  // Example options for domicile filter (matching the image)
  const domicileOptions = [
    { value: "", label: "Filter by Domicile(s)" },
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France" },
    { value: "jp", label: "Japan" },
  ];

  // Example options for country selection
  const countryOptions = [
    { value: "", label: "Select Country" },
    { value: "us", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "ca", label: "Canada" },
    { value: "au", label: "Australia" },
  ];

  return (
    <Box
      p={8}
      maxW="600px"
      mx="auto">
      <VStack
        spacing={6}
        align="stretch">
        <Heading
          size="lg"
          mb={4}>
          Select Component Examples
        </Heading>

        {/* Default Select - matches the image */}
        <Box>
          <Text
            mb={2}
            fontWeight="medium">
            Default Select (matches image):
          </Text>
          <Select
            placeholder="Filter by Domicile(s)"
            options={domicileOptions}
            value={selectedDomicile}
            onChange={setSelectedDomicile}
          />
        </Box>

        {/* Customized Select */}
        <Box>
          <Text
            mb={2}
            fontWeight="medium">
            Customized Select:
          </Text>
          <Select
            placeholder="Select Country"
            options={countryOptions}
            value={selectedCountry}
            onChange={setSelectedCountry}
            bg="gray.50"
            borderColor="gray.300"
            focusBorderColor="purple.400"
            color="gray.800"
            iconColor="purple.500"
          />
        </Box>

        {/* Disabled Select */}
        <Box>
          <Text
            mb={2}
            fontWeight="medium">
            Disabled Select:
          </Text>
          <Select
            placeholder="Disabled Select"
            options={domicileOptions}
            isDisabled={true}
          />
        </Box>

        {/* Error State Select */}
        <Box>
          <Text
            mb={2}
            fontWeight="medium">
            Error State Select:
          </Text>
          <Select
            placeholder="Error State"
            options={domicileOptions}
            isInvalid={true}
            errorBorderColor="red.500"
          />
        </Box>

        {/* Dark Theme Select */}
        <Box>
          <Text
            mb={2}
            fontWeight="medium">
            Dark Theme Select:
          </Text>
          <Select
            placeholder="Dark Theme"
            options={domicileOptions}
            bg="gray.800"
            borderColor="gray.600"
            color="white"
            placeholderStyle={{
              color: "#9CA3AF",
              fontSize: "16px",
            }}
            iconColor="#9CA3AF"
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default SelectExample;
