import React from "react";
import IdentityStep from "./steps/IdentityStep";
import OperationsStep from "./steps/OperationsStep";
import CoverageMapStep from "./steps/CoverageMapStep";
import CertificationsStep from "./steps/CertificationsStep";
import InsuranceStep from "./steps/InsuranceStep";
import PaymentStep from "./steps/PaymentStep";
import QuestionnaireStep from "./steps/QuestionnaireStep";
import ContractStep from "./steps/ContractStep";

const StepRenderer = ({
  currentStep,
  control,
  identitySubView = 1,
  insuranceSubView = 1,
  paymentSubView = 1,
  contractSubView = 1,
}) => {
  switch (currentStep) {
    case 1:
      return <IdentityStep control={control} subView={identitySubView} />;
    case 2:
      return <OperationsStep control={control} />;
    case 3:
      return <CoverageMapStep control={control} />;
    case 4:
      return <CertificationsStep control={control} />;
    case 5:
      return <InsuranceStep control={control} subView={insuranceSubView} />;
    case 6:
      return <PaymentStep control={control} subView={paymentSubView} />;
    case 7:
      return <QuestionnaireStep control={control} />;
    case 8:
      return <ContractStep control={control} subView={contractSubView} />;
    default:
      return null;
  }
};

export default StepRenderer;
