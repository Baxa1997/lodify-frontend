import React, {useCallback, useState} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Text,
  Button,
  VStack,
  HStack,
  Box,
  Select,
  useToast,
} from "@chakra-ui/react";
import {useForm, Controller} from "react-hook-form";
import {PhoneInput} from "react-international-phone";
import "react-international-phone/style.css";
import styles from "../style.module.scss";
import {useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import driversService from "../../../services/driversService";

const AddDriverModal = ({isOpen, onClose}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const userInfo = useSelector((state) => state.auth);
  const toast = useToast();

  const handleAddDriver = useCallback(
    async (driverData) => {
      try {
        const apiData = {
          data: {
            attributes: {},
            first_name: driverData.first_name,
            middle_name: driverData.middle_name,
            last_name: driverData.last_name,
            phone: driverData.phone,
            email: driverData.email,
            date_of_birth: driverData.date_of_birth,
            hire_date: driverData.hire_date,
            client_type_id: driverData.client_type_id,
            role_id: driverData.role_id,
            companies_id:
              userInfo?.user_data?.companies_id || userInfo?.user_data?.guid,
            cdl_class: driverData.cdl_class,
            licence: driverData.licence,
            region: driverData.region,
            status: [driverData.status],
            medical_card: driverData.medical_card,
            state: driverData.state,
            zip_code: driverData.zip_code,
            // relationship: [driverData.relationship],
            country: [driverData.country],
            load_eligibility: [driverData.load_eligibility],
            address_1: driverData.address_1,
            address_2: driverData.address_2,
            emergency_first_name: driverData.emergency_first_name,
            emergency_last_name: driverData.emergency_last_name,
            emergency_phone: driverData.emergency_phone,
          },
        };

        await driversService.createDriver(apiData);

        queryClient.invalidateQueries({queryKey: ["GET_DRIVERS_LIST"]});
        handleClose();
        setLoading(false);

        toast({
          title: "Driver Added Successfully!",
          description: "The driver has been created and added to the system",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        setLoading(false);
        console.error("Error adding driver:", error);

        toast({
          title: "Error Adding Driver",
          description:
            error?.response?.data?.message ||
            "Failed to add driver. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    },
    [queryClient, userInfo]
  );

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    formState: {errors, isValid},
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      hire_date: "",
      client_type_id: "8edba75a-eb27-4f41-9b28-59053aad29a4",
      role_id: "cbf5b7ba-492d-41b6-83b9-94b6d9811ce4",
      cdl_class: "",
      licence: "",
      region: "",
      status: "Active",
      medical_card: "",
      state: "",
      zip_code: "",
      relationship: "Grandparent",
      country: "Canada",
      load_eligibility: "Eligible",
      address_1: "",
      address_2: "",
      emergency_first_name: "",
      emergency_last_name: "",
      emergency_phone: "",
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    handleAddDriver(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent className={styles.modalContent}>
        <ModalHeader className={styles.modalHeader}>
          <Text className={styles.modalTitle}>Add Driver</Text>
          <Button onClick={handleClose} className={styles.headCloseButton}>
            <img src="/img/cancelIcon.svg" alt="close" />
          </Button>
        </ModalHeader>

        <ModalBody className={styles.modalBody}>
          <form onSubmit={handleFormSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch" flex="1">
              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.first_name} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    First Name <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{required: "First name is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="First name"
                        className={styles.inputField}
                      />
                    )}
                  />
                  {errors.first_name && (
                    <Text className={styles.errorText}>
                      {errors.first_name.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.middle_name} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Middle Name
                  </FormLabel>
                  <Controller
                    name="middle_name"
                    control={control}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Middle name"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.last_name}>
                <FormLabel className={styles.fieldLabel}>
                  Last Name <span className={styles.required}>*</span>
                </FormLabel>
                <Controller
                  name="last_name"
                  control={control}
                  rules={{required: "Last name is required"}}
                  render={({field}) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Last name"
                      className={styles.inputField}
                    />
                  )}
                />
              </FormControl>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.cdl_class} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    CDL Class <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="cdl_class"
                    control={control}
                    rules={{required: "CDL class is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="CDL class"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.licence} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    License <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="licence"
                    control={control}
                    rules={{required: "License is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="License"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.region} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Region <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="region"
                    control={control}
                    rules={{required: "Region is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Region"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.status} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Status <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="status"
                    control={control}
                    rules={{required: "Status is required"}}
                    render={({field}) => (
                      <Select
                        {...field}
                        placeholder="Select status"
                        className={styles.inputField}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Suspended">Suspended</option>
                      </Select>
                    )}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.medical_card} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Medical Card <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="medical_card"
                    control={control}
                    rules={{required: "Medical card is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Medical card"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.phone} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Phone Number <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{required: "Phone number is required"}}
                    render={({field}) => (
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
                          value={field.value || ""}
                          onChange={(phone) => {
                            field.onChange(phone);
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
                    )}
                  />
                </FormControl>
                <FormControl isInvalid={!!errors.email} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Email Address <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Please enter a valid email address",
                      },
                    }}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email address"
                        className={styles.inputField}
                      />
                    )}
                  />
                  {errors.email && (
                    <Text className={styles.errorText}>
                      {errors.email.message}
                    </Text>
                  )}
                </FormControl>
              </HStack>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.date_of_birth} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Date of Birth <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="date_of_birth"
                    control={control}
                    rules={{required: "Date of birth is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="date"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.hire_date} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Hire Date <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="hire_date"
                    control={control}
                    rules={{required: "Hire date is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="date"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.zip_code} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Zip Code <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="zip_code"
                    control={control}
                    rules={{required: "Zip code is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Zip code"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
                <FormControl isInvalid={!!errors.state} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    State <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="state"
                    control={control}
                    rules={{required: "State is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="State"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.country} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Country <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="country"
                    control={control}
                    rules={{required: "Country is required"}}
                    render={({field}) => (
                      <Select
                        {...field}
                        placeholder="Select country"
                        className={styles.inputField}>
                        <option value="Canada">Canada</option>
                        <option value="United States">United States</option>
                        <option value="Mexico">Mexico</option>
                      </Select>
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.load_eligibility} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Load Eligibility <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="load_eligibility"
                    control={control}
                    rules={{required: "Load eligibility is required"}}
                    render={({field}) => (
                      <Select
                        {...field}
                        placeholder="Select load eligibility"
                        className={styles.inputField}>
                        <option value="Eligible">Eligible</option>
                        <option value="Not Eligible">Not Eligible</option>
                        <option value="Pending">Pending</option>
                      </Select>
                    )}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.address_1} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Address 1 <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="address_1"
                    control={control}
                    rules={{required: "Address 1 is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Address 1"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.address_2} flex={1}>
                  <FormLabel className={styles.fieldLabel}>Address 2</FormLabel>
                  <Controller
                    name="address_2"
                    control={control}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Address 2"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.address_2} flex={1}>
                <FormLabel className={styles.fieldLabel}>City</FormLabel>
                <Controller
                  name="city"
                  control={control}
                  render={({field}) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="Address 2"
                      className={styles.inputField}
                    />
                  )}
                />
              </FormControl>

              <Text variant="h5">Emergency Contact</Text>
              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.emergency_first_name} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    First Name <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="emergency_first_name"
                    control={control}
                    rules={{required: "First Name is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="First Name"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
                <FormControl isInvalid={!!errors.emergency_last_name} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Last Name <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="emergency_last_name"
                    control={control}
                    rules={{required: "Last Name is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Last Name"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
              </HStack>
              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.relationship} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Emergency Relationship{" "}
                    <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="relationship"
                    control={control}
                    rules={{required: "Relationship is required"}}
                    render={({field}) => (
                      <Select
                        {...field}
                        placeholder="Select relationship"
                        className={styles.inputField}>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Child">Child</option>
                        <option value="Other">Other</option>
                      </Select>
                    )}
                  />
                </FormControl>
                <FormControl isInvalid={!!errors.emergency_phone} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Emergency Phone Number{" "}
                    <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="emergency_phone"
                    control={control}
                    rules={{required: "Emergency phone number is required"}}
                    render={({field}) => (
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
                          value={field.value || ""}
                          onChange={(phone) => {
                            field.onChange(phone);
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
                    )}
                  />
                </FormControl>
              </HStack>
            </VStack>

            <HStack spacing={3} justify="flex-end" mt={2}>
              <Button onClick={handleClose} type="button" variant="outline">
                Close
              </Button>
              <Button
                type="submit"
                className={styles.sendInviteButton}
                isDisabled={!isValid || loading}>
                {loading ? "Creating..." : "Create Driver"}
              </Button>
            </HStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddDriverModal;
