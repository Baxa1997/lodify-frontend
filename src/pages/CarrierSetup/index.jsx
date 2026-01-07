import {Flex} from "@chakra-ui/react";
import SetupSidebar from "./components/SetupSidebar";
import SetupMain from "./components/SetupMain";
import styles from "./CarrierSetup.module.scss";
import {useCarrierSetupProps} from "./components/useCarrierSetupProps";

const CarrierSetup = () => {
  const {
    steps,
    control,
    watch,
    setValue,
    currentStep,
    isConnecting,
    paymentSubView,
    identitySubView,
    insuranceSubView,
    contractSubView,
    isInsuranceLoading,
    isConfirmModalOpen,
    handleNext,
    handleBack,
    handleStepChange,
    handleConfirmAddCarrier,
    handleCancelAddCarrier,
    handlePaymentOtpSent,
    handlePaymentOtpVerified,
    handlePaymentOtpSkip,
    isEditable,
    canSkipSetup,
    handleSkipSetup,
    isCarrierSetup,
    showSuccess,
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
        watch={watch}
        setValue={setValue}
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        identitySubView={identitySubView}
        insuranceSubView={insuranceSubView}
        paymentSubView={paymentSubView}
        contractSubView={contractSubView}
        isInsuranceLoading={isInsuranceLoading}
        isConfirmModalOpen={isConfirmModalOpen}
        isConnecting={isConnecting}
        onConfirmAddCarrier={handleConfirmAddCarrier}
        onCancelAddCarrier={handleCancelAddCarrier}
        onPaymentOtpSent={handlePaymentOtpSent}
        onPaymentOtpVerified={handlePaymentOtpVerified}
        onPaymentOtpSkip={handlePaymentOtpSkip}
        isEditable={isEditable}
        canSkipSetup={canSkipSetup}
        onSkipSetup={handleSkipSetup}
        isCarrierSetup={isCarrierSetup}
        showSuccess={showSuccess}
      />
    </Flex>
  );
};

export default CarrierSetup;
