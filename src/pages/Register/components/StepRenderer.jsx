import CompanyDetails from "./forms/CompanyDetails";
import AddressDetails from "./forms/AddressDetails";
import ContactDetails from "./forms/ContactDetails";
import VerificationStep from "./forms/VerificationStep";
import { useGetLodify } from "@services/lodify-user.service";

const StepRenderer = ({
  currentStep,
  control,
  errors,
  watch,
  setValue,
  onSubmit,
  reset = () => {},
  getValues = () => {},
  onNext = () => {},
  registerSuccess = false,
}) => {
  switch (currentStep) {
  case 1:
    return (
      <CompanyDetails
        control={control}
        errors={errors}
        setValue={setValue}
        watch={watch}
        onNext={onNext}
        reset={reset}
        getValues={getValues}
      />
    );
  case 2:
    return (
      <AddressDetails
        control={control}
        errors={errors}
        watch={watch}
        onNext={onNext}
        setValue={setValue}
      />
    );
  case 3:
    return (
      <ContactDetails
        control={control}
        errors={errors}
        onNext={onNext} />
    );
  case 4:
    return (
      <VerificationStep
        watch={watch}
        setValue={setValue}
        onSubmit={onSubmit}
        onNext={onNext}
        control={control}
        registerSuccess={registerSuccess}
      />
    );
  default:
    return null;
  }
};

export default StepRenderer;
