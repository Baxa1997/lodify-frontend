import React from "react";
import {Box, Text, Flex, Button} from "@chakra-ui/react";
import StepRenderer from "./StepRenderer";
import styles from "../CarrierSetup.module.scss";

const SetupMain = ({
  currentStep,
  control,
  onNext = () => {},
  onBack = () => {},
  identitySubView = 1,
}) => {
  return (
    <Box className={styles.mainContent} position={"relative"}>
      <Flex
        width="100%"
        bg="#FAFAFA"
        p="6px 24px"
        gap="16px"
        borderBottom={"1px solid #d6d7da"}>
        <Flex
          bg="#fff"
          border={"1px solid #d6d7da"}
          alignItems="center"
          justifyContent="center"
          w="52px"
          h="53px"
          borderRadius="12px">
          <img src="/img/registerUserIcon.svg" alt="" width="28px" h="28px" />
        </Flex>

        <Box>
          <Text color="#181D27" fontWeight="600" fontSize="16px">
            Carrier Setup
          </Text>
          <Text mt="4px" color="#535862" fontSize="13px" fontWeight="400">
            Complete your carrier profile
          </Text>
        </Box>
      </Flex>
      <Box className={styles.formContainer}>
        <StepRenderer
          currentStep={currentStep}
          control={control}
          onNext={onNext}
          onBack={onBack}
          identitySubView={identitySubView}
        />

        <Flex
          position={"absolute"}
          bottom={"0"}
          left={"0"}
          right={"0"}
          bg={"#fff"}
          p={"4px 12px"}
          borderTop={"1px solid #d6d7da"}
          justifyContent="space-between"
          alignItems="center">
          <Flex
            alignItems="center"
            gap="8px"
            cursor="pointer"
            onClick={onBack}
            color="#535862">
            <img src="/img/backArrow.svg" alt="arrow-left" />
            <Text fontSize="14px" fontWeight="400">
              Back
            </Text>
          </Flex>

          <Text fontSize="14px" color="#6B7280">
            Is this information correct?
          </Text>

          <Flex gap="12px">
            <Button
              variant="outline"
              borderColor="#D1D5DB"
              color="#374151"
              fontSize="14px"
              fontWeight="500"
              px="20px"
              py="6px"
              borderRadius="8px"
              _hover={{bg: "#F9FAFB"}}>
              No, Edit
            </Button>
            <Button
              bg="#EF6820"
              color="white"
              fontSize="14px"
              fontWeight="600"
              px="20px"
              py="6px"
              borderRadius="8px"
              _hover={{bg: "#DC5A1A"}}
              onClick={onNext}>
              Yes, continue
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default SetupMain;
