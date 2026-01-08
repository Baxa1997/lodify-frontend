import {useNavigate, useSearchParams} from "react-router-dom";
import carrierService from "@services/carrierService";
import {useQuery} from "@tanstack/react-query";
import {useForm} from "react-hook-form";
import {useState, useEffect, useRef} from "react";
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
  const [showSuccess, setShowSuccess] = useState(false);

  const isSyncingRef = useRef(false);

  const normalizePhone = (phone) => {
    if (!phone) return "";
    if (phone.startsWith("+1")) return phone;
    if (phone.startsWith("1")) return `+${phone}`;
    const cleaned = phone.replace(/[^\d]/g, "");
    if (cleaned.length === 10) return `+1${cleaned}`;
    if (cleaned.length === 11 && cleaned.startsWith("1")) return `+${cleaned}`;
    return phone;
  };

  // READY CREATE CONTACT INFO
  const handleContactInfo = async () => {
    try {
      const formData = watch();
      const contactInfo = formData.contact_information || {};

      const payload = {
        companies_id: id || "",
        dispatch_name: contactInfo.dispatch_name || "",
        dispatch_email: contactInfo.dispatch_email || "",
        dispatch_phone: contactInfo.dispatch_phone || "",
        billing_name: contactInfo.billing_name || "",
        billing_email: contactInfo.billing_email || "",
        billing_phone: contactInfo.billing_phone || "",
        claims_name: contactInfo.claims_name || "",
        claims_email: contactInfo.claims_email || "",
        claims_phone: contactInfo.claims_phone || "",
        after_hours_name: contactInfo.after_hours_name || "",
        after_hours_email: contactInfo.after_hours_email || "",
        after_hours_phone: contactInfo.after_hours_phone || "",
      };
      await carrierService.createContactInfo(payload);
      return true;
    } catch (error) {
      console.error("Identity API error:", error);
      return false;
    }
  };

  // READY CREATE INSURANCE AGENTS
  const handleAgentSubmit = async () => {
    try {
      const formData = watch();
      const certificationsData = formData.certifications || {};
      const insuranceData = formData.insurance || {};
      const payload = {
        companies_id: id || "",
        first_name: certificationsData.first_name || "",
        last_name: certificationsData.last_name || "",
        email: certificationsData.email || "",
        phone: certificationsData.phone || "",
        certificate: certificationsData.certificate || [],
        commodity_type: insuranceData.commodity_type || [],
        worker_compensation: insuranceData.worker_compensation || "",
        compensation_insurance: insuranceData.compensation_insurance || "",
        policy_number: insuranceData.policy_number || "",
        effective_date: insuranceData.effective_date || "",
        cancellation_date: insuranceData.cancellation_date || "",
        issued_by: insuranceData.issued_by || "",
        full_name: insuranceData.full_name || "",
        phone_number: insuranceData.phone_number || "",
        worker_email: insuranceData.worker_email || "",
      };
      await carrierService.addInsuranceAgents(payload);

      return true;
    } catch (error) {
      console.error("Operations API error:", error);

      return false;
    }
  };

  // READY CREATE COMPANY PAYMENT
  const handlePaymentSubmit = async () => {
    try {
      const formData = watch();
      const paymentData = formData.payment || {};
      const payload = {
        companies_id: id || "",
        factoring_company_name: paymentData.factoring_company_name || "",
        telephone: paymentData.factoring_phone || "",
        email: paymentData.factoring_email || "",
        payment_type: [paymentData.payment_type || "Factoring"],
      };
      await carrierService.createItems("company_payment", payload);

      return true;
    } catch (error) {
      console.error("Certifications API error:", error);

      return false;
    }
  };

  const handleQuestionnaireSubmit = async () => {
    try {
      const formData = watch();
      const questionnaireData = formData.questionnaire?.questions || [];
      const payload = {
        objects: questionnaireData,
      };
      await carrierService.createItemsPatch("questionnaire", payload);
      return true;
    } catch (error) {
      console.error("Questionnaire API error:", error);
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

  const handleNext = async () => {
    // If brokersId is true and we're at step 5, always show only sub-view 5
    if (currentStep === 5 && brokersId) {
      if (paymentSubView !== 5) {
        setPaymentSubView(5);
        return;
      }
      // If already at sub-view 5, go to next step
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(6);
      setPaymentSubView(1);
      return;
    }

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
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(5);
      setInsuranceSubView(1);

      // If brokersId is true, show only the last UI (sub-view 5)
      if (brokersId) {
        setPaymentSubView(5);
      } else if (carrierSetup !== "true") {
        setPaymentSubView(5);
      } else {
        setPaymentSubView(1);
      }
      return;
    }

    // Skip to sub-view 5 if carrier_setup !== "true" (brokersId is already handled above)
    if (
      currentStep === 5 &&
      paymentSubView === 2 &&
      carrierSetup !== "true" &&
      !brokersId
    ) {
      setPaymentSubView(5);
      return;
    }

    if (currentStep === 5 && paymentSubView === 3) {
      if (carrierSetup !== "true" && !brokersId) {
        setPaymentSubView(5);
        return;
      }

      const formData = watch();
      const isOtpVerified = formData.payment?.phone_verified;
      const hasVerificationId = formData.payment?.verify_verification_id;

      if (!isOtpVerified) {
        if (!hasVerificationId) {
          console.warn(
            "Please send OTP first by clicking 'Send Verification Code' button"
          );
          return;
        } else {
          console.warn("OTP verification required before proceeding");
          return;
        }
      }

      setPaymentSubView(4);
      return;
    }

    if (
      currentStep === 5 &&
      paymentSubView === 4 &&
      carrierSetup !== "true" &&
      !brokersId
    ) {
      setPaymentSubView(5);
      return;
    }

    if (currentStep === 5 && paymentSubView === 5) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setCurrentStep(6);
      setPaymentSubView(1);
      return;
    }

    // Normal progression for other sub-views (only if not brokersId)
    if (
      currentStep === 5 &&
      paymentSubView < 6 &&
      paymentSubView !== 3 &&
      paymentSubView !== 4 &&
      !brokersId
    ) {
      setPaymentSubView(paymentSubView + 1);
      return;
    }

    if (currentStep === 5 && paymentSubView === 6) {
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
      let newSubView = paymentSubView - 1;

      if (brokersId || carrierSetup !== "true") {
        if (newSubView === 4 || newSubView === 3) {
          newSubView = 2;
        }
      } else {
        if (newSubView === 3) {
          const formData = watch();
          if (!formData.payment?.verify_verification_id) {
            setValue("payment.phone_verified", false);
          }
        }
      }

      setPaymentSubView(newSubView);
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

      // If brokersId is true, always show only the last UI (sub-view 5)
      if (step === 5 && brokersId) {
        setPaymentSubView(5);
      } else if (step === 5 && carrierSetup !== "true") {
        setPaymentSubView(5);
      } else if (step === 5) {
        setPaymentSubView(1);
      }
    }
  };

  const handlePaymentOtpSent = () => {
    setPaymentSubView(4);
  };

  const handlePaymentOtpVerified = () => {
    setCompletedSteps((prev) => new Set([...prev, 5]));
    setCurrentStep(6);
    setPaymentSubView(1);
  };

  const handlePaymentOtpSkip = () => {
    setValue("payment.phone_verified", true);
    setCompletedSteps((prev) => new Set([...prev, 5]));
    setCurrentStep(6);
    setPaymentSubView(1);
  };

  useEffect(() => {
    if (currentStep === 5 && paymentSubView === 3) {
      const formValues = watch();

      if (
        formValues.identity?.email &&
        !formValues.payment?.verify_email_or_phone
      ) {
        setValue("payment.verify_email_or_phone", formValues.identity.email, {
          shouldValidate: false,
        });
      }

      if (
        formValues.identity?.telephone &&
        !formValues.payment?.verify_mobile_phone
      ) {
        setValue("payment.verify_mobile_phone", formValues.identity.telephone, {
          shouldValidate: false,
        });
      }
    }
  }, [currentStep, paymentSubView, watch, setValue]);

  const {data: itemData} = useQuery({
    queryKey: ["ITEM_DATA", id],
    queryFn: () =>
      carrierService.getItemData("contact_information", {companies_id: id}),
    enabled: Boolean(id),
    select: (res) => res.data?.response?.[0] || {},
  });

  const {data: questionnaireData} = useQuery({
    queryKey: ["QUESTIONNAIRE_DATA", id],
    queryFn: () =>
      carrierService.getItemData("questionnaire", {companies_id: id}),
    enabled: Boolean(id),
    select: (res) => res.data?.response || [],
  });

  const {data: cerftificationData} = useQuery({
    queryKey: ["CERTIFICATION_DATA", id],
    queryFn: () =>
      carrierService.getItemData("insurance_agents", {companies_id: id}),
    enabled: Boolean(id),
    select: (res) => res.data?.response?.[0] || {},
  });

  const {data: companyPaymentData} = useQuery({
    queryKey: ["COMPANY_PAYMENT_DATA", id],
    queryFn: () =>
      carrierService.getItemData("company_payment", {companies_id: id}),
    enabled: Boolean(id),
    select: (res) => res.data?.response?.[0] || {},
  });

  const mapCarrierDataToForm = (data) => {
    if (!data) return {};

    return {
      legal_name: data.legal_name || "",
      us_dot_number: data.us_dot_number || "",
      tin: data.tin || "",
      federal_tax_classification: data.federal_tax_classification || "",

      identity: {
        us_dot_number: data.us_dot_number || "",
        phy_street:
          data.phy_street || data.physical_address?.split(",")[0] || "",
        phy_city: data.phy_city || "",
        phy_state: data.phy_state || "",
        phy_zip: data.phy_zip || "",
        phy_country: data.phy_country || "US",
        telephone: normalizePhone(data.telephone || data.phone || ""),
        email: data.email || data.company_email || "",
        company_officer_1: data.company_officer_1 || "",
        company_officer_2: data.company_officer_2 || "",
      },

      operations: {
        power_units: data.power_units || data.operations?.power_units || "",
        total_drivers:
          data.total_drivers ||
          data.operations?.total_drivers ||
          data.drivers ||
          "",
        trailer_types:
          data.trailer_types || data.operations?.trailer_types || [],
        models: data.models || data.operations?.models || "",
        trailer_count:
          data.trailer_count || data.operations?.trailer_count || "",
        specialization: data.operations?.specialization || "",
      },

      certifications: {
        first_name:
          data.certifications?.first_name || data.insurance?.first_name || "",
        last_name:
          data.certifications?.last_name || data.insurance?.last_name || "",
        email: data.certifications?.email || data.insurance?.email || "",
        phone: normalizePhone(
          data.certifications?.phone || data.insurance?.phone || ""
        ),
        certificate:
          data.certifications?.certificate || data.insurance?.certificate || [],
      },

      insurance: {
        commodity_type: data.insurance?.commodity_type || [],
        worker_compensation: data.insurance?.worker_compensation
          ? data.insurance.worker_compensation === true ||
            data.insurance.worker_compensation === "Yes"
            ? "Yes"
            : "No"
          : "",
        compensation_insurance: data.insurance?.compensation_insurance || "",
        policy_number: data.insurance?.policy_number || "",
        effective_date: data.insurance?.effective_date || "",
        cancellation_date: data.insurance?.cancellation_date || "",
        issued_by: data.insurance?.issued_by || "",
        full_name: data.insurance?.full_name || "",
        phone_number: normalizePhone(data.insurance?.phone_number || ""),
        worker_email: data.insurance?.worker_email || data?.worker_email || "",
      },

      payment: {
        factoring_company_name: data.payment?.factoring_company_name || "",
        factoring_phone: data.payment?.telephone || "",
        factoring_email: data.payment?.email || data.payment?.email || "",
        payment_type: data.payment?.payment_type || "Factoring",
      },

      questionnaire: {
        questions: Array.isArray(data.questionnaire?.questions)
          ? data.questionnaire.questions.map((q) => ({
              questions_id: q.questions_id || q.guid || q.questions_id || "",
              answer: q.answer || q.radio_answer || "",
              other: q.other || q.text_answer || "",
              document: q.document || q.file_name || "",
            }))
          : Array.isArray(data.questionnaire?.objects)
          ? data.questionnaire.objects.map((q) => ({
              questions_id: q.questions_id || q.guid || "",
              answer: q.answer || q.radio_answer || "",
              other: q.other || q.text_answer || "",
              document: q.document || q.file_name || "",
            }))
          : [],
      },

      contract: {},

      contact_information: {
        dispatch_name: data.contact_information?.dispatch_name || "",
        dispatch_email: data.contact_information?.dispatch_email || "",
        dispatch_phone: normalizePhone(
          data.contact_information?.dispatch_phone || ""
        ),
        billing_name: data.contact_information?.billing_name || "",
        billing_email: data.contact_information?.billing_email || "",
        billing_phone: normalizePhone(
          data.contact_information?.billing_phone || ""
        ),
        claims_name: data.contact_information?.claims_name || "",
        claims_email: data.contact_information?.claims_email || "",
        claims_phone: normalizePhone(
          data.contact_information?.claims_phone || ""
        ),
        after_hours_name: data.contact_information?.after_hours_name || "",
        after_hours_email: data.contact_information?.after_hours_email || "",
        after_hours_phone: normalizePhone(
          data.contact_information?.after_hours_phone || ""
        ),
      },
    };
  };

  useEffect(() => {
    if (Boolean(carrierData?.guid)) {
      const mappedData = mapCarrierDataToForm(carrierData);
      reset(mappedData);
    }
  }, [carrierData, reset]);

  const mapItemDataToContactInfo = (data) => {
    if (!data || Object.keys(data).length === 0) return null;

    const phoneFields = [
      "dispatch_phone",
      "billing_phone",
      "claims_phone",
      "after_hours_phone",
    ];
    const contactInfo = {};

    Object.entries(data).forEach(([key, value]) => {
      contactInfo[key] = phoneFields.includes(key)
        ? normalizePhone(value || "")
        : value || "";
    });

    return contactInfo;
  };

  // Set contact information from itemData - this should run after carrierData resets the form
  useEffect(() => {
    if (itemData && Object.keys(itemData).length > 0) {
      const contactInfo = mapItemDataToContactInfo(itemData);
      if (contactInfo) {
        // Set all contact information fields explicitly
        const fieldsToSet = [
          "dispatch_name",
          "dispatch_email",
          "dispatch_phone",
          "billing_name",
          "billing_email",
          "billing_phone",
          "claims_name",
          "claims_email",
          "claims_phone",
          "after_hours_name",
          "after_hours_email",
          "after_hours_phone",
        ];

        fieldsToSet.forEach((field) => {
          const value = contactInfo[field];
          if (value !== undefined && value !== null) {
            setValue(`contact_information.${field}`, value, {
              shouldValidate: false,
            });
          }
        });
      }
    }
  }, [itemData, carrierData, setValue]);

  useEffect(() => {
    if (itemData && Object.keys(itemData).length > 0) {
      const mappedAgents = {
        factoring_company_name: itemData.factoring_company_name || "",
        factoring_phone: itemData.telephone || "",
        factoring_email: itemData.email || "",
        payment_type: itemData.payment_type?.[0] || "Factoring",
      };

      setValue("payment", mappedAgents, {
        shouldValidate: false,
      });
    }
  }, [itemData, setValue]);

  useEffect(() => {
    if (
      questionnaireData &&
      Array.isArray(questionnaireData) &&
      questionnaireData.length > 0
    ) {
      const mappedQuestions = questionnaireData.map((q) => ({
        questions_id: q.questions_id || q.questions_id_data || "",
        answer: q.answer || "",
        other: q.other || "",
        document: q.document || "",
        question_title: q.questions_id_data?.title || "",
      }));

      setValue("questionnaire.questions", mappedQuestions, {
        shouldValidate: false,
      });
    }
  }, [questionnaireData, setValue]);

  useEffect(() => {
    if (cerftificationData && Object.keys(cerftificationData).length > 0) {
      const mappedAgents = {
        first_name: cerftificationData.first_name || "",
        last_name: cerftificationData.last_name || "",
        email: cerftificationData.email || "",
        phone: normalizePhone(cerftificationData.phone || ""),
        certificate: cerftificationData.certificate || [],
      };

      const insurance = {
        commodity_type: cerftificationData.commodity_type || [],
        worker_compensation:
          cerftificationData.worker_compensation === true ? "yes" : "no" || "",
        compensation_insurance: cerftificationData.compensation_insurance || "",
        policy_number: cerftificationData.policy_number || "",
        effective_date: cerftificationData.effective_date || "",
        cancellation_date: cerftificationData.cancellation_date || "",
        issued_by: cerftificationData.issued_by || "",
        full_name: cerftificationData.full_name || "",
        phone_number: cerftificationData.phone_number || "",
        worker_email: cerftificationData.worker_email || "",
      };

      setValue("certifications", mappedAgents, {
        shouldValidate: false,
      });

      setValue("insurance", insurance, {
        shouldValidate: false,
      });
    }
  }, [cerftificationData, setValue]);

  useEffect(() => {
    if (companyPaymentData && Object.keys(companyPaymentData).length > 0) {
      const mappedAgents = {
        factoring_company_name: companyPaymentData.factoring_company_name || "",
        factoring_email: companyPaymentData.email || "",
        payment_type: companyPaymentData.payment_type?.[0] || "Factoring",
        factoring_phone: normalizePhone(companyPaymentData.telephone || ""),
        verify_verification_id: companyPaymentData.guid || "",
      };

      setValue(
        "payment.factoring_company_name",
        mappedAgents.factoring_company_name,
        {
          shouldValidate: false,
        }
      );
      setValue("payment.factoring_email", mappedAgents.factoring_email, {
        shouldValidate: false,
      });
      setValue("payment.factoring_phone", mappedAgents.factoring_phone, {
        shouldValidate: false,
      });
      setValue("payment.payment_type", mappedAgents.payment_type, {
        shouldValidate: false,
      });
      setValue(
        "payment.verify_verification_id",
        mappedAgents.verify_verification_id,
        {
          shouldValidate: false,
        }
      );
    }
  }, [companyPaymentData, setValue]);

  useEffect(() => {
    if (isSyncingRef.current) return;

    const subscription = watch((formValues, {name, type}) => {
      if (!name || type !== "change") return;
      if (isSyncingRef.current) return;

      isSyncingRef.current = true;

      try {
        if (name === "identity.email") {
          const email = formValues.identity?.email;
          if (email && !formValues.payment?.verify_email_or_phone) {
            setValue("payment.verify_email_or_phone", email, {
              shouldValidate: false,
            });
          }
        }

        if (name === "identity.telephone") {
          const phone = formValues.identity?.telephone;
          if (phone && !formValues.payment?.verify_mobile_phone) {
            setValue("payment.verify_mobile_phone", phone, {
              shouldValidate: false,
            });
          }
        }

        if (name === "insurance.worker_email") {
          const email = formValues.insurance?.worker_email;
          if (email && !formValues.payment?.verify_email_or_phone) {
            setValue("payment.verify_email_or_phone", email, {
              shouldValidate: false,
            });
          }
        }

        if (name === "insurance.phone_number") {
          const phone = formValues.insurance?.phone_number;
          if (phone && !formValues.payment?.verify_mobile_phone) {
            setValue("payment.verify_mobile_phone", phone, {
              shouldValidate: false,
            });
          }
        }
      } finally {
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 100);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const handleUpdateSkipSetup = async () => {
    try {
      await carrierService.updateSkipSetup({
        method: "update",
        object_data: {
          companies_id: id,
          setup_skip: true,
        },
        table: "company",
      });
      return true;
    } catch (error) {
      console.error("Failed to update skip setup:", error);
      throw error;
    }
  };

  const handleConfirmAddCarrier = async () => {
    setIsConnecting(true);
    const formData = watch();
    try {
      if (carrierSetup === "true") {
        const identitySuccess = await handleContactInfo();
        if (!identitySuccess) {
          throw new Error("Failed to submit identity data");
        }

        const operationsSuccess = await handleAgentSubmit();
        if (!operationsSuccess) {
          throw new Error("Failed to submit operations data");
        }

        const certificationsSuccess = await handlePaymentSubmit();
        if (!certificationsSuccess) {
          throw new Error("Failed to submit certifications data");
        }

        const insuranceSuccess = await handleQuestionnaireSubmit();
        if (!insuranceSuccess) {
          throw new Error("Failed to submit insurance data");
        }
      }

      if (carrierSetup === "true") {
        await carrierService.updateCompanyAudit({
          power_units: formData.operations?.power_units || 0,
          total_drivers: formData.operations?.total_drivers || 0,
          trailer_types: formData.operations?.trailer_types || [],
          trailer_count: formData.operations?.trailer_count || 0,
          models: formData.operations?.models || [],
          specialization: formData.operations?.specialization || "",
          guid: id || "",
          tin: formData?.tin || "",
          federal_tax_classification:
            formData?.federal_tax_classification || "",
        });

        await handleUpdateSkipSetup();

        setIsConnecting(false);
        setIsConfirmModalOpen(false);
        setShowSuccess(true);

        setTimeout(() => {
          localStorage.setItem("carrierStatus", "true");
          navigate("/admin/dashboard");
        }, 2000);
      } else {
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
      }
    } catch (error) {
      setIsConnecting(false);
      console.error("Failed to complete carrier setup:", error);
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
    steps,
    identitySubView,
    insuranceSubView,
    paymentSubView,
    contractSubView,
    isInsuranceLoading,
    isConfirmModalOpen,
    isConnecting,
    carrierData,
    id,
    isEditable,
    canSkipSetup,
    isCarrierSetup: carrierSetup === "true",
    showSuccess,
    watch,
    setValue,
    handleSkipSetup,
    handleStepChange,
    handleNext,
    handleBack,
    handleConfirmAddCarrier,
    handleCancelAddCarrier,
    handlePaymentOtpSent,
    handlePaymentOtpVerified,
    handlePaymentOtpSkip,
  };
};
