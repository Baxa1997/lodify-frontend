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
  Box,
  Input,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {useForm, Controller} from "react-hook-form";
import tripsService from "@services/tripsService";

const delayReasons = [
  "Guard Shack Delay",
  "Scheduling Error",
  "Weather",
  "Rail Delay",
  "Dispatch Error",
  "Driver Error",
  "Mechanical Tractor",
  "Hours of Service Break",
];

const ReportDelay = ({isOpen, onClose, trip = {}, pickup = {}}) => {
  const {control, handleSubmit, reset} = useForm({
    defaultValues: {
      reason: "",
      description: "",
      resume_at: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState("");

  const currentLocation = pickup?.address
    ? `${pickup?.address}, ${pickup?.state || ""}, ${pickup?.zip_code || ""}`
    : "";

  const onSubmit = async (data) => {
    if (!selectedReason || !selectedDateTime) {
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        data: {
          pickup_id: pickup?.guid,
          orders_id: trip?.guid,
          reason: selectedReason,
          description: data.description || "",
          resume_at: selectedDateTime,
          date_time: selectedDateTime,
        },
      };

      await tripsService.reportDelay(requestData);
      reset();
      setSelectedReason("");
      setSelectedDateTime("");
      onClose();
    } catch (error) {
      console.error("Error reporting delay:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedReason("");
    setSelectedDateTime("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent maxW="600px" borderRadius="12px">
        <ModalHeader
          fontSize="20px"
          fontWeight="600"
          color="#181D27"
          pb={4}
          borderBottom="1px solid #E9EAEB">
          Report delay
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={4}>
          <Box mb={6}>
            <Text fontSize="24px" fontWeight="700" color="#181D27" mb={2}>
              Running late?
            </Text>
            <Text fontSize="14px" color="#6B7280" lineHeight="20px">
              If you're stuck in traffic, no need to report. For any other
              delay, let us know when you'll be moving again.
            </Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={4}>
              <Text fontSize="14px" fontWeight="500" color="#181D27" mb={2}>
                Load ID
              </Text>
              <Input
                value={trip?.id || ""}
                readOnly
                bg="#F9FAFB"
                border="1px solid #E9EAEB"
                borderRadius="8px"
                fontSize="14px"
                color="#6B7280"
                _focus={{borderColor: "#E9EAEB", boxShadow: "none"}}
              />
            </Box>

            <Box mb={4}>
              <Text fontSize="14px" fontWeight="500" color="#181D27" mb={2}>
                Current location
              </Text>
              <Input
                value={currentLocation}
                readOnly
                bg="#F9FAFB"
                border="1px solid #E9EAEB"
                borderRadius="8px"
                fontSize="14px"
                color="#6B7280"
                _focus={{borderColor: "#E9EAEB", boxShadow: "none"}}
              />
            </Box>

            <Box mb={4}>
              <Text fontSize="14px" fontWeight="500" color="#181D27" mb={2}>
                Reason
              </Text>
              <Menu>
                <MenuButton
                  as={Button}
                  w="100%"
                  justifyContent="space-between"
                  bg="white"
                  border="1px solid #E9EAEB"
                  borderRadius="8px"
                  fontSize="14px"
                  fontWeight="400"
                  textAlign="left"
                  color={selectedReason ? "#181D27" : "#9CA3AF"}
                  _hover={{bg: "white", borderColor: "#D1D5DB"}}
                  _active={{bg: "white", borderColor: "#D1D5DB"}}
                  rightIcon={
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }>
                  {selectedReason || "Select a reason"}
                </MenuButton>
                <MenuList
                  w="100%"
                  maxH="300px"
                  overflowY="auto"
                  borderRadius="8px"
                  border="1px solid #E9EAEB"
                  boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)">
                  {delayReasons.map((reason) => (
                    <MenuItem
                      key={reason}
                      onClick={() => setSelectedReason(reason)}
                      fontSize="14px"
                      color="#181D27"
                      py={3}
                      borderBottom="1px solid #F3F4F6"
                      _hover={{bg: "#F9FAFB"}}
                      _last={{borderBottom: "none"}}>
                      {reason}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Box>

            <Box mb={4}>
              <Text fontSize="14px" fontWeight="500" color="#181D27" mb={2}>
                When will you be moving again?
              </Text>
              <Input
                type="datetime-local"
                value={selectedDateTime}
                onChange={(e) => setSelectedDateTime(e.target.value)}
                border="1px solid #E9EAEB"
                borderRadius="8px"
                fontSize="14px"
                color={selectedDateTime ? "#181D27" : "#9CA3AF"}
                min={new Date().toISOString().slice(0, 16)}
              />
            </Box>

            <Box mb={6}>
              <Text fontSize="14px" fontWeight="500" color="#181D27" mb={2}>
                Enter load note
              </Text>
              <Controller
                name="description"
                control={control}
                render={({field}) => (
                  <Textarea
                    {...field}
                    placeholder="Add any additional details"
                    border="1px solid #E9EAEB"
                    borderRadius="8px"
                    fontSize="14px"
                    minH="100px"
                    resize="none"
                    _placeholder={{color: "#9CA3AF"}}
                  />
                )}
              />
            </Box>

            <Flex justifyContent="flex-end" gap={3}>
              <Button
                onClick={handleClose}
                variant="outline"
                borderColor="#E9EAEB"
                color="#6B7280"
                fontSize="14px"
                fontWeight="500"
                px={6}
                py={2}
                borderRadius="8px"
                _hover={{bg: "#F9FAFB", borderColor: "#D1D5DB"}}>
                Cancel
              </Button>
              <Button
                type="submit"
                bg="#EF6820"
                color="white"
                fontSize="14px"
                fontWeight="600"
                px={6}
                py={2}
                borderRadius="8px"
                isLoading={loading}
                disabled={!selectedReason || !selectedDateTime}
                _hover={{bg: "#D97706"}}
                _disabled={{
                  bg: "#D1D5DB",
                  color: "#9CA3AF",
                  cursor: "not-allowed",
                }}>
                Submit
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReportDelay;
