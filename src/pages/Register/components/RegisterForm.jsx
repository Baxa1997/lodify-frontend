import React from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import StepRenderer from "./StepRenderer";
import styles from "../MultiStepRegister.module.scss";

const RegisterForm = ({
  currentStep,
  steps,
  errors,
  control,
  watch,
  setValue,
  handleSubmit,
  onNext = () => {},
  onBack = () => {},
  isLoading,
  getStepValidation,
  registerSuccess = false,
  onSubmit = () => {},
  getValues = () => {},
  handleStepChange = () => {},
  reset,
}) => {
  return (
    <Box className={styles.mainContent}>
      <Flex
        width="100%"
        bg="#FAFAFA"
        p="20px 24px"
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
          <img
            src="/img/registerUserIcon.svg"
            alt=""
            width="28px"
            h="28px" />
        </Flex>

        <Box>
          <Text
            color="#181D27"
            fontWeight="600"
            fontSize="16px">
            Create your account
          </Text>
          <Text
            mt="4px"
            color="#535862"
            fontSize="13px"
            fontWeight="400">
            Select Carrier
          </Text>
        </Box>
      </Flex>
      <Box className={styles.formContainer}>
        <Box
          width="100%"
          as="form"
          onSubmit={handleSubmit}>
          <StepRenderer
            control={control}
            currentStep={currentStep}
            errors={errors}
            watch={watch}
            setValue={setValue}
            onSubmit={onSubmit}
            getValues={getValues}
            reset={reset}
            onNext={onNext}
            handleStepChange={handleStepChange}
            registerSuccess={registerSuccess}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterForm;
