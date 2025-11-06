import React, { useRef, useState } from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import fileService from "@services/fileService";
import { getShortFileName } from "@utils/getFileName";

function FileUpload({ label, value = "", onChange, required, disabled, disableRequest, onChangeProps, loadingProps }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    if(!disableRequest) {
      setLoading(true);
      fileService
        .upload(data, { folder_name: "trips" })
        .then((res) => {
          onChange(`${"https://cdn.u-code.io"}/${res?.filename}`);
        })
        .finally(() => setLoading(false));
    } else {
      if(onChangeProps) {
        onChangeProps(data);
      } else {
        onChange(data);
      }
    }
  };

  const removeFile = (fileUrl) => {
    onChange("");
    if(onChangeProps) {
      onChangeProps("");
    }
  };

  return (
    <FormControl>
      {label && (
        <FormLabel
          fontWeight="500"
          fontSize="14px"
          color="gray.700">
          {label}{" "}
          {required && (
            <Box
              as="span"
              color="blue.500">
              *
            </Box>
          )}
        </FormLabel>
      )}

      <Box
        h="40px"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="md"
        position="relative"
        px="3"
        py="2"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bg={disabled ? "gray.50" : "white"}
        cursor={disabled ? "not-allowed" : "pointer"}>
        {(!value || value === "") && (
          <HStack
            justify="space-between"
            w="100%">
            <Text
              fontSize="14px"
              color="gray.500">
              Upload Files
            </Text>
            <IconButton
              position="static"
              bg="none"
              _hover={{ bg: "none" }}
              aria-label="upload"
              size="sm"
              icon={<img
                src="/img/upload.svg"
                alt="upload" />}
              onClick={() => inputRef.current.click()}
              isDisabled={disabled || loading || loadingProps}
              sx={{
                "::after": {
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  left: "0",
                  content: "\"\"",
                },
              }}
            />
          </HStack>
        )}

        {value && value !== "" && (
          <HStack
            justify="space-between"
            w="100%">
            <HStack
              spacing="2"
              w="100%">
              <Text
                fontSize="13px"
                w="100%">
                {getShortFileName(value, 30).shortName}
              </Text>

              <IconButton
                size="xs"
                border="1px solid"
                borderColor="gray.200"
                bg="none"
                _hover={{ bg: "none" }}
                aria-label="remove"
                icon={
                  <img
                    src="/img/cancelIcon.svg"
                    width={"12px"}
                    height={"12px"}
                    alt="close"
                  />
                }
                onClick={() => removeFile(value)}
              />
            </HStack>

            <IconButton
              bg="none"
              _hover={{ bg: "none" }}
              aria-label="upload"
              size="sm"
              icon={<img
                src="/img/upload.svg"
                alt="upload" />}
              onClick={() => inputRef.current.click()}
              isDisabled={disabled || loading || loadingProps}
            />
          </HStack>
        )}

        <Input
          ref={inputRef}
          type="file"
          display="none"
          onChange={handleFileChange}
          isDisabled={disabled}
        />
      </Box>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Uploaded Files</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              align="stretch"
              spacing={1}>
              <HStack
                key={value}
                px="3"
                py="2"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                justify="space-between">
                <Text
                  fontSize="14px"
                  w="300px">
                  {getShortFileName(value, 30).shortName}
                </Text>
                <IconButton
                  bg="none"
                  _hover={{ bg: "none" }}
                  size="sm"
                  colorScheme="red"
                  aria-label="remove"
                  icon={
                    <img
                      src="/img/cancelIcon.svg"
                      width={"12px"}
                      height={"12px"}
                      alt="close"
                    />
                  }
                  onClick={() => removeFile(value)}
                />
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </FormControl>
  );
}

export default function HFFileUpload({
  control,
  name,
  label,
  rules,
  required,
  disabled,
  disableRequest,
  onChange: onChangeProps,
  loading: loadingProps,
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={""}
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl isInvalid={!!error}>
          <FileUpload
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            disableRequest={disableRequest}
            onChangeProps={onChangeProps}
            loadingProps={loadingProps}
          />
          <FormErrorMessage>{error?.message}</FormErrorMessage>
        </FormControl>
      )}
    />
  );
}
