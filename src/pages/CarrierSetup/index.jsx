import React, {useState} from "react";
import {Flex} from "@chakra-ui/react";
import SetupSidebar from "./components/SetupSidebar";
import SetupMain from "./components/SetupMain";
import styles from "./CarrierSetup.module.scss";
import {useForm} from "react-hook-form";

const CarrierSetup = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
    reset,
  } = useForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const steps = [
    {
      id: 1,
      title: "Identity",
      completed: completedSteps.has(1),
      active: currentStep === 1,
    },
    {
      id: 2,
      title: "Operations",
      completed: completedSteps.has(2),
      active: currentStep === 2,
    },
    {
      id: 3,
      title: "Coverage Map",
      completed: completedSteps.has(3),
      active: currentStep === 3,
    },
    {
      id: 4,
      title: "Certifications",
      completed: completedSteps.has(4),
      active: currentStep === 4,
    },
    {
      id: 5,
      title: "Insurance",
      completed: completedSteps.has(5),
      active: currentStep === 5,
    },
    {
      id: 6,
      title: "Payment",
      completed: completedSteps.has(6),
      active: currentStep === 6,
    },
    {
      id: 7,
      title: "Questionnaire",
      completed: completedSteps.has(7),
      active: currentStep === 7,
    },
    {
      id: 8,
      title: "Contract",
      completed: completedSteps.has(8),
      active: currentStep === 8,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (step) => {
    if (
      step <= currentStep ||
      (step === currentStep + 1 && completedSteps.has(currentStep))
    ) {
      setCurrentStep(step);
    }
  };

  return (
    <Flex className={styles.multiStepContainer} minHeight="100vh">
      <SetupSidebar
        steps={steps}
        currentStep={currentStep}
        handleStepChange={handleStepChange}
      />
      <SetupMain
        control={control}
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
      />
    </Flex>
  );
};

export default CarrierSetup;
