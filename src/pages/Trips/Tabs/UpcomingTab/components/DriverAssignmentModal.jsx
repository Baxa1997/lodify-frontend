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

  const maxSelections = useMemo(() => {
    const driverType = trip?.driver_type;
    if (Array.isArray(driverType)) {
      return driverType.includes("Team") ? 2 : 1;
    }
    if (typeof driverType === "string") {
      return driverType === "Team" ? 2 : 1;
    }
    return 2;
  }, [trip?.driver_type]);

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

  useEffect(() => {
    if (isOpen && trip) {
      const initializeDrivers = () => {
        const initialDrivers = [];

        if (trip?.drivers) {
          const driver1Guid = trip.drivers.guid || trip?.drivers_id;
          const label =
            `${trip.drivers.first_name || ""} ${
              trip.drivers.last_name || ""
            }`.trim() || "Driver";

          if (driver1Guid) {
            const driver1Option = driverOptions.find((opt) => {
              if (opt.value === driver1Guid) return true;
              if (opt.value && driver1Guid) {
                return String(opt.value) === String(driver1Guid);
              }
              if (label && opt.label) {
                return opt.label.toLowerCase() === label.toLowerCase();
              }
              return false;
            });
            if (driver1Option) {
              initialDrivers.push(driver1Option);
            } else {
              initialDrivers.push({
                label,
                value: driver1Guid,
                driverData: trip.drivers,
              });
            }
          } else if (label !== "Driver") {
            initialDrivers.push({
              label,
              value: trip.drivers.id || trip?.drivers_id || "",
              driverData: trip.drivers,
            });
          }
        } else if (trip?.drivers_id && driverOptions.length > 0) {
          const driver1Option = driverOptions.find(
            (opt) =>
              opt.value === trip.drivers_id ||
              String(opt.value) === String(trip.drivers_id)
          );
          if (driver1Option) {
            initialDrivers.push(driver1Option);
          }
        }

        const isTeam = Array.isArray(trip?.driver_type)
          ? trip.driver_type.includes("Team")
          : trip?.driver_type === "Team";

        if (isTeam) {
          if (trip?.drivers_2) {
            const driver2Guid = trip.drivers_2.guid || trip?.drivers_id_2;
            const label =
              `${trip.drivers_2.first_name || ""} ${
                trip.drivers_2.last_name || ""
              }`.trim() || "Driver";

            if (driver2Guid) {
              const driver2Option = driverOptions.find((opt) => {
                if (opt.value === driver2Guid) return true;
                if (opt.value && driver2Guid) {
                  return String(opt.value) === String(driver2Guid);
                }
                if (label && opt.label) {
                  return opt.label.toLowerCase() === label.toLowerCase();
                }
                return false;
              });
              if (driver2Option) {
                initialDrivers.push(driver2Option);
              } else {
                initialDrivers.push({
                  label,
                  value: driver2Guid,
                  driverData: trip.drivers_2,
                });
              }
            } else if (label !== "Driver") {
              initialDrivers.push({
                label,
                value: trip.drivers_2.id || trip?.drivers_id_2 || "",
                driverData: trip.drivers_2,
              });
            }
          } else if (trip?.drivers_id_2 && driverOptions.length > 0) {
            const driver2Option = driverOptions.find(
              (opt) =>
                opt.value === trip.drivers_id_2 ||
                String(opt.value) === String(trip.drivers_id_2)
            );
            if (driver2Option) {
              initialDrivers.push(driver2Option);
            }
          }
        }

        setSelectedDrivers(initialDrivers);
      };

      initializeDrivers();
    } else if (isOpen && !trip) {
      setSelectedDrivers([]);
    }
  }, [trip, isOpen, driverOptions]);

  useEffect(() => {
    if (
      isOpen &&
      trip &&
      driverOptions.length > 0 &&
      selectedDrivers.length > 0
    ) {
      const updatedDrivers = selectedDrivers.map((selectedDriver) => {
        const matchingOption = driverOptions.find((opt) => {
          if (opt.value === selectedDriver.value) return true;
          if (opt.value && selectedDriver.value) {
            if (String(opt.value) === String(selectedDriver.value)) return true;
          }
          if (opt.label && selectedDriver.label) {
            if (opt.label.toLowerCase() === selectedDriver.label.toLowerCase())
              return true;
          }
          return false;
        });
        return matchingOption || selectedDriver;
      });

      const needsUpdate = updatedDrivers.some((updated, idx) => {
        const original = selectedDrivers[idx];
        if (!original) return false;
        const valueMatches =
          updated.value === original.value ||
          (updated.value &&
            original.value &&
            String(updated.value) === String(original.value));
        return valueMatches && updated !== original;
      });

      if (needsUpdate) {
        setSelectedDrivers(updatedDrivers);
      }
    }
  }, [driverOptions.length, isOpen]);

  // Enforce maxSelections limit - remove excess drivers if driver_type is Solo
  useEffect(() => {
    if (isOpen && selectedDrivers.length > maxSelections) {
      setSelectedDrivers(selectedDrivers.slice(0, maxSelections));
    }
  }, [maxSelections, isOpen, selectedDrivers.length]);

  const handleSubmit = async () => {
    if (selectedDrivers.length === 0) return;

    setLoading(true);
    try {
      const isTeam = maxSelections === 2;
      const computedData = {
        data: {
          guid: trip?.guid,
          drivers_id: selectedDrivers[0]?.value || null,
          drivers_id_2: isTeam ? selectedDrivers[1]?.value || null : null,
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
                maxSelections={maxSelections}
                placeholder={
                  maxSelections === 2
                    ? "Select drivers (max 2)"
                    : "Select driver"
                }
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
