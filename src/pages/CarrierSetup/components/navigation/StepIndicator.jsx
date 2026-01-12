import React from "react";
import {Box, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import styles from "../../CarrierSetup.module.scss";

const StepIndicator = ({steps, currentStep, handleStepChange = () => {}}) => {
  const navigate = useNavigate();
  const canNavigateToStep = (stepId) => {
    const targetStep = steps.find((s) => s.id === stepId);
    const currentStepData = steps.find((s) => s.id === currentStep);
    
    // Can navigate to:
    // 1. Any completed step
    // 2. The current step
    // 3. The next step if current step is completed
    return (
      targetStep?.completed ||
      stepId === currentStep ||
      (stepId === currentStep + 1 && currentStepData?.completed)
    );
  };

  return (
    <Box className={styles.steps}>
      <Box
        mb="30px"
        cursor="pointer"
        onClick={() => navigate("/admin/dashboard")}>
        <img src="/img/logoLodify.svg" alt="Lodify Logo" />
      </Box>
      {steps.map((step, index) => {
        const isCompleted = step.completed;
        const isActive = step.active;
        const isPending = !isCompleted && !isActive;
        const canNavigate = canNavigateToStep(step.id);

        return (
          <Box
            key={step.id}
            cursor={canNavigate ? "pointer" : "not-allowed"}
            onClick={() => canNavigate && handleStepChange(step.id)}
            className={`${styles.step} ${isActive ? styles.active : ""} ${
              isCompleted ? styles.completed : ""
            } ${isPending ? styles.pending : ""} ${
              !canNavigate ? styles.disabled : ""
            }`}>
            <Box className={styles.stepIndicator}>
              {isCompleted ? (
                <Box className={styles.checkmark}>✓</Box>
              ) : isActive ? (
                <Box className={styles.activeDot}></Box>
              ) : (
                <Box className={styles.pendingDot}></Box>
              )}
            </Box>

            <Text className={styles.stepTitle}>{step.title}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

export default StepIndicator;
