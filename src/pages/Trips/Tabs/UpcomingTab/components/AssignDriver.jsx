import React, {useState} from "react";
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
import {useQueryClient} from "@tanstack/react-query";

const AssignDriver = ({isOpen, onClose, selectedRow = {}}) => {
  const queryClient = useQueryClient();
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    const computedData = {
      data: {
        guid: selectedRow.guid,
        drivers_id: data?.driver,
      },
    };
    tripsService
      .assignDriver(computedData)
      .then((res) => {
        queryClient.invalidateQueries({queryKey: ["UPCOMING_TRIPS"]});
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign Driver</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontSize="16px" fontWeight="500" color="gray.700" mb={2}>
            Select Driver
          </Text>
          <HFSelect
            control={control}
            name="driver"
            options={[]}
            view_field="first_name"
            table_slug="drivers"
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

export default AssignDriver;
