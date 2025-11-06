import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import HeadBreadCrumb from "../../components/HeadBreadCrumb";
import styles from "../../styles/tabs.module.scss";
import AccountTab from "./components/AccountTab";
import CommunicationTab from "./components/CommunicationTab";
import UserRoleTab from "./components/UserRoleTab";
import PermissionsTab from "./components/PermissionsTab";
import usersService from "../../services/usersService";

const SingleUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const {
    data: userData,
    isLoading: loading,
    error,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => usersService.getUserById(id),
    enabled: !!id,
    select: (data) => data?.data?.response || data?.data,
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      login: "",
      password: "",
      role_id: "",
      usdot: "",
      companies_id: "",
      user_id_auth: "",
      status: ["Active"],
      domicile: "",
      language_preference: "en-US", // Default to English
      timezone: "America/New_York", // Default to Eastern Time (USA)
      email_preferences: [],
      phone_type: [],
      primary_contact_number: null,
      available_hours: [],
      role: null,
      notes: null,
    },
  });

  useEffect(() => {
    if (userData) {
      // Process userData to handle null values and set proper defaults
      const processedData = {
        ...userData,
        domicile: userData.domicile || "",
        language_preference: userData.language_preference || "en-US",
        timezone: userData.timezone || "America/New_York",
        email_preferences: userData.email_preferences || [],
        phone_type: userData.phone_type || [],
        available_hours: userData.available_hours || [],
        primary_contact_number: userData.primary_contact_number || null,
        role: userData.role || null,
        notes: userData.notes || null,
      };
      reset(processedData);
    }
  }, [userData]); // Remove reset from dependencies to prevent infinite loops

  // Reset form when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  const deleteUser = (id) => {
    setDeleteLoading(true);
    usersService
      .deleteUser(id, { data: {} })
      .then((res) => {
        queryClient.refetchQueries({ queryKey: ["GET_USERS_LIST"] });
        navigate("/admin/users");
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const handleBackToUsers = () => {
    navigate("/admin/users");
  };

  const onSubmit = (data) => {
    if (!userData) {
      console.log("No user data available");
      return;
    }

    setSaveLoading(true);
    const apiData = {
      data: {
        ...data,
        guid: id || data?.guid,
      },
    };

    usersService
      .updateUser(id, apiData)
      .then((response) => {
        reset(response?.data);
        console.log("User updated successfully:", response);

        queryClient.invalidateQueries({ queryKey: ["user", id] });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      })
      .finally(() => {
        setSaveLoading(false);
      });
  };

  const handleSave = () => {
    handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    if (userData) {
      reset(userData);
    } else {
      refetchUser();
    }
  };

  if (loading) {
    return (
      <Flex
        flexDir={"column"}
        gap={"20px"}>
        <HeadBreadCrumb
          customPath={[
            { label: "Account", path: `/admin/users/${id}` },
            { label: "Users", path: "/admin/users" },
          ]}
        />
        <Box>Loading...</Box>
      </Flex>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex
        flexDir={"column"}
        gap={"20px"}>
        <HeadBreadCrumb
          customPath={[
            { label: "Account", path: `/admin/users/${id}` },
            { label: "Users", path: "/admin/users" },
          ]}
        />

        <Box h={"32px"}>
          <Text
            h={"32px"}
            color={"#181D27"}
            fontWeight={"600"}
            fontSize={"24px"}>
            {userData ? userData.full_name : "User Details"}
          </Text>
        </Box>

        <Tabs className={styles.tabsContainer}>
          <TabList>
            <Tab>Account</Tab>
            <Tab>Communication</Tab>
            <Tab>User Role</Tab>
            <Tab>Permissions</Tab>
          </TabList>

          <TabPanel>
            <AccountTab
              deleteUser={deleteUser}
              control={control}
              watch={watch}
              setValue={setValue}
              userId={id}
              deleteLoading={deleteLoading}
              saveLoading={saveLoading}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </TabPanel>

          <TabPanel>
            <CommunicationTab
              control={control}
              watch={watch}
              setValue={setValue}
              userId={id}
              saveLoading={saveLoading}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </TabPanel>

          <TabPanel>
            <UserRoleTab
              userId={id}
              watch={watch}
              setValue={setValue}
              control={control}
              saveLoading={saveLoading}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </TabPanel>

          <TabPanel>
            <PermissionsTab
              userId={id}
              watch={watch}
              setValue={setValue}
              control={control}
              saveLoading={saveLoading}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </TabPanel>
        </Tabs>
      </Flex>
    </form>
  );
};

export default SingleUser;
