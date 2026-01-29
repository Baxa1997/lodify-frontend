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
import {useQueryClient} from "@tanstack/react-query";
import SearchableSelect from "@components/SearchableSelect";

const TrailerAssignmentModal = ({isOpen, onClose, trip, refetchKey = "UPCOMING_TRIPS"}) => {
  const queryClient = useQueryClient();
  const [selectedTrailer, setSelectedTrailer] = useState(null);
  const [trailerSearchText, setTrailerSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const {data: trailersData = [], isLoading: isLoadingTrailers} = useQuery({
    queryKey: ["TRAILERS_LIST", trailerSearchText],
    queryFn: () => tripsService.getTrailersList(),
    select: (res) => res?.data?.response || [],
    enabled: Boolean(isOpen),
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
  console.log("trailersDatatrailersDatatrailersData", trailersData);
  const trailerOptions = useMemo(() => {
    return trailersData.map((trailer) => ({
      label: trailer.plate_number || trailer.external_id || "N/A",
      value: trailer.guid,
      trailerData: trailer,
    }));
  }, [trailersData]);

  useEffect(() => {
    if (isOpen && trip) {
      if (trip?.trailers) {
        const trailerGuid = trip.trailers.guid || trip?.trailers_id;
        const trailerOption = trailerOptions.find(
          (opt) =>
            opt.value === trailerGuid ||
            String(opt.value) === String(trailerGuid)
        );

        if (trailerOption) {
          setSelectedTrailer(trailerOption.value);
        } else if (trailerGuid) {
          setSelectedTrailer(trailerGuid);
        }
      } else if (trip?.trailers_id && trailerOptions.length > 0) {
        const trailerOption = trailerOptions.find(
          (opt) =>
            opt.value === trip.trailers_id ||
            String(opt.value) === String(trip.trailers_id)
        );
        if (trailerOption) {
          setSelectedTrailer(trailerOption.value);
        }
      }
    } else if (isOpen && !trip) {
      setSelectedTrailer(null);
    }
  }, [trip, isOpen, trailerOptions]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updateData = {
        data: {
          guid: trip?.guid,
          trailers_id: selectedTrailer || null,
        },
      };

      await tripsService.updateOrder(updateData);
      queryClient.invalidateQueries({queryKey: [refetchKey]});
      onClose();
    } catch (error) {
      console.error("Error assigning trailer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTrailerSearchText("");
    setSelectedTrailer(null);
    onClose();
  };

  const hasAssignment = trip?.trailers || trip?.trailers_id;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="12px">
        <ModalHeader fontSize="18px" fontWeight="600" color="#181D27" pb="16px">
          {hasAssignment ? "Assign Trailer" : "Assign Trailer"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="0px">
          <VStack spacing="20px" align="stretch">
            <Box>
              <Flex alignItems="center" gap={2} mb="6px">
                <Text fontSize="14px" fontWeight="500" color="#414651">
                  Trailer
                </Text>
              </Flex>
              <SearchableSelect
                options={trailerOptions}
                value={selectedTrailer}
                onChange={setSelectedTrailer}
                placeholder="Select trailer"
                searchPlaceholder="Search trailers..."
                searchText={trailerSearchText}
                setSearchText={setTrailerSearchText}
                isDisabled={isLoadingTrailers || loading}
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
              isLoading={loading}>
              {hasAssignment ? "Reassign" : "Assign"}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TrailerAssignmentModal;
