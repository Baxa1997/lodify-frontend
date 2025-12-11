import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Text,
  Box,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
} from "@chakra-ui/react";
import {useForm, Controller} from "react-hook-form";
import {useInsuranceProps} from "./useInsuranceProps";

const ComplianceDetailModal = ({isOpen, onClose, insuranceData = {}}) => {
  const {formatDate, formatCurrency} = useInsuranceProps();
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      insuranceName: insuranceData?.insuranceName || "",
      policyNumber: insuranceData?.policyNumber || "",
      effectiveDate: insuranceData?.effectiveDate
        ? formatDate(insuranceData.effectiveDate)
        : "",
      expirationDate: insuranceData?.expirationDate
        ? formatDate(insuranceData.expirationDate)
        : "",
      cancellationDate: insuranceData?.cancellationDate
        ? formatDate(insuranceData.cancellationDate)
        : "",
      eachOccurrence: insuranceData?.eachOccurrence
        ? formatCurrency(insuranceData.eachOccurrence)
        : "",
      generalAggregate: insuranceData?.generalAggregate
        ? formatCurrency(insuranceData.generalAggregate)
        : "",
    },
  });

  React.useEffect(() => {
    if (isOpen && insuranceData) {
      reset({
        insuranceName: insuranceData?.insuranceName || "",
        policyNumber: insuranceData?.policyNumber || "",
        effectiveDate: insuranceData?.effectiveDate
          ? formatDate(insuranceData.effectiveDate)
          : "",
        expirationDate: insuranceData?.expirationDate
          ? formatDate(insuranceData.expirationDate)
          : "",
        cancellationDate: insuranceData?.cancellationDate
          ? formatDate(insuranceData.cancellationDate)
          : "",
        eachOccurrence: insuranceData?.eachOccurrence
          ? formatCurrency(insuranceData.eachOccurrence)
          : "",
        generalAggregate: insuranceData?.generalAggregate
          ? formatCurrency(insuranceData.generalAggregate)
          : "",
      });
    }
  }, [isOpen, insuranceData, reset, formatDate, formatCurrency]);

  const onSubmit = (data) => {
    console.log("Form data:", data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent
        borderRadius="12px"
        bg="white"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.1)">
        <ModalHeader
          p="20px 24px"
          borderBottom="1px solid #E2E8F0"
          position="relative">
          <Text color="#181D27" fontSize="18px" fontWeight="600">
            {insuranceData?.title || "General Liability"}
          </Text>
          <ModalCloseButton
            position="absolute"
            right="24px"
            top="20px"
            color="#6B7280"
            _hover={{color: "#181D27"}}
          />
        </ModalHeader>

        <ModalBody p="24px">
          <form onSubmit={handleSubmit(onSubmit)} id="insurance-form">
            <Grid templateColumns="repeat(2, 1fr)" gap="20px">
              <Box>
                <FormControl isInvalid={!!errors.insuranceName} mb="20px">
                  <FormLabel
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27"
                    mb="8px">
                    Insurance name{" "}
                    <Text as="span" color="#1570EF">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    name="insuranceName"
                    control={control}
                    rules={{required: "Insurance name is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        placeholder="Insurance name"
                        border="1px solid #D5D7DA"
                        borderRadius="8px"
                        fontSize="14px"
                        px="12px"
                        py="10px"
                        _focus={{
                          borderColor: "#1570EF",
                          boxShadow: "0 0 0 1px #1570EF",
                        }}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.effectiveDate} mb="20px">
                  <FormLabel
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27"
                    mb="8px">
                    Effective date{" "}
                    <Text as="span" color="#1570EF">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    name="effectiveDate"
                    control={control}
                    rules={{required: "Effective date is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="MM/DD/YYYY"
                        border="1px solid #D5D7DA"
                        borderRadius="8px"
                        fontSize="14px"
                        px="12px"
                        py="10px"
                        _focus={{
                          borderColor: "#1570EF",
                          boxShadow: "0 0 0 1px #1570EF",
                        }}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.cancellationDate} mb="20px">
                  <FormLabel
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27"
                    mb="8px">
                    Cancellation date{" "}
                    <Text as="span" color="#1570EF">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    name="cancellationDate"
                    control={control}
                    rules={{required: "Cancellation date is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="MM/DD/YYYY"
                        border="1px solid #D5D7DA"
                        borderRadius="8px"
                        fontSize="14px"
                        px="12px"
                        py="10px"
                        _focus={{
                          borderColor: "#1570EF",
                          boxShadow: "0 0 0 1px #1570EF",
                        }}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.generalAggregate}>
                  <FormLabel
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27"
                    mb="8px">
                    General Aggregate{" "}
                    <Text as="span" color="#1570EF">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    name="generalAggregate"
                    control={control}
                    rules={{required: "General Aggregate is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="$0.00"
                        border="1px solid #D5D7DA"
                        borderRadius="8px"
                        fontSize="14px"
                        px="12px"
                        py="10px"
                        _focus={{
                          borderColor: "#1570EF",
                          boxShadow: "0 0 0 1px #1570EF",
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Box>

              <Box>
                <FormControl isInvalid={!!errors.policyNumber} mb="20px">
                  <FormLabel
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27"
                    mb="8px">
                    Policy Number{" "}
                    <Text as="span" color="#1570EF">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    name="policyNumber"
                    control={control}
                    rules={{required: "Policy Number is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        placeholder="Policy Number"
                        border="1px solid #D5D7DA"
                        borderRadius="8px"
                        fontSize="14px"
                        px="12px"
                        py="10px"
                        _focus={{
                          borderColor: "#1570EF",
                          boxShadow: "0 0 0 1px #1570EF",
                        }}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.expirationDate} mb="20px">
                  <FormLabel
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27"
                    mb="8px">
                    Expiration date{" "}
                    <Text as="span" color="#1570EF">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    name="expirationDate"
                    control={control}
                    rules={{required: "Expiration date is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="MM/DD/YYYY"
                        border="1px solid #D5D7DA"
                        borderRadius="8px"
                        fontSize="14px"
                        px="12px"
                        py="10px"
                        _focus={{
                          borderColor: "#1570EF",
                          boxShadow: "0 0 0 1px #1570EF",
                        }}
                      />
                    )}
                  />
                </FormControl>

                <FormControl isInvalid={!!errors.eachOccurrence}>
                  <FormLabel
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27"
                    mb="8px">
                    Each Occurrence{" "}
                    <Text as="span" color="#1570EF">
                      *
                    </Text>
                  </FormLabel>
                  <Controller
                    name="eachOccurrence"
                    control={control}
                    rules={{required: "Each Occurrence is required"}}
                    render={({field}) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="$0.00"
                        border="1px solid #D5D7DA"
                        borderRadius="8px"
                        fontSize="14px"
                        px="12px"
                        py="10px"
                        _focus={{
                          borderColor: "#1570EF",
                          boxShadow: "0 0 0 1px #1570EF",
                        }}
                      />
                    )}
                  />
                </FormControl>
              </Box>
            </Grid>
          </form>
        </ModalBody>

        <ModalFooter
          p="20px 24px"
          borderTop="1px solid #E2E8F0"
          justifyContent="flex-end"
          gap="12px">
          <Button
            onClick={onClose}
            variant="outline"
            borderColor="#D5D7DA"
            color="#181D27"
            fontSize="14px"
            fontWeight="500"
            px="20px"
            py="10px"
            borderRadius="8px"
            _hover={{
              bg: "#F9FAFB",
              borderColor: "#9CA3AF",
            }}>
            Close
          </Button>
          <Button
            type="submit"
            form="insurance-form"
            bg="#ff5b04"
            color="white"
            fontSize="14px"
            fontWeight="500"
            px="20px"
            py="10px"
            borderRadius="8px"
            _hover={{
              bg: "#ff5b04",
            }}
            _disabled={{
              bg: "#D1D5DB",
              color: "#9CA3AF",
              cursor: "not-allowed",
            }}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ComplianceDetailModal;
