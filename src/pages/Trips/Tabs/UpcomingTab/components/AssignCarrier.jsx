import React, {useEffect, useState, useMemo} from "react";
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import tripsService from "@services/tripsService";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import HFSearchableSelect from "@components/HFSearchableSelect";
import useDebounce from "@hooks/useDebounce";

const AssignCarrier = ({
  isOpen,
  onClose,
  selectedRow = {},
  refetchKey = "UPCOMING_TRIPS",
}) => {
  const queryClient = useQueryClient();
  const {control, handleSubmit, watch} = useForm();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const cancelRef = React.useRef();
  const envId = useSelector((state) => state.auth.environmentId);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);

  const debouncedSetSearch = useDebounce((value) => {
    setDebouncedSearchText(value);
  }, 300);

  useEffect(() => {
    debouncedSetSearch(searchText);
  }, [searchText, debouncedSetSearch]);

  const isReassign = !!selectedRow?.trip?.carrier?.legal_name;

  const performAssignment = (data) => {
    if (!data?.companies_id) {
      return;
    }

    setLoading(true);
    const computedData = {
      data: {
        orders_id: selectedRow?.trip?.guid,
        companies_id: data?.companies_id,
      },
    };

    tripsService
      .assignCarrier(computedData)
      .then((res) => {
        console.log(
          isReassign ? "Carrier reassigned" : "Carrier assigned",
          res
        );
        queryClient.invalidateQueries({queryKey: [refetchKey]});
        setShowConfirmDialog(false);
        setPendingFormData(null);
        onClose();
      })
      .catch((error) => {
        console.error("Error assigning carrier:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSubmit = (data) => {
    if (!data?.companies_id) {
      return;
    }

    if (isReassign) {
      setPendingFormData(data);
      setShowConfirmDialog(true);
    } else {
      performAssignment(data);
    }
  };

  const handleConfirmReassign = () => {
    if (pendingFormData) {
      performAssignment(pendingFormData);
    }
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
    enabled: Boolean(isOpen) && !!brokersId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const options = useMemo(() => {
    if (selectedRow?.trip?.carrier?.guid) {
      return carriersData?.filter(
        (item) => item?.value !== selectedRow?.trip?.carrier?.guid
      );
    }
    return carriersData;
  }, [carriersData, selectedRow]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isReassign ? "Re-Assign Carrier" : "Assign Carrier"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="16px" fontWeight="500" color="gray.700" mb={2}>
              Select Carrier
            </Text>
            <HFSearchableSelect
              control={control}
              name="companies_id"
              options={options}
              searchText={searchText}
              setSearchText={setSearchText}
              handleOptions={setSelectedCarrier}
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
                {isReassign ? "Re-Assign" : "Assign"}
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={showConfirmDialog}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          setShowConfirmDialog(false);
          setPendingFormData(null);
        }}
        isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="18px" fontWeight="600">
              Confirm Re-Assignment
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text fontSize="16px" mb={2}>
                Are you sure you want to reassign the carrier to{" "}
                <strong>{selectedCarrier?.label}</strong>?
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingFormData(null);
                }}
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
                bg="#EF6820"
                color="white"
                onClick={handleConfirmReassign}
                isLoading={loading}
                ml={3}
                fontSize="14px"
                fontWeight="500"
                px={4}
                py={2}
                borderRadius="8px"
                _hover={{bg: "#D97706"}}>
                Yes, Re-Assign
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default AssignCarrier;
