import React from "react";
import IdentityStep from "./steps/IdentityStep";
import OperationsStep from "./steps/OperationsStep";
// import CoverageMapStep from "./steps/CoverageMapStep";
import CertificationsStep from "./steps/CertificationsStep";
import InsuranceStep from "./steps/InsuranceStep";
import PaymentStep from "./steps/PaymentStep";
import QuestionnaireStep from "./steps/QuestionnaireStep";
import ContractStep from "./steps/ContractStep";

const StepRenderer = ({
  currentStep,
  control,
  watch,
  setValue,
  identitySubView = 1,
  insuranceSubView = 1,
  paymentSubView = 1,
  contractSubView = 1,
  isEditable = false,
  onPaymentOtpSent,
  onPaymentOtpVerified,
  onPaymentOtpSkip,
}) => {
  switch (currentStep) {
    case 1:
      return (
        <IdentityStep
          control={control}
          setValue={setValue}
          subView={identitySubView}
          isEditable={isEditable}
        />
      );
    case 2:
      return <OperationsStep control={control} isEditable={isEditable} />;
    // case 3:
    //   return <CoverageMapStep control={control} isEditable={isEditable} />;
    case 3:
      return <CertificationsStep control={control} isEditable={isEditable} />;
    case 4:
      return (
        <InsuranceStep
          control={control}
          subView={insuranceSubView}
          isEditable={isEditable}
        />
      );
    case 5:
      return (
        <PaymentStep
          control={control}
          watch={watch}
          setValue={setValue}
          subView={paymentSubView}
          isEditable={isEditable}
          onOtpSent={onPaymentOtpSent}
          onOtpVerified={onPaymentOtpVerified}
          onSkipOtp={onPaymentOtpSkip}
        />
      );
    case 6:
      return (
        <QuestionnaireStep
          control={control}
          setValue={setValue}
          isEditable={isEditable}
        />
      );
    case 7:
      return (
        <ContractStep
          control={control}
          subView={contractSubView}
          isEditable={isEditable}
        />
      );
    default:
      return null;
  }
};

export default StepRenderer;
