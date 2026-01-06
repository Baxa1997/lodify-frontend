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
  const carrierSetup = searchParams.get("carrier_setup");
  const isEditable = carrierSetup === "true";

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

  // Step-specific API handlers
  const [stepLoadingStates, setStepLoadingStates] = useState({
    identity: false,
    operations: false,
    certifications: false,
    insurance: false,
    payment: false,
    questionnaire: false,
    contract: false,
  });

  const handleIdentitySubmit = async () => {
    setStepLoadingStates((prev) => ({...prev, identity: true}));
    try {
      const formData = watch();
      const identityData = formData.identity || {};
      const payload = {
        companies_id: carrierData?.guid || id || "",
        legal_name: identityData.legal_name || "",
        us_dot_number: identityData.us_dot_number || "",
        phy_street: identityData.phy_street || "",
        phy_city: identityData.phy_city || "",
        phy_state: identityData.phy_state || "",
        phy_zip: identityData.phy_zip || "",
        phy_country: identityData.phy_country || "",
        telephone: identityData.telephone || "",
        email: identityData.email || "",
        company_officer_1: identityData.company_officer_1 || "",
        company_officer_2: identityData.company_officer_2 || "",
      };
      await carrierService.updateIdentity(payload);
      setStepLoadingStates((prev) => ({...prev, identity: false}));
      return true;
    } catch (error) {
      console.error("Identity API error:", error);
      setStepLoadingStates((prev) => ({...prev, identity: false}));
      return false;
    }
  };

  const handleOperationsSubmit = async () => {
    setStepLoadingStates((prev) => ({...prev, operations: true}));
    try {
      const formData = watch();
      const operationsData = formData.operations || {};
      const payload = {
        companies_id: carrierData?.guid || id || "",
        power_units: operationsData.power_units || "",
        total_drivers: operationsData.total_drivers || "",
        trailer_types: operationsData.trailer_types || [],
        models: operationsData.models || "",
        trailer_count: operationsData.trailer_count || "",
        specialization: operationsData.specialization || "",
      };
      await carrierService.updateOperations(payload);
      setStepLoadingStates((prev) => ({...prev, operations: false}));
      return true;
    } catch (error) {
      console.error("Operations API error:", error);
      setStepLoadingStates((prev) => ({...prev, operations: false}));
      return false;
    }
  };

  const handleCertificationsSubmit = async () => {
    setStepLoadingStates((prev) => ({...prev, certifications: true}));
    try {
      const formData = watch();
      const certificationsData = formData.certifications || {};
      const payload = {
        companies_id: carrierData?.guid || id || "",
        ...certificationsData,
      };
      await carrierService.updateCertifications(payload);
      setStepLoadingStates((prev) => ({...prev, certifications: false}));
      return true;
    } catch (error) {
      console.error("Certifications API error:", error);
      setStepLoadingStates((prev) => ({...prev, certifications: false}));
      return false;
    }
  };

  const handleInsuranceSubmit = async () => {
    setStepLoadingStates((prev) => ({...prev, insurance: true}));
    try {
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

      await carrierService.addInsuranceAgents(payload);
      setStepLoadingStates((prev) => ({...prev, insurance: false}));
      return true;
    } catch (error) {
      console.error("Insurance API error:", error);
      setStepLoadingStates((prev) => ({...prev, insurance: false}));
      return false;
    }
  };

  const handlePaymentSubmit = async () => {
    setStepLoadingStates((prev) => ({...prev, payment: true}));
    try {
      const formData = watch();
      const paymentData = formData.payment || {};
      const payload = {
        companies_id: carrierData?.guid || id || "",
        ...paymentData,
      };
      await carrierService.updatePayment(payload);
      setStepLoadingStates((prev) => ({...prev, payment: false}));
      return true;
    } catch (error) {
      console.error("Payment API error:", error);
      setStepLoadingStates((prev) => ({...prev, payment: false}));
      return false;
    }
  };

  const handleQuestionnaireSubmit = async () => {
    setStepLoadingStates((prev) => ({...prev, questionnaire: true}));
    try {
      const formData = watch();
      const questionnaireData = formData.questionnaire || {};
      const payload = {
        companies_id: carrierData?.guid || id || "",
        ...questionnaireData,
      };
      await carrierService.updateQuestionnaire(payload);
      setStepLoadingStates((prev) => ({...prev, questionnaire: false}));
      return true;
    } catch (error) {
      console.error("Questionnaire API error:", error);
      setStepLoadingStates((prev) => ({...prev, questionnaire: false}));
      return false;
    }
  };

  const handleContractSubmit = async () => {
    setStepLoadingStates((prev) => ({...prev, contract: true}));
    try {
      const formData = watch();
      const contractData = formData.contract || {};
      const payload = {
        companies_id: carrierData?.guid || id || "",
        ...contractData,
      };
      await carrierService.updateContract(payload);
      setStepLoadingStates((prev) => ({...prev, contract: false}));
      return true;
    } catch (error) {
      console.error("Contract API error:", error);
      setStepLoadingStates((prev) => ({...prev, contract: false}));
      return false;
    }
  };

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
    {
      id: 5,
      title: "Payment",
      completed: completedSteps.has(5),
      active: currentStep === 5,
    },
    {
      id: 6,
      title: "Questionnaire",
      completed: completedSteps.has(6),
      active: currentStep === 6,
    },
    {
      id: 7,
      title: "Contract",
      completed: completedSteps.has(7),
      active: currentStep === 7,
    },
  ];

  const handleNext = () => {
    if (currentStep === 1 && identitySubView === 1) {
      setIdentitySubView(2);
      return;
    }

    if (currentStep === 1 && identitySubView === 2) {
      // Just collect data and move to next step
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
      // Just collect data and move to next step
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(5);
      setInsuranceSubView(1);
      return;
    }

    if (currentStep === 5 && paymentSubView < 6) {
      setPaymentSubView(paymentSubView + 1);
      return;
    }

    if (currentStep === 5 && paymentSubView === 6) {
      // Just collect data and move to next step
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(6);
      setPaymentSubView(1);
      return;
    }

    if (currentStep === 7 && contractSubView === 1) {
      setContractSubView(2);
      return;
    }

    if (currentStep === 7 && contractSubView === 2) {
      setIsConfirmModalOpen(true);
      return;
    }

    // Just collect data and move to next step for all remaining steps
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

    if (currentStep === 5 && paymentSubView > 1) {
      setPaymentSubView(paymentSubView - 1);
      return;
    }

    if (currentStep === 7 && contractSubView === 2) {
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
      if (currentStep === 7) {
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

  const handlePaymentOtpSent = () => {
    setPaymentSubView(4);
  };

  const handlePaymentOtpVerified = () => {
    setPaymentSubView(5);
  };

  const mapCarrierDataToForm = (data) => {
    if (!data) return {};

    return {
      identity: {
        legal_name: data.legal_name || "",
        us_dot_number: data.us_dot_number || "",
        phy_street: data.phy_street || "",
        phy_city: data.phy_city || "",
        phy_state: data.phy_state || "",
        phy_zip: data.phy_zip || "",
        phy_country: data.phy_country || "",
        telephone: data.telephone || "",
        email: data.email || "",
        company_officer_1: data.company_officer_1 || "",
        company_officer_2: data.company_officer_2 || "",
      },
      operations: {
        power_units: data.power_units || "",
        total_drivers: data.total_drivers || "",
        trailer_types: data.trailer_types || [],
        models: data.models || "",
        trailer_count: data.trailer_count || "",
        specialization: data.specialization || "",
      },
      certifications: {
        // Certifications data will be handled separately if needed
      },
      insurance: {
        first_name: data.insurance?.first_name || "",
        last_name: data.insurance?.last_name || "",
        email: data.insurance?.email || "",
        phone: data.insurance?.phone || "",
        certificate: data.insurance?.certificate || [],
        commodity_type: data.insurance?.commodity_type || [],
        worker_compensation: data.insurance?.worker_compensation || "",
        compensation_insurance: data.insurance?.compensation_insurance || "",
        policy_number: data.insurance?.policy_number || "",
        effective_date: data.insurance?.effective_date || "",
        cancellation_date: data.insurance?.cancellation_date || "",
        issued_by: data.insurance?.issued_by || "",
        full_name: data.insurance?.full_name || "",
        phone_number: data.insurance?.phone_number || "",
        worker_email: data.insurance?.worker_email || "",
      },
      payment: {
        // Payment data will be handled separately if needed
      },
      questionnaire: {
        // Questionnaire data will be handled separately if needed
      },
      contract: {
        // Contract data will be handled separately if needed
      },
    };
  };

  useEffect(() => {
    if (Boolean(carrierData?.guid)) {
      const mappedData = mapCarrierDataToForm(carrierData);
      reset(mappedData);
    }
  }, [carrierData, reset]);

  const handleConfirmAddCarrier = async () => {
    if (!brokersId || !id) {
      console.error("Missing broker ID or carrier ID");
      return;
    }

    setIsConnecting(true);

    try {
      console.log("Submitting all step data...");

      const identitySuccess = await handleIdentitySubmit();
      if (!identitySuccess) {
        throw new Error("Failed to submit identity data");
      }

      const operationsSuccess = await handleOperationsSubmit();
      if (!operationsSuccess) {
        throw new Error("Failed to submit operations data");
      }

      const certificationsSuccess = await handleCertificationsSubmit();
      if (!certificationsSuccess) {
        throw new Error("Failed to submit certifications data");
      }

      const insuranceSuccess = await handleInsuranceSubmit();
      if (!insuranceSuccess) {
        throw new Error("Failed to submit insurance data");
      }

      const paymentSuccess = await handlePaymentSubmit();
      if (!paymentSuccess) {
        throw new Error("Failed to submit payment data");
      }

      const questionnaireSuccess = await handleQuestionnaireSubmit();
      if (!questionnaireSuccess) {
        throw new Error("Failed to submit questionnaire data");
      }

      const contractSuccess = await handleContractSubmit();
      if (!contractSuccess) {
        throw new Error("Failed to submit contract data");
      }

      const payload = {
        joined_at: new Date().toISOString(),
        brokers_id: brokersId,
        companies_id: carrierData?.guid || id || "",
      };

      await carrierService.addCarrier(payload);

      setIsConnecting(false);
      setIsConfirmModalOpen(false);
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setContractSubView(1);
      navigate(`/admin/carriers`);
    } catch (error) {
      setIsConnecting(false);
      console.error("Failed to complete carrier setup:", error);
      // Optionally show error message to user
    }
  };

  const handleCancelAddCarrier = () => {
    setIsConfirmModalOpen(false);
  };

  const canSkipSetup =
    carrierSetup === "true" || localStorage.getItem("carrierStatus") === "true";

  const handleSkipSetup = () => {
    navigate("/admin/dashboard");
  };

  return {
    currentStep,
    control,
    watch,
    setValue,
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
    handlePaymentOtpSent,
    handlePaymentOtpVerified,
    carrierData,
    id,
    isEditable,
    canSkipSetup,
    handleSkipSetup,
  };
};
