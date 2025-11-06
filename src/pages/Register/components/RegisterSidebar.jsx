import React from "react";
import { Box, Text } from "@chakra-ui/react";
import StepIndicator from "./navigation/StepIndicator";
import styles from "../MultiStepRegister.module.scss";

const RegisterSidebar = ({ steps, currentStep, handleStepChange = () => {} }) => {
  return (
    <Box className={styles.sidebar}>
      <StepIndicator
        handleStepChange={handleStepChange}
        steps={steps}
        currentStep={currentStep}
      />

      <Box className={styles.sidebarFooter}>
        <Box className={styles.footerLeft}>© Lodify 2025</Box>
      </Box>
    </Box>
  );
};

export default RegisterSidebar;
