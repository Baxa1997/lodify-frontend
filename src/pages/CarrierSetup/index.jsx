import React, {useEffect, useState} from "react";
import {Flex} from "@chakra-ui/react";
import SetupSidebar from "./components/SetupSidebar";
import SetupMain from "./components/SetupMain";
import styles from "./CarrierSetup.module.scss";
import {useForm} from "react-hook-form";
import {useQuery} from "@tanstack/react-query";
import carrierService from "@services/carrierService";
import {useSearchParams} from "react-router-dom";

const CarrierSetup = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const {data: carrierData} = useQuery({
    queryKey: ["carrier", id],
    queryFn: () => carrierService.getCarrierSetupData(id),
    enabled: Boolean(id),
    select: (res) => res.data?.response || {},
  });

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
  const [identitySubView, setIdentitySubView] = useState(1);
  const [insuranceSubView, setInsuranceSubView] = useState(1);
  const [paymentSubView, setPaymentSubView] = useState(1);
  const [contractSubView, setContractSubView] = useState(1);

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
    if (currentStep === 1 && identitySubView === 1) {
      setIdentitySubView(2);
      return;
    }

    if (currentStep === 1 && identitySubView === 2) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(2);
      setIdentitySubView(1);
      return;
    }

    if (currentStep === 5 && insuranceSubView === 1) {
      setInsuranceSubView(2);
      return;
    }

    if (currentStep === 5 && insuranceSubView === 2) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(6);
      setInsuranceSubView(1);
      return;
    }

    if (currentStep === 6 && paymentSubView < 6) {
      setPaymentSubView(paymentSubView + 1);
      return;
    }

    if (currentStep === 6 && paymentSubView === 6) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(7);
      setPaymentSubView(1);
      return;
    }

    if (currentStep === 8 && contractSubView === 1) {
      setContractSubView(2);
      return;
    }

    if (currentStep === 8 && contractSubView === 2) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setContractSubView(1);
      return;
    }

    if (currentStep < steps.length) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 1 && identitySubView === 2) {
      setIdentitySubView(1);
      return;
    }

    if (currentStep === 5 && insuranceSubView === 2) {
      setInsuranceSubView(1);
      return;
    }

    if (currentStep === 6 && paymentSubView > 1) {
      setPaymentSubView(paymentSubView - 1);
      return;
    }

    if (currentStep === 8 && contractSubView === 2) {
      setContractSubView(1);
      return;
    }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);

      if (currentStep === 2) {
        setIdentitySubView(1);
      }
      if (currentStep === 6) {
        setInsuranceSubView(1);
      }
      if (currentStep === 7) {
        setPaymentSubView(1);
      }
      if (currentStep === 8) {
        setContractSubView(1);
      }
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

  useEffect(() => {
    if (Boolean(carrierData?.guid)) {
      reset(carrierData);
    }
  }, [carrierData]);

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
        identitySubView={identitySubView}
        insuranceSubView={insuranceSubView}
        paymentSubView={paymentSubView}
        contractSubView={contractSubView}
      />
    </Flex>
  );
};

export default CarrierSetup;
