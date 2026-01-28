import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Flex, useToast} from "@chakra-ui/react";
import {useDispatch, useSelector} from "react-redux";
import RegisterSidebar from "./components/RegisterSidebar";
import RegisterForm from "./components/RegisterForm";
import authService from "../../services/auth/authService";
import {authActions} from "../../store/auth/auth.slice";
import {loginAction} from "../../store/auth/auth.thunk";
import IPAddressFinder from "@utils/getIpAddress";
import styles from "./MultiStepRegister.module.scss";

const PROJECT_ID = "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1";

const Register = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {ip} = IPAddressFinder();
  const qrVerified = useSelector((state) => state?.auth?.qrVerified);
  const isAuth = useSelector((state) => state?.auth?.isAuth);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [role, setRole] = useState("");
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const toast = useToast();
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const {
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
    trigger,
    control,
    reset,
    getValues,
  } = useForm({
    defaultValues: {
      company_name: "",
      us_dot: "",
      identifier: "",
      legal_name: "",
      operating_status: "",
      mailing_address: "",
      physical_address1: "",
      physical_address2: "",
      city: "",
      state: "",
      zip_code: "",
      country: "United States",
      login: "",
      password: "",
      email: "",
      phone: "",
      emailCode: "",
      emailSmsId: "",
      confirmPassword: "",
      type: "phone",
      client_type_id: "706337d3-80dc-4aca-80b3-67fad16cd0d6",
      role_id: "abc236d0-8a9a-4b10-9f44-6b51fcb35e9f",
      register_user_type: localStorage.getItem("register_user_type"),
    },
    mode: "onChange",
  });

  const validateStep1 = (data) => {
    return true;
  };

  const validateStep2 = (data) => {
    const requiredFields = [
      "physical_address1",
      "city",
      "state",
      "zip_code",
      "country",
    ];
    const hasRequiredFields = requiredFields.every(
      (field) => data[field] && data[field].trim() !== ""
    );

    if (data.zip_code && !/^\d{5}(-\d{4})?$/.test(data.zip_code)) {
      return false;
    }

    return hasRequiredFields;
  };

  const validateStep3 = (data) => {
    return true;
    // const requiredFields = ["email", "login", "password"];
    // return requiredFields.every(
    //   (field) => data[field] && data[field].trim() !== ""
    // );
  };

  const validatePassword = (password) => {
    if (!password || password.trim() === "") {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one symbol";
    }
    return true;
  };

  const validateStep4 = (data) => {
    const hasPassword = data.password && data.password.trim() !== "";
    const hasConfirmPassword =
      data.confirmPassword && data.confirmPassword.trim() !== "";
    const passwordsMatch = data.password === data.confirmPassword;
    const passwordValidation = validatePassword(data.password);
    const isPasswordValid = passwordValidation === true;
    return (
      hasPassword && hasConfirmPassword && passwordsMatch && isPasswordValid
    );
  };

  const getStepValidation = (step) => {
    const data = watch();
    const isValid = (() => {
      switch (step) {
        case 1:
          return validateStep1(data);
        case 2:
          return validateStep2(data);
        case 3:
          return validateStep3(data);
        case 4:
          return validateStep4(data);
        default:
          return false;
      }
    })();

    if (step === 3) {

    }

    return isValid;
  };

  const steps = [
    {
      id: 1,
      title: `Select ${
        localStorage.getItem("register_user_type") === "carrier"
          ? "Carrier"
          : "Broker"
      }`,
      completed: completedSteps.has(1),
      active: currentStep === 1,
    },
    {
      id: 2,
      title: "Verify Contact Info",
      completed: completedSteps.has(2),
      active: currentStep === 2,
    },
    {
      id: 3,
      title: "Verify Identity",
      completed: completedSteps.has(3),
      active: currentStep === 3,
    },
    {
      id: 4,
      title: `Join ${
        localStorage.getItem("register_user_type") === "carrier"
          ? "Carrier"
          : "Broker"
      }`,
      completed: completedSteps.has(4),
      active: currentStep === 4,
    },
  ];

  useEffect(() => {
    if (location.state?.role) {
      setRole(location.state.role);
      setValue("type", location.state.role);
    } else {
      navigate("/login");
    }
  }, [location.state, navigate]);

  const handleNext = (skip = false) => {
    if (currentStep < 4) {
      if (getStepValidation(currentStep)) {
        setCompletedSteps((prev) => new Set([...prev, currentStep]));
        setCurrentStep(currentStep + 1);
      } else {
        if (skip) {
          setCurrentStep(currentStep + 1);
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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

  const postRegisterLogin = async (data) => {
    setIsLoggingIn(true);
    try {
      const loginPayload = {
        username: data?.login ?? "",
        password: data?.password ?? "",
      };
      const res = await authService.multiCompanyLogin(loginPayload, {
        project_id: PROJECT_ID,
      });
      const companies = res?.companies ?? [];
      if (!companies.length) {
        toast({
          title: "Login after registration",
          description: "Account created. Please sign in manually.",
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }
      const company = companies[0];
      const project = company?.projects?.[0];
      const resourceEnvs = project?.resource_environments ?? [];
      const env = resourceEnvs[0];
      const clientTypes = env?.client_types?.response ?? [];
      const clientType = clientTypes[0];
      const company_id = company?.id;
      const project_id = project?.id;
      const environment_id = env?.environment_id;
      const client_type = clientType?.guid;
      const environment_ids = resourceEnvs?.map((el) => el?.environment_id) ?? [];
      const access_type = env?.access_type;

      localStorage.setItem(
        "new_router",
        project?.new_router || "false"
      );
      localStorage.setItem("newUi", project?.new_design || false);
      project?.new_layout
        ? localStorage.setItem("detailPage", "SidePeek")
        : localStorage.setItem("detailPage", "");
      localStorage.setItem("newLayout", project?.new_layout || false);

      dispatch(authActions.setStatus(access_type));

      await dispatch(
        loginAction({
          username: data.login,
          password: data.password,
          company_id,
          project_id,
          environment_id,
          client_type,
          ip_address: ip,
          environment_ids,
          email: data.email,
          phone: data.phone,
        })
      ).unwrap();
    } catch (err) {
      toast({
        title: "Account created",
        description:
          err?.message ||
          "Please sign in with your login and password.",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (registerSuccess && isAuth) {
      if (!qrVerified) {
        navigate("/qr-verification", {replace: true});
      } else {
        const from = location.state?.from?.pathname || "/admin/dashboard";
        navigate(from, {replace: true});
      }
    }
  }, [registerSuccess, isAuth, qrVerified, navigate, location.state]);

  const onSubmit = async (data) => {
    const passwordValidation = validatePassword(data.password);
    if (passwordValidation !== true) {
      toast({
        title: "Password Validation Failed",
        description: passwordValidation,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiData = {
        company_name: data.company_name,
        us_dot:
          localStorage.getItem("number_type") === "US DOT"
            ? data?.us_dot
            : data?.mc_number,
        identifier: data?.identifier,
        physical_address: data?.physical_address1,
        mailing_address: data?.mailing_address,
        city: data?.city,
        state: data?.state,
        zip_code: data?.zip_code,
        country: data.country,
        login: data?.login,
        password: data.password,
        phone: data.phone || "",
        email: data.email,
        type: "login",
        client_type_id: data?.client_type_id,
        role_id: data.role_id,
        register_user_type: localStorage.getItem("register_user_type"),
        number_type: localStorage.getItem("number_type"),
      };

      await authService
        .register(apiData)
        .then(async () => {
          setRegisterSuccess(true);
          await postRegisterLogin(data);
        })
        .catch((err) => {
          toast({
            title: "Registration Failed",
            description:
              err?.data?.data || "Failed to create account. Please try again.",
            status: "error",
            duration: 7000,
            isClosable: true,
            position: "top-right",
          });
        });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error?.data ||
          error?.response?.data?.message ||
          "Failed to create account. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return null;
  }

  return (
    <Flex className={styles.multiStepContainer} minHeight="100vh">
      <RegisterSidebar
        steps={steps}
        currentStep={currentStep}
        handleStepChange={handleStepChange}
      />
      <RegisterForm
        control={control}
        onSubmit={onSubmit}
        currentStep={currentStep}
        steps={steps}
        errors={errors}
        watch={watch}
        setValue={setValue}
        reset={reset}
        getValues={getValues}
        handleSubmit={handleSubmit(onSubmit)}
        onNext={handleNext}
        onBack={handleBack}
        isLoading={isLoading}
        registerSuccess={registerSuccess}
        isLoggingIn={isLoggingIn}
        handleStepChange={handleStepChange}
        getStepValidation={getStepValidation}
      />
    </Flex>
  );
};

export default Register;
