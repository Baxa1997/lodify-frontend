import {Flex} from "@chakra-ui/react";
import SetupSidebar from "./components/SetupSidebar";
import SetupMain from "./components/SetupMain";
import styles from "./CarrierSetup.module.scss";
import {useCarrierSetupProps} from "./components/useCarrierSetupProps";

const CarrierSetup = () => {
  const {
    control,
    steps,
    currentStep,
    handleStepChange,
    handleNext,
    handleBack,
    identitySubView,
    insuranceSubView,
    paymentSubView,
    contractSubView,
    isInsuranceLoading,
  } = useCarrierSetupProps();
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
        isInsuranceLoading={isInsuranceLoading}
      />
    </Flex>
  );
};

export default CarrierSetup;
