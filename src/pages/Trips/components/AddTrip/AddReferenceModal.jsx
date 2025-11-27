import React, {useState, useMemo} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  VStack,
  HStack,
  Input,
} from "@chakra-ui/react";
import {useWatch} from "react-hook-form";
import Select from "../../../../components/Select";

const AddReferenceModal = ({isOpen, onClose, control, onAddReference}) => {
  const [formData, setFormData] = useState({
    stop: "",
    reference_type: "PU #",
    reference_number: "",
    reference_description: "",
  });

  const tripPickups = useWatch({
    control,
    name: "trip_pickups",
    defaultValue: [],
  });

  const normalizeFieldType = (type) => {
    return Array.isArray(type) && type.length > 0 ? type[0]?.toLowerCase() : "";
  };

  const stopOptions = useMemo(() => {
    if (!tripPickups || tripPickups.length === 0) {
      return [{label: "No stops available", value: ""}];
    }

    return tripPickups.map((pickup, index) => {
      const type = normalizeFieldType(pickup?.type || pickup?.stop_type);
      let label = "";

      if (type === "pickup") {
        label = `Pickup ${index + 1}`;
      } else if (type === "pickup and delivery") {
        label = `Pickup And Delivery ${index + 1}`;
      } else {
        label = `Delivery ${index + 1}`;
      }

      return {
        label,
        value: index + 1,
      };
    });
  }, [tripPickups]);

  const referenceTypeOptions = [
    {label: "PU #", value: "PU #"},
    {label: "PO #", value: "PO #"},
    {label: "Other #", value: "Other #"},
  ];

  const showReferenceDescription = formData.reference_type === "Other #";

  const handleAdd = () => {
    const isValid =
      formData.stop !== "" &&
      formData.reference_number &&
      (!showReferenceDescription || formData.reference_description);

    if (isValid) {
      onAddReference({
        index: parseInt(formData.stop) || formData.stop, // Store index + 1 as number
        reference_type: formData.reference_type,
        reference_number: formData.reference_number,
        reference_description: formData.reference_description || "",
      });
      setFormData({
        stop: "",
        reference_type: "PU #",
        reference_number: "",
        reference_description: "",
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      stop: "",
      reference_type: "PU #",
      reference_number: "",
      reference_description: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="12px">
        <ModalHeader fontSize="18px" fontWeight="600" color="#181D27" pb="16px">
          Add Reference Number
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="24px">
          <VStack spacing="20px" align="stretch">
            <Box>
              <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
                Stop <span style={{color: "#FF6B35"}}>*</span>
              </Text>
              <Select
                options={stopOptions}
                placeholder="Select Stop"
                border="1px solid #D5D7DA"
                borderRadius="8px"
                value={formData.stop}
                onChange={(value) =>
                  setFormData((prev) => ({...prev, stop: value}))
                }
              />
            </Box>

            <Box>
              <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
                Reference Type <span style={{color: "#FF6B35"}}>*</span>
              </Text>
              <Select
                options={referenceTypeOptions}
                placeholder="PU #"
                border="1px solid #D5D7DA"
                borderRadius="8px"
                value={formData.reference_type}
                onChange={(value) =>
                  setFormData((prev) => ({...prev, reference_type: value}))
                }
              />
            </Box>

            <Box>
              <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
                Reference Number
              </Text>
              <Input
                placeholder="Enter Reference Number"
                border="1px solid #D5D7DA"
                borderRadius="8px"
                value={formData.reference_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    reference_number: e.target.value,
                  }))
                }
              />
            </Box>

            {showReferenceDescription && (
              <Box>
                <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
                  Reference Description{" "}
                  <span style={{color: "#FF6B35"}}>*</span>
                </Text>
                <Input
                  placeholder="Enter Reference Description"
                  border="1px solid #D5D7DA"
                  borderRadius="8px"
                  value={formData.reference_description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reference_description: e.target.value,
                    }))
                  }
                />
              </Box>
            )}
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
              onClick={handleClose}>
              Close
            </Button>
            <Button
              bg="#FF6B35"
              color="white"
              _hover={{bg: "#E55A2B"}}
              onClick={handleAdd}>
              Add
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddReferenceModal;
