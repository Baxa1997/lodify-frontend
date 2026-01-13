import React, {useState} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Button,
  VStack,
  HStack,
  Box,
  Radio,
  RadioGroup,
  useToast,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import styles from "./AddUserModal.module.scss";
import {useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import HFTextField from "./HFTextField";
import HFPhoneInput from "./HFPhoneInput";
import usersService from "../services/usersService";
import IPAddressFinder from "../utils/getIpAddress";

const AddUserModal = ({
  isOpen,
  onClose,
  roleType = "",
  roleTypeFilter = "",
  roleTypeValue = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("dispatcher");
  const queryClient = useQueryClient();
  const userData = useSelector((state) => state.auth.user_data);
  const clientTypeId = useSelector((state) => state?.auth?.clientType?.id);
  const {ip} = IPAddressFinder();
  const toast = useToast();

  const roleMapping = {
    dispatcher: userData?.brokers_id
      ? "fce7d0b3-ad55-49d2-aae7-8de13fdaa2c9"
      : "9414bcae-405e-44e2-a25c-2456061bcdf0",
    administrator: userData?.brokers_id
      ? "b509a5e4-5148-46cb-9b53-167b66c3f7e4"
      : "4aa7f264-010c-4c95-b55c-4f119c4d3bb5",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = {
        data: {
          email: data.email,
          password: data.password,
          phone: data.phone,
          login: data.login,
          ip_address: ip || "unknown",
          first_name: data.first_name,
          last_name: data.last_name,
          client_type_id:
            clientTypeId || "706337d3-80dc-4aca-80b3-67fad16cd0d6",
          role_id: roleMapping[selectedRole],
          notes: "",
          [roleTypeFilter]: roleTypeValue,
        },
      };

      await usersService.addUser(payload, roleType);

      toast({
        title: "User Added Successfully",
        description: `Invitation sent to ${data.email}`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      queryClient.invalidateQueries(["users"]);

      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add user",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedRole("dispatcher");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent className={styles.modalContent}>
        <ModalHeader className={styles.modalHeader}>
          <Text className={styles.modalTitle}>Add User</Text>
          <Button onClick={handleClose} className={styles.headCloseButton}>
            <img src="/img/cancelIcon.svg" alt="close" />
          </Button>
        </ModalHeader>

        <ModalBody className={styles.modalBody}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch" flex="1">
              <HStack spacing={3} align="flex-start">
                <HFTextField
                  control={control}
                  name="first_name"
                  label="First Name"
                  placeholder="First name"
                  required
                  rules={{
                    required: "First name is required",
                    minLength: {
                      value: 2,
                      message: "First name must be at least 2 characters",
                    },
                  }}
                  className={styles.inputField}
                />

                <HFTextField
                  control={control}
                  name="last_name"
                  label="Last Name"
                  placeholder="Last name"
                  required
                  rules={{
                    required: "Last name is required",
                    minLength: {
                      value: 2,
                      message: "Last name must be at least 2 characters",
                    },
                  }}
                  className={styles.inputField}
                />
              </HStack>

              <HFTextField
                control={control}
                name="email"
                label="Email Address"
                placeholder="Email address"
                type="email"
                required
                rules={{
                  required: "Email address is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Please enter a valid email address",
                  },
                }}
                className={styles.inputField}
              />

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel className={styles.fieldLabel}>
                  Phone number <span className={styles.required}>*</span>
                </FormLabel>
                <HFPhoneInput control={control} name="phone" />
                {errors.phone && (
                  <Text className={styles.errorText} mt={1}>
                    {errors.phone.message}
                  </Text>
                )}
              </FormControl>

              <HFTextField
                control={control}
                name="login"
                label="Login"
                placeholder="Login"
                required
                rules={{
                  required: "Login is required",
                  minLength: {
                    value: 3,
                    message: "Login must be at least 3 characters",
                  },
                }}
                className={styles.inputField}
              />

              <HFTextField
                control={control}
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
                required
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                className={styles.inputField}
              />

              <Box>
                <Text className={styles.sectionTitle}>User Role</Text>

                <VStack spacing={2} align="stretch" mt={3}>
                  <RadioGroup
                    value={selectedRole}
                    onChange={(value) => setSelectedRole(value)}>
                    <VStack spacing={2} align="stretch">
                      <Box className={styles.roleOption}>
                        <HStack spacing={2} align="flex-start">
                          <Radio
                            colorScheme="orange"
                            value="dispatcher"
                            className={styles.roleRadio}
                          />
                          <VStack align="stretch" spacing={1} flex={1}>
                            <Text className={styles.roleLabel}>Dispatcher</Text>
                          </VStack>
                        </HStack>
                      </Box>

                      <Box className={styles.roleOption}>
                        <HStack spacing={2} align="flex-start">
                          <Radio
                            colorScheme="orange"
                            value="administrator"
                            className={styles.roleRadio}
                          />
                          <VStack align="stretch" spacing={1} flex={1}>
                            <Text className={styles.roleLabel}>
                              Administrator
                            </Text>
                          </VStack>
                        </HStack>
                      </Box>
                    </VStack>
                  </RadioGroup>
                </VStack>
              </Box>
            </VStack>

            <HStack spacing={3} justify="flex-end" mt={6}>
              <Button
                onClick={handleClose}
                type="button"
                variant="outline"
                isDisabled={loading}>
                Close
              </Button>
              <Button
                type="submit"
                className={styles.sendInviteButton}
                isLoading={loading}
                loadingText="Sending..."
                isDisabled={!isValid || loading}>
                Send Invite
              </Button>
            </HStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddUserModal;
