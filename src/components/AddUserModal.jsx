import React, { useCallback, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Text,
  Button,
  VStack,
  HStack,
  Box,
  Divider,
  Radio,
  RadioGroup,
  useToast,
} from "@chakra-ui/react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import Select from "./Select";
import styles from "./AddUserModal.module.scss";
import { useQueryClient } from "@tanstack/react-query";
import usersService from "../services/usersService";
import { useSelector } from "react-redux";

const AddUserModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const userInfo = useSelector((state) => state.auth);
  const toast = useToast();

  const handleAddUser = useCallback(
    async (userData) => {
      try {
        const apiData = {
          data: {
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            login: userData.login,
            role:
              userData.role === "administrator"
                ? "Administrator"
                : "Dispatcher",

            full_name: "",
            usdot: "",
            status: ["Active"],
            timezone: "America/New_York",
            domicile: "US",
            language_preference: "en-US",
            email_preferences: ["Tendered Trips"],
            phone_type: ["Mobile"],
            primary_contact_number: true,
            available_hours: ["Morning"],
            attributes: {},
            client_type_id: "90df0db1-e295-4f2d-adb4-b4e33d3c3d38",
            role_id:
              userData.role === "administrator"
                ? "0dabed5c-f816-4772-8868-18a63bde531a"
                : "85880d26-5663-4f6d-b61f-68fd3f43492b",
            companies_id:
              userInfo?.user_data?.companies_id || userInfo?.user_data?.guid,
            notes: "<p>User added via admin panel</p>",
          },
        };

        await usersService.addUser(apiData);

        queryClient.invalidateQueries({ queryKey: ["GET_USERS_LIST"] });
        handleClose();
        setLoading(false);

        toast({
          title: "User Added Successfully!",
          description: "The user has been created and invited",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        setLoading(false);
        console.error("Error adding user:", error);

        toast({
          title: "Error Adding User",
          description:
            error?.response?.data?.message ||
            "Failed to add user. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    },
    [queryClient],
  );

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    login: "",
    password: "",
    role: "dispatcher",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.login.trim()) {
      newErrors.login = "Login is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      handleAddUser(formData);

      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      login: "",
      password: "",
      role: "dispatcher",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent className={styles.modalContent}>
        <ModalHeader className={styles.modalHeader}>
          <Text className={styles.modalTitle}>Add User</Text>
          <Button
            onClick={handleClose}
            className={styles.headCloseButton}>
            <img
              src="/img/cancelIcon.svg"
              alt="close" />
          </Button>
        </ModalHeader>

        <ModalBody className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <VStack
              spacing={4}
              align="stretch"
              flex="1">
              <FormControl>
                <FormLabel className={styles.fieldLabel}>
                  Full Name <span className={styles.required}>*</span>
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Full name"
                  value={formData.full_name}
                  onChange={(e) =>
                    handleInputChange("full_name", e.target.value)
                  }
                  className={styles.inputField}
                />
                {errors.email && (
                  <Text className={styles.errorText}>{errors.email}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel className={styles.fieldLabel}>
                  Email Address <span className={styles.required}>*</span>
                </FormLabel>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={styles.inputField}
                />
                {errors.email && (
                  <Text className={styles.errorText}>{errors.email}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel className={styles.fieldLabel}>
                  Phone number <span className={styles.required}>*</span>
                </FormLabel>
                <Box
                  display="flex"
                  border="1px solid #E2E8F0"
                  borderRadius="6px"
                  height="40px"
                  width="100%"
                  _focusWithin={{
                    borderColor: "#E2E8F0",
                    boxShadow: "none",
                  }}>
                  <PhoneInput
                    defaultCountry="us"
                    value={formData.phone || ""}
                    onChange={(phone) => {
                      handleInputChange("phone", phone);
                    }}
                    style={{
                      "--rip-border-radius": "0",
                      "--rip-border-color": "transparent",
                      "--rip-border-color-focus": "transparent",
                      "--rip-font-size": "14px",
                      "--rip-height": "40px",
                      "--rip-gap": "0px",
                      "--rip-outline": "none",
                      "--rip-box-shadow": "none",
                      width: "100%",
                    }}
                    inputStyle={{
                      fontSize: "14px",
                      height: "38px",
                      border: "none",
                      borderRadius: "0",
                      padding: "8px 12px",
                      outline: "none",
                      boxShadow: "none",
                      _focus: {
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                      },
                    }}
                    countrySelectorStyleProps={{
                      style: {
                        background: "#fff",
                        outline: "none",
                        focus: "none",
                      },
                    }}
                    hideDropdown={false}
                    showDropdownSearch={true}
                    disableFormatting={false}
                    placeholder="(937) 301-3613"
                  />
                </Box>
                {errors.phone && (
                  <Text className={styles.errorText}>{errors.phone}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.login}>
                <FormLabel className={styles.fieldLabel}>
                  Login <span className={styles.required}>*</span>
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Login"
                  value={formData.login}
                  onChange={(e) => handleInputChange("login", e.target.value)}
                  className={styles.inputField}
                />
                {errors.login && (
                  <Text className={styles.errorText}>{errors.login}</Text>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel className={styles.fieldLabel}>
                  Password <span className={styles.required}>*</span>
                </FormLabel>
                <Input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={styles.inputField}
                />
                {errors.password && (
                  <Text className={styles.errorText}>{errors.password}</Text>
                )}
              </FormControl>

              <Box>
                <Text className={styles.sectionTitle}>User Role</Text>

                <VStack
                  spacing={2}
                  align="stretch"
                  mt={3}>
                  <RadioGroup
                    value={formData.role}
                    onChange={(value) => handleInputChange("role", value)}>
                    <VStack
                      spacing={2}
                      align="stretch">
                      <Box className={styles.roleOption}>
                        <HStack
                          spacing={2}
                          align="flex-start">
                          <Radio
                            value="dispatcher"
                            className={styles.roleRadio}
                          />
                          <VStack
                            align="stretch"
                            spacing={1}
                            flex={1}>
                            <Text className={styles.roleLabel}>Dispatcher</Text>
                            {/* <Text className={styles.roleDescription}>
                              Accepts and reject trips, assign drivers to loads,
                              and updates trip status and time stamps. Can view
                              and edit capacity. Can't view company account or
                              financial details, including payout.
                            </Text> */}
                          </VStack>
                        </HStack>
                      </Box>

                      <Box className={styles.roleOption}>
                        <HStack
                          spacing={3}
                          align="flex-start">
                          <Radio
                            value="administrator"
                            className={styles.roleRadio}
                          />
                          <VStack
                            align="stretch"
                            spacing={1}
                            flex={1}>
                            <Text className={styles.roleLabel}>
                              Administrator
                            </Text>
                            {/* <Text className={styles.roleDescription}>
                              Updates all data in Lodify, and manages new and
                              existing users. Can't delete or deactivate Primary
                              Administrator.
                            </Text> */}
                          </VStack>
                        </HStack>
                      </Box>
                    </VStack>
                  </RadioGroup>
                </VStack>
              </Box>
            </VStack>

            <HStack
              spacing={3}
              justify="flex-end"
              mt={1}>
              <Button
                onClick={handleClose}
                type="button"
                variant="outline">
                Close
              </Button>
              <Button
                type="submit"
                className={styles.sendInviteButton}
                isDisabled={
                  !formData.email ||
                  !formData.phone ||
                  !formData.login ||
                  !formData.password
                }>
                {loading ? "Sending..." : "Send Invite"}
              </Button>
            </HStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;
