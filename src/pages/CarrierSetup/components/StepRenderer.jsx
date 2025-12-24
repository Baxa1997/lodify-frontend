import React from "react";
import IdentityStep from "./steps/IdentityStep";
import OperationsStep from "./steps/OperationsStep";
import CoverageMapStep from "./steps/CoverageMapStep";
import CertificationsStep from "./steps/CertificationsStep";
import InsuranceStep from "./steps/InsuranceStep";
import PaymentStep from "./steps/PaymentStep";
import QuestionnaireStep from "./steps/QuestionnaireStep";
// import ContractStep from "./steps/ContractStep";

const StepRenderer = ({
  currentStep,
  control,
  onNext = () => {},
  onBack = () => {},
}) => {
  switch (currentStep) {
    case 1:
      return <IdentityStep control={control} onNext={onNext} onBack={onBack} />;
    case 2:
      return (
        <OperationsStep control={control} onNext={onNext} onBack={onBack} />
      );
    case 3:
      return (
        <CoverageMapStep control={control} onNext={onNext} onBack={onBack} />
      );
    case 4:
      return (
        <CertificationsStep control={control} onNext={onNext} onBack={onBack} />
      );
    case 5:
      return (
        <InsuranceStep control={control} onNext={onNext} onBack={onBack} />
      );
    case 6:
      return <PaymentStep control={control} onNext={onNext} onBack={onBack} />;
    case 7:
      return (
        <QuestionnaireStep control={control} onNext={onNext} onBack={onBack} />
      );
    // case 8:
    // return <ContractStep onNext={onNext} onBack={onBack} />;
    default:
      return null;
  }
};

export default StepRenderer;
