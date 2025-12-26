import {useNavigate, useSearchParams} from "react-router-dom";
import carrierService from "@services/carrierService";
import {useQuery} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {useState, useEffect} from "react";
import {useSelector} from "react-redux";

export const useCarrierSetupProps = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);

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
  const [isInsuranceLoading, setIsInsuranceLoading] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

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
    // {
    //   id: 3,
    //   title: "Coverage Map",
    //   completed: completedSteps.has(3),
    //   active: currentStep === 3,
    // },
    {
      id: 3,
      title: "Certifications",
      completed: completedSteps.has(3),
      active: currentStep === 3,
    },
    {
      id: 4,
      title: "Insurance",
      completed: completedSteps.has(4),
      active: currentStep === 4,
    },
    // {
    //   id: 6,
    //   title: "Payment",
    //   completed: completedSteps.has(6),
    //   active: currentStep === 6,
    // },
    // {
    //   id: 7,
    //   title: "Questionnaire",
    //   completed: completedSteps.has(7),
    //   active: currentStep === 7,
    // },
    {
      id: 5,
      title: "Contract",
      completed: completedSteps.has(5),
      active: currentStep === 5,
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

    if (currentStep === 4 && insuranceSubView === 1) {
      setInsuranceSubView(2);
      return;
    }

    if (currentStep === 4 && insuranceSubView === 2) {
      setIsInsuranceLoading(true);
      const formData = watch();
      const insuranceData = formData.insurance || {};

      const formatDate = (dateString) => {
        if (!dateString) return "";

        if (dateString.includes("T")) return dateString;

        return dateString ? `${dateString}T00:00:00.000Z` : "";
      };

      const payload = {
        first_name: insuranceData.first_name || "",
        last_name: insuranceData.last_name || "",
        email: insuranceData.email || "",
        phone: insuranceData.phone || "",
        certificate: insuranceData.certificate
          ? Array.isArray(insuranceData.certificate)
            ? insuranceData.certificate
            : [insuranceData.certificate]
          : [],
        commodity_type: insuranceData.commodity_type || [],
        worker_compensation:
          insuranceData.worker_compensation === "yes" ? true : false,
        compensation_insurance: insuranceData.compensation_insurance || "",
        policy_number: insuranceData.policy_number || "",
        effective_date: formatDate(insuranceData.effective_date),
        cancellation_date: formatDate(insuranceData.cancellation_date),
        issued_by: insuranceData.issued_by || "",
        full_name: insuranceData.full_name || "",
        phone_number: insuranceData.phone_number || "",
        worker_email: insuranceData.worker_email || "",
        companies_id: carrierData?.guid || id || "",
      };

      carrierService
        .addInsuranceAgents(payload)
        .then(() => {
          setIsInsuranceLoading(false);
          setCompletedSteps((prev) => new Set([...prev, currentStep]));
          setCurrentStep(5);
          setInsuranceSubView(1);
        })
        .catch((error) => {
          setIsInsuranceLoading(false);
          console.error("Insurance API error:", error);
        });
      return;
    }

    // if (currentStep === 6 && paymentSubView < 6) {
    //   setPaymentSubView(paymentSubView + 1);
    //   return;
    // }

    // if (currentStep === 6 && paymentSubView === 6) {
    //   setCompletedSteps((prev) => new Set([...prev, currentStep]));
    //   setCurrentStep(7);
    //   setPaymentSubView(1);
    //   return;
    // }

    if (currentStep === 5 && contractSubView === 1) {
      setContractSubView(2);
      return;
    }

    if (currentStep === 5 && contractSubView === 2) {
      // Show confirmation modal on final step
      setIsConfirmModalOpen(true);
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

    if (currentStep === 4 && insuranceSubView === 2) {
      setInsuranceSubView(1);
      return;
    }

    // if (currentStep === 6 && paymentSubView > 1) {
    //   setPaymentSubView(paymentSubView - 1);
    //   return;
    // }

    if (currentStep === 5 && contractSubView === 2) {
      setContractSubView(1);
      return;
    }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);

      if (currentStep === 2) {
        setIdentitySubView(1);
      }
      if (currentStep === 4) {
        setInsuranceSubView(1);
      }
      if (currentStep === 5) {
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

  const handleConfirmAddCarrier = () => {
    if (!brokersId || !id) {
      console.error("Missing broker ID or carrier ID");
      return;
    }

    setIsConnecting(true);

    const payload = {
      joined_at: new Date().toISOString(),
      brokers_id: brokersId,
      companies_id: carrierData?.guid || id || "",
    };

    carrierService
      .addCarrier(payload)
      .then(() => {
        setIsConnecting(false);
        setIsConfirmModalOpen(false);
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
        setContractSubView(1);
        navigate(`/admin/carriers`);
      })
      .catch((error) => {
        setIsConnecting(false);
        console.error("Failed to add carrier:", error);
      });
  };

  const handleCancelAddCarrier = () => {
    setIsConfirmModalOpen(false);
  };

  return {
    currentStep,
    control,
    watch,
    steps,
    handleStepChange,
    handleNext,
    handleBack,
    identitySubView,
    insuranceSubView,
    paymentSubView,
    contractSubView,
    isInsuranceLoading,
    isConfirmModalOpen,
    isConnecting,
    handleConfirmAddCarrier,
    handleCancelAddCarrier,
    carrierData,
    id,
  };
};
