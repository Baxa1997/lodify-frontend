import {Flex, Button, Box, Text} from "@chakra-ui/react";
import HFRadio from "@components/HFRadio";
import React from "react";
import {useForm} from "react-hook-form";

const RatingPage = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const checkBoxes = [
    {
      label: "SmartWay",
      value: "smartway",
    },
    {
      label: "Fast",
      value: "fast",
    },
    {
      label: "Carb",
      value: "carb",
    },
    {
      label: "Safetiy Permit (HM 232)",
      value: "safety_permit",
    },
    {
      label: "C-TPAT",
      value: "ctpat",
    },
    {
      label: "TWIC",
      value: "twic",
    },
    {
      label: "HazMat Certification",
      value: "hazmat_certification",
    },
  ];

  return (
    <>
      <Box
        w="400px"
        h="calc(100vh - 230px)"
        mx={"auto"}
        p="20px"
        pb="0"
        border="2px solid #D5D7DA"
        outline="6px solid #f3f4f5"
        borderRadius="12px"
        position="relative">
        <Box mb="26px">
          <Text color="#181D27" fontWeight="600" fontSize="18px">
            Review your carrier certifications
          </Text>
          <Text mt="4px" color="#535862" fontSize="16px" fontWeight="400">
            Enter the code we just sent to the mobile number you entered.
          </Text>
        </Box>

        <Box id="scrollbar_none" overflowY="scroll" height="70%">
          {checkBoxes.map((item, index) => (
            <Box
              key={item.value}
              mb={index !== checkBoxes.length - 1 ? "20px" : "0"}>
              <Text mb="6px">{item.label}</Text>
              <Flex gap="16px">
                <Flex
                  gap="12px"
                  w="172px"
                  h="52px"
                  border="1px solid #D5D7DA"
                  borderRadius="12px"
                  p="14px"
                  bg="#FAFAFA"
                  alignItems="center">
                  <HFRadio
                    style={{color: "#fff"}}
                    control={control}
                    name={item.value}
                    value="yes"
                  />
                  <Text>Yes</Text>
                </Flex>

                <Flex
                  gap="12px"
                  w="172px"
                  h="52px"
                  border="1px solid #D5D7DA"
                  borderRadius="12px"
                  p="14px"
                  bg="#FAFAFA"
                  alignItems="center">
                  <HFRadio
                    style={{color: "#fff"}}
                    control={control}
                    name={item.value}
                    value="no"
                  />
                  <Text>No</Text>
                </Flex>
              </Flex>
            </Box>
          ))}

          <Button
            position="absolute"
            bottom="20px"
            left="0"
            right="0"
            w="90%"
            h="40px"
            bg="#fff"
            mx="auto"
            color="#414651"
            border={"1px solid #D5D7DA"}
            _hover={{bg: "#fafafa"}}>
            Add other Certificate
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default RatingPage;
