import React, {useEffect, useState} from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
  ModalBody,
  Button,
  Flex,
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import AutomatedFileUpload from "../AutomatedFileUpload";

function AutomatedAddTrip({isOpen, onClose}) {
  const navigate = useNavigate();
  const {control, watch} = useForm({
    defaultValues: {
      csv: "",
    },
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const uploadedFile = watch("csv");

  useEffect(() => {
    if (Boolean(uploadedFile)) {
      setIsNavigating(true);
      setTimeout(() => {
        setIsNavigating(false);
        navigate("/admin/trips/add-trip", {
          state: {
            csv: uploadedFile,
          },
        });
      }, 3000);
    }
  }, [uploadedFile]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Automated By Lodify AI</ModalHeader>

        <ModalBody>
          <AutomatedFileUpload
            setUploadLoading={setUploadLoading}
            name="csv"
            label="Upload"
            required
            control={control}
          />
          <Flex mt="16px" justifyContent="end" pb="10px">
            <Button
              isDisabled={isNavigating || !uploadLoading}
              isLoading={uploadLoading}
              bg="#EF6820"
              color="white"
              _hover={{bg: "#EF6820"}}>
              {isNavigating ? "Navigating..." : "Upload"}
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AutomatedAddTrip;
