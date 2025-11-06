import React, { useCallback, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Text,
  Button,
  VStack,
  HStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import clientsService from "../../../services/clientsService";
import HFTextField from "@components/HFTextField";
import HFPhoneInput from "@components/HFPhoneInput";
import HFSelect from "@components/HFSelect";

const AddRepresentModal = ({
  isOpen,
  onClose,
  text = "Create Representative",
  selectedRepresentative = null,
  isEditMode = false,
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const userInfo = useSelector((state) => state.auth);
  const toast = useToast();

  const { data: shippers } = useQuery({
    queryKey: ["SHIPPERS_LIST"],
    queryFn: () => clientsService.getListShipper(),
    select: (data) => data?.data?.response || [],
    enabled: isOpen,
  });

  const handleRepresentativeSubmit = useCallback(
    async (representativeData) => {
      try {
        let apiData;

        if (isEditMode && selectedRepresentative) {
          // Update existing representative
          apiData = {
            data: {
              guid: selectedRepresentative.id || selectedRepresentative.guid,
              full_name: representativeData.full_name,
              email: representativeData.email,
              phone: representativeData.phone,
              title: representativeData.title,
              shippers_id: representativeData.shippers_id,
            },
          };
          await clientsService.updateRepresentative(apiData);
        } else {
          // Create new representative
          apiData = {
            data: {
              full_name: representativeData.full_name,
              email: representativeData.email,
              phone: representativeData.phone,
              title: representativeData.title,
              shippers_id: representativeData.shippers_id,
            },
          };
          await clientsService.createRepresentative(apiData);
        }

        queryClient.invalidateQueries({ queryKey: ["REPRESENTATIVES_LIST"] });
        handleClose();
        setLoading(false);

        toast({
          title: isEditMode
            ? "Representative Updated Successfully!"
            : "Representative Added Successfully!",
          description: isEditMode
            ? "The representative has been updated successfully"
            : "The representative has been created and added to the system",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        setLoading(false);
        console.error(
          isEditMode
            ? "Error updating representative:"
            : "Error adding representative:",
          error,
        );

        toast({
          title: isEditMode
            ? "Error Updating Representative"
            : "Error Adding Representative",
          description:
            error?.response?.data?.message ||
            `Failed to ${
              isEditMode ? "update" : "add"
            } representative. Please try again.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    },
    [queryClient, userInfo, isEditMode, selectedRepresentative],
  );

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      title: "",
      shippers_id: "",
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    handleRepresentativeSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (selectedRepresentative && isEditMode) {
      reset({
        full_name: selectedRepresentative.full_name || "",
        email: selectedRepresentative.email || "",
        phone: selectedRepresentative.phone || "",
        title: selectedRepresentative.title || "",
        shippers_id: selectedRepresentative.shippers_id || "",
      });
    } else {
      reset({
        full_name: "",
        email: "",
        phone: "",
        title: "",
        shippers_id: "",
      });
    }
  }, [selectedRepresentative, isEditMode, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent
        borderRadius="12px"
        bg="white"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)">
        <ModalHeader
          borderBottom="1px solid #E9EAEB"
          pb={4}
          pt={6}
          px={6}>
          <Text
            fontSize="18px"
            fontWeight="600"
            color="gray.800">
            {isEditMode ? "Edit Representative" : "Add Representative"}
          </Text>
        </ModalHeader>

        <ModalBody
          px={6}
          py={6}>
          <form onSubmit={handleFormSubmit(onSubmit)}>
            <VStack
              spacing={5}
              align="stretch"
              flex="1">
              <FormControl isInvalid={!!errors.full_name}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="gray.700"
                  mb={2}>
                  Full Name <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <HFTextField
                  name="full_name"
                  control={control}
                  placeholder="Enter full name"
                  border="1px solid #E2E8F0"
                  borderRadius="8px"
                  fontSize="14px"
                  rules={{
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Full name must be at least 2 characters",
                    },
                  }}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="gray.700"
                  mb={2}>
                  Email <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <HFTextField
                  name="email"
                  control={control}
                  placeholder="Enter email address"
                  border="1px solid #E2E8F0"
                  borderRadius="8px"
                  fontSize="14px"
                  type="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="gray.700"
                  mb={2}>
                  Phone <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <HFPhoneInput
                  name="phone"
                  control={control}
                  placeholder="Enter phone number"
                  border="1px solid #E2E8F0"
                  borderRadius="8px"
                  fontSize="14px"
                  rules={{
                    required: "Phone number is required",
                  }}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.title}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="gray.700"
                  mb={2}>
                  Title <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <HFTextField
                  name="title"
                  control={control}
                  placeholder="Enter job title"
                  border="1px solid #E2E8F0"
                  borderRadius="8px"
                  fontSize="14px"
                  rules={{
                    required: "Title is required",
                  }}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.shippers_id}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="gray.700"
                  mb={2}>
                  Shipper <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <HFSelect
                  name="shippers_id"
                  control={control}
                  placeholder="Select a shipper"
                  border="1px solid #E2E8F0"
                  borderRadius="8px"
                  fontSize="14px"
                  rules={{
                    required: "Shipper selection is required",
                  }}
                  options={
                    shippers?.map((shipper) => ({
                      value: shipper.id || shipper.guid,
                      label: shipper.name || shipper.full_name,
                    })) || []
                  }
                />
              </FormControl>
            </VStack>

            <HStack
              spacing={3}
              justify="flex-end"
              mt={8}>
              <Button
                onClick={handleClose}
                type="button"
                variant="outline"
                borderColor="#E2E8F0"
                color="gray.600"
                fontSize="14px"
                fontWeight="500"
                px={6}
                py={2}
                borderRadius="8px"
                _hover={{
                  bg: "gray.50",
                  borderColor: "gray.300",
                }}>
                Cancel
              </Button>
              <Button
                type="submit"
                bg="#3B82F6"
                color="white"
                fontSize="14px"
                fontWeight="500"
                px={6}
                py={2}
                borderRadius="8px"
                _hover={{
                  bg: "#2563EB",
                }}
                _active={{
                  bg: "#1D4ED8",
                }}
                isDisabled={!isValid || loading}
                isLoading={loading}
                loadingText={isEditMode ? "Updating..." : "Creating..."}>
                {isEditMode ? "Update Representative" : text}
              </Button>
            </HStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddRepresentModal;
