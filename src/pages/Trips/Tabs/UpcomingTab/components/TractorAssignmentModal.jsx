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
} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import tripsService from "@services/tripsService";
import assetsService from "@services/assetsService";
import {useQueryClient} from "@tanstack/react-query";
import {useSelector} from "react-redux";
import SearchableSelect from "@components/SearchableSelect";

const TractorAssignmentModal = ({isOpen, onClose, trip, refetchKey = "UPCOMING_TRIPS"}) => {
  const queryClient = useQueryClient();
  const [selectedTractor, setSelectedTractor] = useState(null);
  const [tractorSearchText, setTractorSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );

  const {data: tractorsData = [], isLoading: isLoadingTractors} = useQuery({
    queryKey: ["TRACTORS_LIST", companiesId, tractorSearchText],
    queryFn: () =>
      assetsService.getList({
        companies_id: companiesId,
        limit: 100,
        offset: 0,
        ...(tractorSearchText && {search: tractorSearchText}),
      }),
    select: (res) => res?.data?.response || [],
    enabled: Boolean(isOpen) && !!companiesId,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const tractorOptions = useMemo(() => {
    return tractorsData.map((tractor) => ({
      label: tractor.licence_plate || "N/A",
      value: tractor.guid,
      tractorData: tractor,
    }));
  }, [tractorsData]);

  useEffect(() => {
    if (isOpen && trip) {
      if (trip?.tractors) {
        const tractorGuid = trip.tractors.guid || trip?.assets_id;
        const tractorOption = tractorOptions.find(
          (opt) =>
            opt.value === tractorGuid ||
            String(opt.value) === String(tractorGuid)
        );

        if (tractorOption) {
          setSelectedTractor(tractorOption.value);
        } else if (tractorGuid) {
          setSelectedTractor(tractorGuid);
        }
      } else if (trip?.assets_id && tractorOptions.length > 0) {
        const tractorOption = tractorOptions.find(
          (opt) =>
            opt.value === trip.assets_id ||
            String(opt.value) === String(trip.assets_id)
        );
        if (tractorOption) {
          setSelectedTractor(tractorOption.value);
        }
      }
    } else if (isOpen && !trip) {
      setSelectedTractor(null);
    }
  }, [trip, isOpen, tractorOptions]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updateData = {
        data: {
          guid: trip?.guid,
          assets_id: selectedTractor || null,
        },
      };

      await tripsService.updateOrder(updateData);
      queryClient.invalidateQueries({queryKey: [refetchKey]});
      onClose();
    } catch (error) {
      console.error("Error assigning tractor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTractorSearchText("");
    setSelectedTractor(null);
    onClose();
  };

  const hasAssignment = trip?.tractors || trip?.assets_id;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="12px">
        <ModalHeader fontSize="18px" fontWeight="600" color="#181D27" pb="16px">
          {hasAssignment ? "Assign Tractor" : "Assign Tractor"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="0px">
          <VStack spacing="20px" align="stretch">
            <Box>
              <Flex alignItems="center" gap={2} mb="6px">
                <Text fontSize="14px" fontWeight="500" color="#414651">
                  Tractor <span style={{color: "#FF6B35"}}>*</span>
                </Text>
              </Flex>
              <SearchableSelect
                options={tractorOptions}
                value={selectedTractor}
                onChange={setSelectedTractor}
                placeholder="Select tractor"
                searchPlaceholder="Search tractors..."
                searchText={tractorSearchText}
                setSearchText={setTractorSearchText}
                isDisabled={isLoadingTractors || loading}
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
              isDisabled={!selectedTractor}>
              {hasAssignment ? "Reassign" : "Assign"}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TractorAssignmentModal;
