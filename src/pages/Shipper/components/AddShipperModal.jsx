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
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import clientsService from "../../../services/clientsService";
import HFFileUpload from "@components/HFFileUpload";
import HFTextField from "@components/HFTextField";

const AddShipperModal = ({
  isOpen,
  onClose,
  text = "Create Shipper",
  selectedShipper = null,
  isEditMode = false,
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const userInfo = useSelector((state) => state.auth);
  const toast = useToast();

  const handleShipperSubmit = useCallback(
    async (shipperData) => {
      try {
        let apiData;

        if (isEditMode && selectedShipper) {
          apiData = {
            data: {
              guid: selectedShipper.id || selectedShipper.guid,
              name: shipperData.name,
              logo: shipperData.logo,
            },
          };
          await clientsService.updateShipper(apiData);
        } else {
          apiData = {
            data: {
              name: shipperData.name,
              logo: shipperData.logo,
            },
          };
          await clientsService.createShipper(apiData);
        }

        queryClient.invalidateQueries({ queryKey: ["CLIENTS_LIST"] });
        handleClose();
        setLoading(false);

        toast({
          title: isEditMode
            ? "Shipper Updated Successfully!"
            : "Shipper Added Successfully!",
          description: isEditMode
            ? "The shipper has been updated successfully"
            : "The shipper has been created and added to the system",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } catch (error) {
        setLoading(false);
        console.error(
          isEditMode ? "Error updating shipper:" : "Error adding shipper:",
          error,
        );

        toast({
          title: isEditMode ? "Error Updating Shipper" : "Error Adding Shipper",
          description:
            error?.response?.data?.message ||
            `Failed to ${
              isEditMode ? "update" : "add"
            } shipper. Please try again.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    },
    [queryClient, userInfo, isEditMode, selectedShipper],
  );

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      logo: "",
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    handleShipperSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  useEffect(() => {
    if (selectedShipper && isEditMode) {
      reset({
        name: selectedShipper.name || selectedShipper.title || "",
        logo: selectedShipper.logo || "",
      });
    } else {
      reset({
        name: "",
        logo: "",
      });
    }
  }, [selectedShipper, isEditMode, reset]);

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
            {isEditMode ? "Edit Shipper" : "Add Shipper"}
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
              <FormControl isInvalid={!!errors.name}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="gray.700"
                  mb={2}>
                  Shipper Name <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <HFTextField
                  name="name"
                  control={control}
                  placeholder="Enter shipper name"
                  border="1px solid #E2E8F0"
                  borderRadius="8px"
                  fontSize="14px"
                  rules={{
                    required: "Shipper name is required",
                    minLength: {
                      value: 2,
                      message: "Shipper name must be at least 2 characters",
                    },
                  }}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.logo}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="gray.700"
                  mb={2}>
                  Logo <span style={{ color: "red" }}>*</span>
                </FormLabel>
                <HFFileUpload
                  name="logo"
                  control={control} />
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
                {isEditMode ? "Update Shipper" : text}
              </Button>
            </HStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddShipperModal;
