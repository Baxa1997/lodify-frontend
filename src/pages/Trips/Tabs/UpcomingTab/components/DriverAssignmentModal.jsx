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
import driversService from "@services/driversService";
import {useQuery} from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import {useQueryClient} from "@tanstack/react-query";
import SearchableSelectDrivers from "@components/SearchableSelectDrivers";

const DriverAssignmentModal = ({isOpen, onClose, trip}) => {
  const queryClient = useQueryClient();
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

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

  const filteredOptions = useMemo(() => {
    if (!searchText) return driverOptions;
    const searchLower = searchText.toLowerCase();
    return driverOptions.filter((option) =>
      option.label.toLowerCase().includes(searchLower)
    );
  }, [driverOptions, searchText]);

  // Initialize selected drivers from trip when modal opens
  useEffect(() => {
    if (isOpen) {
      if (trip && driverOptions.length > 0) {
        const initialDrivers = [];

        // Get driver 1 (solo) - check both drivers object and drivers_id
        const driver1Guid = trip?.drivers?.guid || trip?.drivers_id;
        if (driver1Guid) {
          const driver1Option = driverOptions.find(
            (opt) => opt.value === driver1Guid
          );
          if (driver1Option) {
            initialDrivers.push(driver1Option);
          } else {
            // If driver not found in options, create option from trip data
            if (trip?.drivers) {
              const label =
                `${trip.drivers.first_name || ""} ${
                  trip.drivers.last_name || ""
                }`.trim() || "Driver";
              initialDrivers.push({
                label,
                value: driver1Guid,
                driverData: trip.drivers,
              });
            }
          }
        }

        // Get driver 2 (team) - check both drivers_2 object and drivers_id_2
        const driver2Guid = trip?.drivers_2?.guid || trip?.drivers_id_2;
        if (driver2Guid) {
          const driver2Option = driverOptions.find(
            (opt) => opt.value === driver2Guid
          );
          if (driver2Option) {
            initialDrivers.push(driver2Option);
          } else {
            // If driver not found in options, create option from trip data
            if (trip?.drivers_2) {
              const label =
                `${trip.drivers_2.first_name || ""} ${
                  trip.drivers_2.last_name || ""
                }`.trim() || "Driver";
              initialDrivers.push({
                label,
                value: driver2Guid,
                driverData: trip.drivers_2,
              });
            }
          }
        }

        setSelectedDrivers(initialDrivers);
      } else if (!trip) {
        setSelectedDrivers([]);
      }
    }
  }, [trip, isOpen, driverOptions]);

  const handleSubmit = async () => {
    if (selectedDrivers.length === 0) return;

    setLoading(true);
    try {
      const computedData = {
        data: {
          guid: trip?.guid,
          drivers_id: selectedDrivers[0]?.value || null,
          drivers_id_2: selectedDrivers[1]?.value || null,
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
    // Reset will happen when modal reopens via useEffect
    setSearchText("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="12px">
        <ModalHeader fontSize="18px" fontWeight="600" color="#181D27" pb="16px">
          {trip?.drivers || trip?.drivers_2
            ? "Reassign Drivers"
            : "Assign Drivers"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="0px">
          <VStack spacing="20px" align="stretch">
            <Box>
              <Flex alignItems="center" gap={2} mb="6px">
                <Text fontSize="14px" fontWeight="500" color="#414651">
                  Drivers <span style={{color: "#FF6B35"}}>*</span>
                </Text>
              </Flex>
              <SearchableSelectDrivers
                options={filteredOptions}
                value={selectedDrivers}
                onChange={setSelectedDrivers}
                maxSelections={2}
                placeholder="Select drivers (max 2)"
                searchPlaceholder="Search drivers..."
                searchText={searchText}
                setSearchText={setSearchText}
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
              onClick={handleSubmit}
              isLoading={loading}
              isDisabled={selectedDrivers.length === 0}>
              {trip?.drivers || trip?.drivers_2 ? "Reassign" : "Assign"}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DriverAssignmentModal;
