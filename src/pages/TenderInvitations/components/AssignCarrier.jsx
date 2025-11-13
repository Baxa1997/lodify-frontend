import React, {useEffect, useState} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Button,
  Flex,
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import HFSelect from "@components/HFSelect";
import tripsService from "@services/tripsService";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";

const AssignCarrier = ({isOpen, onClose, selectedRow = {}}) => {
  const queryClient = useQueryClient();
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);

  const onSubmit = (data) => {
    setLoading(true);
    const computedData = {
      data: {
        guid: selectedRow?.trip?.guid,
        companies_id_2: data?.companies_id,
      },
    };
    tripsService
      .assignDriver(computedData)
      .then((res) => {
        queryClient.invalidateQueries({queryKey: ["TRIPS_LIST_TENDER"]});
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const {data: carriersData} = useQuery({
    queryKey: ["CARRIERS_LIST", brokersId],
    queryFn: () => tripsService.getCarriersList({brokers_id: brokersId}),
    select: (res) =>
      res.data?.response?.map((item) => ({
        label: item.companies_id_data?.legal_name,
        value: item.companies_id_data?.guid,
      })),
    enabled: !!brokersId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Carrier</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="16px" fontWeight="500" color="gray.700" mb={2}>
            Select Carrier
          </Text>
          <HFSelect
            control={control}
            name="companies_id"
            options={carriersData}
          />

          <Flex mt={4} justifyContent="flex-end" gap={2}>
            <Button
              onClick={onClose}
              variant="outline"
              borderColor="#EF6820"
              color="#EF6820"
              fontSize="14px"
              fontWeight="500"
              px={4}
              py={2}
              borderRadius="8px"
              _hover={{bg: "gray.50", borderColor: "#EF6820"}}>
              Cancel
            </Button>
            <Button
              type="submit"
              bg="#EF6820"
              color="white"
              _hover={{bg: "#EF6820"}}
              onClick={handleSubmit(onSubmit)}
              isLoading={loading}>
              Assign
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssignCarrier;
