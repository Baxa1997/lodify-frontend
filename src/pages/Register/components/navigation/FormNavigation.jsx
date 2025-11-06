import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import styles from "../../MultiStepRegister.module.scss";

const FormNavigation = ({ steps, currentStep, onBack, isLoading }) => {
  return (
    <>
      <Flex
        className={styles.stepDots}
        justifyContent="center"
        gap="8px"
        marginBottom="20px">
        {steps.map((_, index) => (
          <Box
            key={index}
            className={`${styles.dot} ${
              index + 1 === currentStep ? styles.active : ""
            }`}
            width="8px"
            height="8px"
            borderRadius="50%"
            background={index + 1 === currentStep ? "#3b82f6" : "#e2e8f0"}
            transition="background-color 0.3s ease"
          />
        ))}
      </Flex>

      <Box
        className={styles.backLink}
        textAlign="center">
        <Link
          to={currentStep === 1 ? "/login" : "#"}
          onClick={currentStep > 1 ? onBack : undefined}
          style={{
            color: "#3b82f6",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "500",
          }}>
          ← Back to {currentStep === 1 ? "login" : "details"}
        </Link>
      </Box>
    </>
  );
};

export default FormNavigation;
