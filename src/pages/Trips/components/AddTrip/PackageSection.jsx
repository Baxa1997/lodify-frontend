import React, { useState } from "react";
import { Box, Flex, Text, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import { htmlToString } from "@utils/htmlToString";

const PackageSection = ({ control, setValue }) => {
  const [selectedPackage, setSelectedPackage] = useState("");

  const { data: packageList, isLoading } = useQuery({
    queryKey: ["GET_PACKAGE_LIST"],
    queryFn: () => tripsService.getPackageList(),
    select: (res) => res?.data?.response ?? [],
  });

  return (
    <Box
      mb="32px"
      mt="24px">
      <Text
        fontSize="24px"
        fontWeight="600"
        color="#181D27"
        mb="8px">
        Choose the Right Plan for Your Freight
      </Text>
      <Text
        fontSize="16px"
        color="#717680"
        mb="24px">
        From standard shipments to high-value cargo, Lodify offers tiered
        protection to fit your needs.
      </Text>

      <Controller
        name="lodify_fees_id"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onChange={(value) => {
              field.onChange(value);
              setSelectedPackage(value);
            }}>
            <Flex
              gap="16px"
              flexWrap="wrap">
              {packageList?.map((pkg) => (
                <Box
                  key={pkg.guid}
                  flex="1"
                  minW="280px"
                  maxW="320px"
                  p="24px"
                  bg="white"
                  borderRadius="12px"
                  border="2px solid"
                  borderColor={
                    selectedPackage === pkg.guid ? "#FF6B35" : "#E9EAEB"
                  }
                  position="relative"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    borderColor:
                      selectedPackage === pkg.id ? "#FF6B35" : "#D5D7DA",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={() => {
                    field.onChange(pkg.guid);
                    setValue("service_fee", pkg.amount);
                    setSelectedPackage(pkg.guid);
                  }}>
                  <Radio
                    value={pkg.guid}
                    position="absolute"
                    top="16px"
                    right="16px"
                    colorScheme="orange"
                    size="lg"
                  />

                  <Box
                    fontSize="32px"
                    mb="16px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="40px"
                    h="40px"
                    bg={"transparent"}
                    borderRadius="8px">
                    <img
                      src={pkg?.image_url}
                      alt="" />
                  </Box>

                  <Text
                    fontSize="18px"
                    fontWeight="600"
                    color="#181D27"
                    mb="8px">
                    {pkg.label}
                  </Text>

                  <Text
                    fontSize="14px"
                    color="#717680"
                    mb="16px"
                    lineHeight="1.5"
                    minH="42px">
                    {htmlToString(pkg.description)}
                  </Text>

                  <Text
                    fontSize="24px"
                    fontWeight="600"
                    color="#181D27"
                    mb="12px">
                    ${pkg.amount ?? 0}{" "}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#717680",
                      }}>
                      Per Load
                    </span>
                  </Text>

                  <Text
                    fontSize="14px"
                    color="#FF6B35"
                    fontWeight="500"
                    cursor="pointer"
                    _hover={{
                      textDecoration: "underline",
                    }}>
                    More Details
                  </Text>
                </Box>
              ))}
            </Flex>
          </RadioGroup>
        )}
      />
    </Box>
  );
};

export default PackageSection;
