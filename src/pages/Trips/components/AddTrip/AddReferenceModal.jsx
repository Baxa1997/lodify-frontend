import React, {useState} from "react";
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
} from "@chakra-ui/react";
import HFSelect from "../../../../components/HFSelect";
import HFTextField from "../../../../components/HFTextField";

const AddReferenceModal = ({isOpen, onClose, control, onAddReference}) => {
  const [formData, setFormData] = useState({
    stop: "",
    referenceType: "PU #",
    referenceNumber: "",
  });

  const stopOptions = [
    {label: "Select Stop", value: ""},
    {label: "Stop 1", value: "stop1"},
    {label: "Stop 2", value: "stop2"},
    {label: "Stop 3", value: "stop3"},
  ];

  const referenceTypeOptions = [
    {label: "PU #", value: "PU #"},
    {label: "PO #", value: "PO #"},
    {label: "Other #", value: "Other #"},
  ];

  const handleAdd = () => {
    if (formData.stop && formData.referenceNumber) {
      onAddReference(formData);
      setFormData({
        stop: "",
        referenceType: "PU #",
        referenceNumber: "",
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      stop: "",
      referenceType: "PU #",
      referenceNumber: "",
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
              <HFSelect
                control={control}
                name="modal_stop"
                options={stopOptions}
                placeholder="Select Stop"
                border="1px solid #D5D7DA"
                borderRadius="8px"
                onChange={(value) =>
                  setFormData((prev) => ({...prev, stop: value}))
                }
              />
            </Box>

            <Box>
              <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
                Reference Type <span style={{color: "#FF6B35"}}>*</span>
              </Text>
              <HFSelect
                control={control}
                name="modal_reference_type"
                options={referenceTypeOptions}
                placeholder="PU #"
                border="1px solid #D5D7DA"
                borderRadius="8px"
                onChange={(value) =>
                  setFormData((prev) => ({...prev, referenceType: value}))
                }
              />
            </Box>

            <Box>
              <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
                Reference Number
              </Text>
              <HFTextField
                control={control}
                name="modal_reference_number"
                placeholder="Enter Reference Number"
                border="1px solid #D5D7DA"
                borderRadius="8px"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    referenceNumber: e.target.value,
                  }))
                }
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
              onClick={handleClose}>
              Close
            </Button>
            <Button
              bg="#FF6B35"
              color="white"
              _hover={{bg: "#E55A2B"}}
              onClick={handleAdd}
              isDisabled={!formData.stop || !formData.referenceNumber}>
              Add
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddReferenceModal;
