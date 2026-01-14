import React, {useEffect} from "react";
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
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";

import Select from "@components/Select";
import tripsService from "@services/tripsService";
import HFTextField from "@components/HFTextField";

const AddDetentionModal = ({isOpen, onClose}) => {
  const toast = useToast();
  const userData = useSelector((state) => state.auth.user_data);

  const isBroker = Boolean(userData.brokers_id);
  const roleType = isBroker ? "brokers_id" : "companies_id";
  const typeValue = isBroker ? userData.brokers_id : userData.companies_id;

  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
  } = useForm({
    defaultValues: {
      trip_id: "",
      amount: "",
      description: "",
    },
  });

  const {data: ordersData = [], isLoading: isLoadingOrders} = useQuery({
    queryKey: ["DETENTION_ORDERS", typeValue],
    queryFn: () =>
      tripsService.getSelectOptionsWithData("orders", {
        data: {
          [roleType]: typeValue,
        },
        table: "orders",
      }),
    select: (data) => {
      const orders = data?.data?.response || [];
      return orders.map((order) => ({
        label: order?.generated_id,
        value: order.guid || order.id,
      }));
    },
    enabled: !!typeValue,
  });

  const onSubmit = async (data) => {
    try {
      await tripsService.createDetentionRequest({
        data: {
          status: ["Request"],
          amount: data?.amount,
          orders_id: data?.trip_id,
          users_id: userData?.guid,
          note: data?.description,
        },
      });

      toast({
        title: "Success",
        description: "Detention request added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      queryClient.invalidateQueries(["DETENTION_REQUESTS"]);

      handleClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add detention request",
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
          Add Detention Request
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py="24px">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Flex flexDirection="column" gap="20px">
              <FormControl isInvalid={errors.trip_id}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="#414651"
                  mb="6px">
                  Select Trip
                  <span style={{color: "#EF6820"}}> *</span>
                </FormLabel>
                <Controller
                  name="trip_id"
                  control={control}
                  rules={{required: "Trip is required"}}
                  render={({field}) => (
                    <Select
                      {...field}
                      placeholder="Select a trip"
                      options={ordersData}
                      isLoading={isLoadingOrders}
                      onChange={(value) => field.onChange(value)}
                      value={field.value}
                      height="44px"
                    />
                  )}
                />
                {errors.trip_id && (
                  <span style={{color: "#EF6820", fontSize: "12px"}}>
                    {errors.trip_id.message}
                  </span>
                )}
              </FormControl>

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
                    message: "Amount must be greater than 0",
                  },
                }}
                errors={errors}
              />

              <FormControl isInvalid={errors.description}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="#414651"
                  mb="6px">
                  Description
                  <span style={{color: "#EF6820"}}> *</span>
                </FormLabel>
                <Controller
                  name="description"
                  control={control}
                  rules={{
                    required: "Description is required",
                  }}
                  render={({field}) => (
                    <Textarea
                      {...field}
                      placeholder="Enter description"
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
                {errors.description && (
                  <span style={{color: "#EF6820", fontSize: "12px"}}>
                    {errors.description.message}
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
                  Add Request
                </Button>
              </Flex>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddDetentionModal;
