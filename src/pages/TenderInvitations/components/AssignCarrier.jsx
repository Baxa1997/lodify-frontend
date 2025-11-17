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
import tripsService from "@services/tripsService";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import {addHours, parseISO} from "date-fns";
import HFSearchableSelect from "@components/HFSearchableSelect";
import useDebounce from "@hooks/useDebounce";

const AssignCarrier = ({isOpen, onClose, selectedRow = {}}) => {
  const queryClient = useQueryClient();
  const {control, handleSubmit} = useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const envId = useSelector((state) => state.auth.environmentId);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);

  const debouncedSetSearch = useDebounce((value) => {
    setDebouncedSearchText(value);
  }, 300);

  useEffect(() => {
    debouncedSetSearch(searchText);
  }, [searchText, debouncedSetSearch]);

  const onSubmit = (data) => {
    const now = new Date().toISOString();
    const parsed = parseISO(now);
    const plusTwoHours = addHours(parsed, 2);
    const isoPlusTwo = plusTwoHours.toISOString();

    setLoading(true);
    const computedData = {
      data: {
        guid: selectedRow?.trip?.guid,
        companies_id_2: data?.companies_id,
        timer_expiration: isoPlusTwo,
      },
    };
    tripsService
      .assignDriver(computedData)
      .then((res) => {
        queryClient.invalidateQueries({queryKey: ["TRIPS_LIST_TENDER_ACTIVE"]});
        queryClient.invalidateQueries({queryKey: ["TRIPS_LIST_TENDER_CLOSED"]});
        onClose();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const {data: carriersData} = useQuery({
    queryKey: ["CARRIERS_LIST", brokersId, debouncedSearchText],
    queryFn: () =>
      tripsService.getCarriersList({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "list",
        object_data: {
          broker_id: brokersId,
          own_carriers: true,
          offset: 0,
          limit: 10,
          ...(debouncedSearchText && {search: debouncedSearchText}),
        },
        table: "carriers",
      }),
    select: (res) =>
      res.data?.response?.map((item) => ({
        label: item?.legal_name,
        value: item?.guid,
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
          <HFSearchableSelect
            control={control}
            name="companies_id"
            options={carriersData}
            searchText={searchText}
            setSearchText={setSearchText}
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
