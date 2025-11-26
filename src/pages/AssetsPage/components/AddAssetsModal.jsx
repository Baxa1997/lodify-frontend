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
  Select,
  useToast,
} from "@chakra-ui/react";
import {useForm, Controller} from "react-hook-form";
import "react-international-phone/style.css";
import styles from "../style.module.scss";
import {useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import assetsService from "../../../services/assetsService";
import {fieldTypesOptions, validateForm} from "./mockElements";

const AddAssetsModal = ({isOpen, onClose}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const userInfo = useSelector((state) => state.auth);
  const toast = useToast();

  const handleAddAsset = useCallback(
    async (assetData) => {
      try {
        const apiData = {
          data: {
            attributes: {},
            type: [assetData.type],
            licence_plate: assetData.licence_plate,
            year: parseInt(assetData.year),
            fuel_types_id: assetData.fuel_types_id,
            gross_weight: parseInt(assetData.gross_weight),
            vin_number: assetData.vin_number,
            companies_id:
              userInfo?.user_data?.companies_id || userInfo?.user_data?.guid,
            vehicle_number: assetData.vehicle_number,
            units: assetData.units,
            in_service_date: assetData.in_service_date,
            inactivated_at: assetData.inactivated_at,
            verification_status: [assetData.verification_status],
          },
        };

        await assetsService.createAsset(apiData);

        queryClient.invalidateQueries({queryKey: ["GET_ASSETS_LIST"]});
        handleClose();
        setLoading(false);

        toast({
          title: "Asset Added Successfully!",
          description: "The asset has been created and added to the system",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        setLoading(false);
        console.error("Error adding asset:", error);

        toast({
          title: "Error Adding Asset",
          description:
            error?.response?.data?.message ||
            "Failed to add asset. Please try again.",
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
      type: "Tractor",
      licence_plate: "",
      year: "",
      fuel_types: "",
      gross_weight: "",
      vin_number: "",
      vehicle_number: "",
      units: "",
      in_service_date: "",
      inactivated_at: "",
      verification_status: "Verified",
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    handleAddAsset(data);
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
          <Text className={styles.modalTitle}>Add Assets</Text>
          <Button onClick={handleClose} className={styles.headCloseButton}>
            <img src="/img/cancelIcon.svg" alt="close" />
          </Button>
        </ModalHeader>

        <ModalBody className={styles.modalBody}>
          <form onSubmit={handleFormSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch" flex="1">
              <FormControl isInvalid={!!errors.licence_plate}>
                <FormLabel className={styles.fieldLabel}>
                  License Plate <span className={styles.required}>*</span>
                </FormLabel>
                <Controller
                  name="licence_plate"
                  control={control}
                  rules={{required: "License plate is required"}}
                  render={({field}) => (
                    <Input
                      {...field}
                      type="text"
                      placeholder="License plate number"
                      className={styles.inputField}
                    />
                  )}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.year}>
                <FormLabel className={styles.fieldLabel}>
                  Year <span className={styles.required}>*</span>
                </FormLabel>
                <Controller
                  name="year"
                  control={control}
                  rules={{
                    required: "Year is required",
                    validate: (value) => {
                      const year = parseInt(value);
                      if (
                        isNaN(year) ||
                        year < 1900 ||
                        year > new Date().getFullYear() + 1
                      ) {
                        return "Please enter a valid year";
                      }
                      return true;
                    },
                  }}
                  render={({field}) => (
                    <Input
                      {...field}
                      type="number"
                      placeholder="Vehicle year"
                      className={styles.inputField}
                    />
                  )}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.fuel_types}>
                <FormLabel className={styles.fieldLabel}>
                  Fuel Type <span className={styles.required}>*</span>
                </FormLabel>
                <Controller
                  name="fuel_types"
                  control={control}
                  rules={{required: "Fuel type is required"}}
                  render={({field}) => (
                    <Select
                      {...field}
                      placeholder="Select fuel type"
                      className={styles.inputField}>
                      {fieldTypesOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.verification_status}>
                <FormLabel className={styles.fieldLabel}>
                  Verification Status <span className={styles.required}>*</span>
                </FormLabel>
                <Controller
                  name="verification_status"
                  control={control}
                  rules={{required: "Verification status is required"}}
                  render={({field}) => (
                    <Select
                      {...field}
                      placeholder="Select verification status"
                      className={styles.inputField}>
                      <option value="Verified">Verified</option>
                      <option value="Needs attention">Needs attention</option>
                    </Select>
                  )}
                />
              </FormControl>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.gross_weight} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Gross Weight <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="gross_weight"
                    control={control}
                    rules={{
                      required: "Gross weight is required",
                      validate: (value) => {
                        const weight = parseInt(value);
                        if (isNaN(weight) || weight <= 0) {
                          return "Please enter a valid gross weight";
                        }
                        return true;
                      },
                    }}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Gross weight"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.vin_number} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    VIN Number <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="vin_number"
                    control={control}
                    rules={{required: "VIN number is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="VIN number"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.vehicle_number} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Vehicle Number <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="vehicle_number"
                    control={control}
                    rules={{required: "Vehicle number is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Vehicle number"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.units} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Units <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="units"
                    control={control}
                    rules={{required: "Units is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Units"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>
              </HStack>

              <HStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.in_service_date} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    In Service Date <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="in_service_date"
                    control={control}
                    rules={{required: "In service date is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="date"
                        className={styles.inputField}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.inactivated_at} flex={1}>
                  <FormLabel className={styles.fieldLabel}>
                    Inactivated Date <span className={styles.required}>*</span>
                  </FormLabel>
                  <Controller
                    name="inactivated_at"
                    control={control}
                    rules={{required: "Inactivated date is required"}}
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
            </VStack>

            <HStack spacing={3} justify="flex-end" mt={1}>
              <Button onClick={handleClose} type="button" variant="outline">
                Close
              </Button>
              <Button
                type="submit"
                className={styles.sendInviteButton}
                isDisabled={!isValid || loading}>
                {loading ? "Creating..." : "Create Asset"}
              </Button>
            </HStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddAssetsModal;
