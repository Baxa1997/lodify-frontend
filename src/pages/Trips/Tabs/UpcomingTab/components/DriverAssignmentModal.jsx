import React, {useState, useEffect, useMemo} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Flex,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import SearchableSelect from "@components/SearchableSelect";
import driversService from "@services/driversService";
import {useQuery} from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import {useQueryClient} from "@tanstack/react-query";

const DriverAssignmentModal = ({isOpen, onClose, trip}) => {
  const queryClient = useQueryClient();
  const {control, watch, setValue, handleSubmit, reset} = useForm({
    defaultValues: {
      driver1: trip?.drivers?.guid || trip?.drivers_id || "",
      driver2: trip?.drivers_2?.guid || trip?.drivers_id_2 || "",
    },
  });
  const [searchText1, setSearchText1] = useState("");
  const [loading, setLoading] = useState(false);

  const driver1Value = watch("driver1");
  const driver2Value = watch("driver2");

  const {data: driversData = [], isLoading} = useQuery({
    queryKey: ["DRIVERS_LIST"],
    queryFn: () => driversService.getList({}),
    select: (res) => res?.data?.response || [],
  });

  const driverOptions = useMemo(() => {
    return driversData.map((driver) => {
      const label =
        `${driver.first_name || ""} ${driver.last_name || ""}`.trim() ||
        "Driver";
      return {
        label,
        value: driver.guid,
        driverData: driver,
      };
    });
  }, [driversData]);

  const filteredOptions1 = useMemo(() => {
    if (!searchText1) return driverOptions;
    const searchLower = searchText1.toLowerCase();
    return driverOptions.filter((option) =>
      option.label.toLowerCase().includes(searchLower)
    );
  }, [driverOptions, searchText1]);

  const selectedDriver1 = driverOptions.find(
    (opt) => opt.value === driver1Value
  );

  useEffect(() => {
    if (trip) {
      reset({
        driver1: trip?.drivers?.guid || trip?.drivers_id || "",
        driver2: trip?.drivers_2?.guid || trip?.drivers_id_2 || "",
      });
    }
  }, [trip, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const computedData = {
        data: {
          guid: trip?.guid,
          drivers_id: data.driver1 || null,
          drivers_id_2: data.driver2 || null,
        },
      };
      await tripsService.assignDriver(computedData);
      queryClient.invalidateQueries({queryKey: ["UPCOMING_TRIPS"]});
      onClose();
    } catch (error) {
      console.error("Error assigning drivers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset({
      driver1: trip?.drivers?.guid || trip?.drivers_id || "",
      driver2: trip?.drivers_2?.guid || trip?.drivers_id_2 || "",
    });
    setSearchText1("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="12px">
        <ModalHeader fontSize="18px" fontWeight="600" color="#181D27" pb="16px">
          Assign Drivers
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="0px">
          <VStack spacing="20px" align="stretch">
            <Box>
              <Flex alignItems="center" gap={2} mb="6px">
                <Text fontSize="14px" fontWeight="500" color="#414651">
                  Drivers<span style={{color: "#FF6B35"}}>*</span>
                </Text>
                {selectedDriver1 && (
                  <Badge colorScheme="blue" fontSize="10px">
                    Selected
                  </Badge>
                )}
              </Flex>
              <SearchableSelect
                options={filteredOptions1}
                value={driver1Value}
                onChange={(value) => {
                  setValue("driver1", value);

                  if (value === driver2Value) {
                    setValue("driver2", "");
                  }
                }}
                placeholder="Select first driver"
                searchPlaceholder="Search drivers..."
                searchText={searchText1}
                setSearchText={setSearchText1}
                isDisabled={isLoading || loading}
              />
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack spacing="12px">
            <Button
              variant="outline"
              border="1px solid #D5D7DA"
              color="#414651"
              bg="white"
              _hover={{bg: "#F8F9FA"}}
              onClick={handleClose}
              isDisabled={loading}>
              Cancel
            </Button>
            <Button
              bg="#FF6B35"
              color="white"
              _hover={{bg: "#E55A2B"}}
              onClick={handleSubmit(onSubmit)}
              isLoading={loading}
              isDisabled={!driver1Value}>
              Assign
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DriverAssignmentModal;
