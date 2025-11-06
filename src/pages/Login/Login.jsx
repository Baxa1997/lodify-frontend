import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import styles from "./Auth.module.scss";
import authService from "../../services/auth/authService";
import { useQuery } from "@tanstack/react-query";
import connectionService from "../../services/connectionService";
import { authActions } from "../../store/auth/auth.slice";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "../../store/alert/alert.thunk";
import listToOptions from "../../utils/listTopOptions";
import { loginAction } from "../../store/auth/auth.thunk";
import { Box, Button, Text } from "@chakra-ui/react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuth = useSelector((state) => state?.auth?.isAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserId, setIsUserId] = useState();
  const [companies, setCompanies] = useState([]);
  const [connectionCheck, setConnectionCheck] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onChange",
  });

  const selectedCompanyID = watch("company_id");
  const selectedProjectID = watch("project_id");
  const selectedClientTypeID = watch("client_type");
  const selectedEnvID = watch("environment_id");
  const getFormValue = watch();

  useEffect(() => {
    if (isAuth) {
      const from = location.state?.from?.pathname || "/admin/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuth, navigate, location.state]);

  //=======COMPUTE COMPANIES
  const computedCompanies = useMemo(() => {
    return listToOptions(companies, "name");
  }, [companies]);

  //=======COMPUTE PROJECTS
  const computedProjects = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID,
    );
    return listToOptions(company?.projects, "name");
  }, [companies, selectedCompanyID]);

  //=======COMPUTE ENVIRONMENTS
  const computedEnvironments = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID,
    );
    const companyProject = company?.projects?.find(
      (el) => el?.id === selectedProjectID,
    );

    return companyProject?.resource_environments?.map((item) => ({
      label: item?.name,
      value: item?.environment_id,
      access_type: item?.access_type,
    }));
  }, [selectedEnvID, companies, selectedProjectID]);

  //======COMPUTE CLIENTTYPES
  const computedClientTypes = useMemo(() => {
    const company = companies?.find(
      (company) => company.id === selectedCompanyID,
    );
    const companyProject = company?.projects?.find(
      (el) => el?.id === selectedProjectID,
    );

    const companyEnvironment = companyProject?.resource_environments?.find(
      (el) => el?.environment_id === selectedEnvID,
    );

    return companyEnvironment?.client_types?.response?.map((item) => ({
      label: item?.name,
      value: item?.guid,
    }));
  }, [companies, selectedCompanyID, selectedEnvID, selectedProjectID]);

  const {
    data: computedConnections = [],
    isSuccess,
    isError,
  } = useQuery({
    queryKey: [
      "GET_CONNECTION_LIST",
      { "project-id": selectedProjectID },
      { "environment-id": selectedEnvID },
      { "user-id": isUserId },
    ],
    queryFn: () => {
      return connectionService.getList(
        {
          "project-id": selectedProjectID,
          client_type_id: selectedClientTypeID,
          "user-id": isUserId,
        },
        { "environment-id": selectedEnvID },
      );
    },
    enabled: !!selectedClientTypeID,
    select: (res) => res.data.response ?? [],
  });

  useEffect(() => {
    if (isSuccess && computedConnections) {
      computeConnections(computedConnections);
      setConnectionCheck(true);
    }
  }, [isSuccess, computedConnections]);

  useEffect(() => {
    if (isError) {
      setIsLoading(false);
    }
  }, [isError]);

  const watchedValues = watch();
  const isFormValid =
    !errors.username &&
    !errors.password &&
    watchedValues.username &&
    watchedValues.password;

  const checkConnections = useMemo(() => {
    if (getFormValue?.tables) {
      const tableKeys = Object.keys(getFormValue.tables);
      return tableKeys.every((key) => {
        const item = getFormValue.tables[key];
        return item?.object_id && item?.table_slug;
      });
    }
    return false;
  }, [getFormValue]);

  const onSubmit = async (data) => {
    getCompany(data);
  };

  const getCompany = (values) => {
    setIsLoading(true);
    const data = {
      password: values?.password ? values?.password : "",
      username: values?.username ? values?.password : "",
      ...values,
    };

    authService
      .multiCompanyLogin(data, {
        project_id: "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1",
      })
      .then((res) => {
        if (res?.companies) {
          setIsUserId(res?.user_id ?? "");
          setCompanies(res?.companies ?? {});
          computeCompanyElement(res?.companies ?? "");
          localStorage.setItem(
            "new_router",
            res?.companies?.[0]?.projects?.[0]?.new_router || "false",
          );
          localStorage.setItem(
            "newUi",
            res?.companies?.[0]?.projects?.[0]?.new_design || false,
          );
          res?.companies?.[0]?.projects?.[0]?.new_layout
            ? localStorage.setItem("detailPage", "SidePeek")
            : localStorage.setItem("detailPage", "");
          localStorage.setItem(
            "newLayout",
            res?.companies?.[0]?.projects?.[0]?.new_layout || false,
          );
        } else {
          dispatch(showAlert("The company does not exist", "error"));
        }
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(showAlert(err?.data?.data));
        setIsLoading(false);
      });
  };

  const computeConnections = (connections) => {
    const data = {
      ...getFormValue,
    };

    if (
      (Array.isArray(connections) && connections?.length === 0) ||
      connections === undefined
    ) {
      if (
        getFormValue?.username &&
        getFormValue?.password &&
        getFormValue?.client_type &&
        getFormValue?.project_id &&
        getFormValue?.environment_id
      ) {
        onSubmitDialog(data);
      } else if (getFormValue?.firebase) {
        onSubmitDialog(data);
      } else if (googleAuth?.type === "google" && googleAuth?.google_token) {
        onSubmitDialog(data);
      } else if (
        !getFormValue?.username ||
        !getFormValue?.password ||
        !getFormValue?.company_id ||
        !getFormValue?.project_id ||
        !getFormValue?.environment_id ||
        !getFormValue?.client_type
      ) {
      }
    } else if (Array.isArray(connections) && connections?.length > 0) {
      if (
        getFormValue?.username &&
        getFormValue?.password &&
        getFormValue?.client_type &&
        getFormValue?.project_id &&
        getFormValue?.environment_id &&
        checkConnections
      ) {
        onSubmitDialog(getFormValue);
      } else {
        if (connections?.length > 1) {
          // handleClickOpen();
        }
      }
    }
  };

  const computeCompanyElement = (company) => {
    const validLength = company?.length === 1;
    if (validLength) {
      setValue("company_id", company?.[0]?.id);
    } else {
      setValue("company_id", company?.[0]?.id);
    }
    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        setValue("project_id", company?.[0]?.projects?.[0]?.id);
      }
    } else {
      setValue("project_id", company?.[0]?.projects?.[0]?.id);
    }

    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        if (company?.[0]?.projects?.[0]?.resource_environments?.length === 1) {
          setValue(
            "environment_id",
            company?.[0]?.projects?.[0]?.resource_environments?.[0]
              ?.environment_id,
          );
        }
      }
    } else {
      setValue(
        "environment_id",
        company?.[0]?.projects?.[0]?.resource_environments?.[0]?.environment_id,
      );
    }

    if (validLength) {
      if (company?.[0]?.projects?.length === 1) {
        if (company?.[0]?.projects?.[0]?.resource_environments?.length === 1) {
          if (
            company?.[0]?.projects?.[0]?.resource_environments?.[0]
              ?.client_types?.response?.length === 1
          ) {
            setValue(
              "client_type",
              company?.[0]?.projects?.[0]?.resource_environments?.[0]
                ?.client_types?.response?.[0]?.guid,
            );
          } else if (
            company?.[0]?.projects?.[0]?.resource_environments?.[0]
              ?.client_types?.response?.length > 1
          ) {
            setValue(
              "client_type",
              company?.[0]?.projects?.[0]?.resource_environments?.[0]
                ?.client_types?.response?.[0]?.guid,
            );
          }
        }
      }
    } else {
      if (company?.[0]?.projects?.length === 1) {
        if (company?.[0]?.projects?.[0]?.resource_environments?.length === 1) {
          if (
            company?.[0]?.projects?.[0]?.resource_environments?.[0]
              ?.client_types?.response?.length === 1
          ) {
            setValue(
              "client_type",
              company?.[0]?.projects?.[0]?.resource_environments?.[0]
                ?.client_types?.response?.[0]?.guid,
            );
          }
        }
      }
    }
  };

  const onSubmitDialog = (values) => {
    const data = {
      ...values,
      type: values?.phone
        ? "phone"
        : values?.email
          ? "email"
          : values?.type === "google"
            ? "google"
            : undefined,
    };
    const computedProject = companies[0]?.projects
      ?.find((item) => item?.id === selectedProjectID)
      ?.resource_environments?.map((el) => el?.environment_id);
    const computedEnv = computedEnvironments?.find(
      (item) => item?.value === selectedEnvID,
    );

    dispatch(authActions.setStatus(computedEnv?.access_type));
    dispatch(
      loginAction({
        ...data,
        environment_ids: computedProject,
      }),
    );
  };

  const setCompanyId = () => {
    setValue("company_id", computedCompanies?.[0]?.value);
    setValue("project_id", computedProjects?.[0]?.value);
  };

  useEffect(() => {
    if (computedConnections?.length > 0) {
      computedConnections.forEach((connection, index) => {
        if (connection?.options?.length === 1) {
          setValue(`tables[${index}].object_id`, connection?.options[0]?.guid);
          setSelectedCollection(connection.options[0]?.value);
          setValue(`tables[${index}].table_slug`, connection?.table_slug);
        } else {
          handleClickOpen();
        }
      });
    }
  }, [computedConnections]);

  useEffect(() => {
    if (computedCompanies?.length === 1) {
      setValue("company_id", computedCompanies?.[0]?.value);
    } else {
      setValue("company_id", computedCompanies?.[0]?.value);
    }
    if (computedProjects?.length === 1) {
      setValue("project_id", computedProjects?.[0]?.value);
    }
    if (computedEnvironments?.length === 1) {
      setValue("environment_id", computedEnvironments?.[0]?.value);
    }
    if (computedClientTypes?.length === 1) {
      setValue("client_type", computedClientTypes?.[0]?.value);
    }
  }, [
    computedCompanies,
    computedProjects,
    computedEnvironments,
    computedClientTypes,
  ]);

  useEffect(() => {
    const shouldOpen =
      computedCompanies?.length > 1 ||
      computedProjects?.length > 1 ||
      computedEnvironments?.length > 1 ||
      computedClientTypes?.length > 1;

    if (shouldOpen) {
      setCompanyId();
    }
  }, [
    computedCompanies,
    computedProjects,
    computedEnvironments,
    computedClientTypes,
  ]);

  useEffect(() => {
    if (connectionCheck && getFormValue?.tables) {
      computeConnections(getFormValue?.tables);
    }
  }, [connectionCheck, getFormValue?.tables]);

  return (
    <>
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1>Sign in with Lodify</h1>
            <p>Description</p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={styles.authForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">
                Email or mobile phone number{" "}
                <span style={{ color: "#EF6820" }}>*</span>
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your Username"
                className={errors.username ? "error" : ""}
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  maxLength: {
                    value: 50,
                    message: "Username must be less than 50 characters",
                  },
                })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">
                Password <span style={{ color: "#EF6820" }}>*</span>
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className={errors.password ? "error" : ""}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Password must be less than 100 characters",
                  },
                })}
              />
            </div>

            <button
              type="submit"
              className={styles.authButton}
              disabled={isLoading || !isFormValid}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            <Link
              to="/forgot-password"
              className={styles.forgotLink}>
              Forgot password?
            </Link>
          </form>

          <div className={styles.authFooter}>
            <Button
              as={Link}
              to="/role-selection"
              mb="10px"
              w="100%"
              mt="20px"
              bg="#fff"
              border="1px solid #D5D7DA"
              _hover={{
                color: "#414651",
                textDecoration: "none",
              }}>
              Create an account
            </Button>
            <Text
              textAlign="center"
              color="#535862"
              fontWeight="400">
              New to Lodify?
            </Text>
            {/* <p>
              Don't have an account?
              <Link to="/role-selection" className={styles.authLink}>
                {" "}
                Sign up
              </Link>
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
