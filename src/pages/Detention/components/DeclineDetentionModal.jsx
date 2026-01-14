import React, {useState} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  useToast,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import {useForm, Controller} from "react-hook-form";
import {useQueryClient} from "@tanstack/react-query";
import HFTextField from "@components/HFTextField";
import tripsService from "@services/tripsService";

const DeclineDetentionModal = ({isOpen, onClose, trip}) => {
  const [declineLoading, setDeclineLoading] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      amount: "",
      note: "",
    },
  });

  const onSubmit = async (data) => {
    setDeclineLoading(true);
    try {
      await tripsService.createItems("detention_notes", {
        data: {
          status: ["Dispute"],
          trip_detention_id: trip?.detention_guid,
          amount: parseFloat(data.amount),
          note: data.note,
        },
      });

      toast({
        title: "Success",
        description: "Detention request declined successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      setDeclineLoading(false);
      queryClient.invalidateQueries(["DETENTION_REQUESTS"]);
      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to decline detention request",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="18px"
          fontWeight="600"
          color="#181D27"
          borderBottom="1px solid #E9EAEB"
          pb="16px">
          Decline Detention Request
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py="24px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDirection="column" gap="20px">
              <HFTextField
                border="1px solid #D5D7DA"
                name="amount"
                control={control}
                label="Amount"
                placeholder="Enter amount"
                type="number"
                rules={{
                  required: "Amount is required",
                  min: {
                    value: 0,
                    message: "Amount must be greater than or equal to 0",
                  },
                }}
                errors={errors}
              />

              <FormControl isInvalid={errors.note}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="#414651"
                  mb="6px">
                  Note
                  <span style={{color: "#EF6820"}}> *</span>
                </FormLabel>
                <Controller
                  name="note"
                  control={control}
                  rules={{
                    required: "Note is required",
                  }}
                  render={({field}) => (
                    <Textarea
                      {...field}
                      placeholder="Enter note"
                      minH="100px"
                      fontSize="14px"
                      borderColor="#D5D7DA"
                      _hover={{borderColor: "#D5D7DA"}}
                      _focus={{
                        borderColor: "#EF6820",
                        boxShadow: "0 0 0 1px #EF6820",
                      }}
                    />
                  )}
                />
                {errors.note && (
                  <span style={{color: "#EF6820", fontSize: "12px"}}>
                    {errors.note.message}
                  </span>
                )}
              </FormControl>

              <Flex gap="12px" mt="8px">
                <Button
                  variant="outline"
                  w="full"
                  h="44px"
                  fontSize="14px"
                  fontWeight="600"
                  color="#414651"
                  borderColor="#D5D7DA"
                  onClick={handleClose}
                  _hover={{bg: "#F9FAFB"}}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  w="full"
                  h="44px"
                  fontSize="14px"
                  fontWeight="600"
                  bg="#EF6820"
                  color="white"
                  isLoading={isSubmitting}
                  _hover={{bg: "#D55A1A"}}
                  _active={{bg: "#C14E15"}}>
                  Decline Request
                </Button>
              </Flex>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeclineDetentionModal;
