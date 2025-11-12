import React, {useRef, useState, useMemo} from "react";
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
  Flex,
} from "@chakra-ui/react";
import {Controller} from "react-hook-form";
import fileService from "@services/fileService";
import {getShortFileName} from "@utils/getFileName";
import FilesReader from "./FileViewer/FilesReader";

function FileInput({
  label,
  value = [],
  onChange,
  name,
  required,
  disabled,
  setUploadLoading = () => {},
}) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileReaderOpen, setIsFileReaderOpen] = useState(false);

  const safeValue = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      const filtered = value.filter(
        (v) => v && typeof v === "string" && v.trim() !== ""
      );
      return filtered;
    }

    if (typeof value === "string" && value.trim() !== "") {
      return [value];
    }
    return [];
  }, [value]);

  const handleFileChange = (e) => {
    setLoading(true);
    setUploadLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    fileService
      .upload(data, {folder_name: "trips"})
      .then((res) => {
        onChange([...safeValue, `${"https://cdn.u-code.io"}/${res?.filename}`]);
      })
      .finally(() => {
        setLoading(false);
        setUploadLoading(false);
      });
  };

  const removeFile = (fileUrl) => {
    const updatedValue = safeValue.filter((f) => f !== fileUrl);
    onChange(updatedValue);
  };

  const handleFileClick = (fileUrl) => {
    setSelectedFile(fileUrl);
    setIsFileReaderOpen(true);
  };

  const handleOpenModal = () => {
    if (safeValue && safeValue.length > 0) {
      setIsModalOpen(true);
    }
  };

  return (
    <FormControl>
      {label && (
        <FormLabel fontWeight="500" fontSize="14px" color="gray.700">
          {label}{" "}
          {required && (
            <Box as="span" color="blue.500">
              *
            </Box>
          )}
        </FormLabel>
      )}

      <Flex width="100%" alignItems="center" gap="12px">
        <Box
          w={"100%"}
          h="40px"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="md"
          px="3"
          py="2"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg={disabled ? "gray.50" : "white"}
          cursor={disabled ? "not-allowed" : "pointer"}>
          {(!safeValue || safeValue.length === 0) && (
            <HStack justify="space-between" w="100%">
              <Text fontSize="14px" color="gray.500">
                Upload Files
              </Text>
            </HStack>
          )}

          {safeValue && safeValue.length > 0 && (
            <HStack justify="space-between" w="100%">
              <HStack spacing="2" w="320px" flexWrap="wrap">
                {safeValue.length <= 2 ? (
                  safeValue?.map((fileUrl, idx) => (
                    <Box
                      key={idx}
                      display="flex"
                      alignItems="center"
                      px="2"
                      py="0"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="8px"
                      fontSize="13px"
                      color="gray.700"
                      maxW="210px"
                      cursor="pointer"
                      _hover={{bg: "gray.50"}}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal();
                      }}>
                      <Text fontSize="13px" isTruncated maxW="150px">
                        {getShortFileName(fileUrl, 7).shortName ||
                          fileUrl ||
                          "Unknown file"}
                      </Text>
                      <IconButton
                        size="xs"
                        bg="none"
                        _hover={{bg: "none"}}
                        ml="1"
                        aria-label="remove"
                        icon={
                          <img
                            src="/img/cancelIcon.svg"
                            width={"10px"}
                            height={"10px"}
                            alt="close"
                          />
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(fileUrl);
                        }}
                      />
                    </Box>
                  ))
                ) : (
                  <>
                    {safeValue?.slice(0, 2).map((fileUrl, idx) => (
                      <Box
                        key={idx}
                        display="flex"
                        alignItems="center"
                        px="2"
                        py="0"
                        bg="white"
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="8px"
                        fontSize="13px"
                        color="gray.700"
                        maxW="200px"
                        cursor="pointer"
                        _hover={{bg: "gray.50"}}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal();
                        }}>
                        <Text fontSize="13px" isTruncated maxW="150px">
                          {getShortFileName(fileUrl, 10).shortName ||
                            fileUrl ||
                            "Unknown file"}
                        </Text>
                        <IconButton
                          size="xs"
                          bg="none"
                          _hover={{bg: "none"}}
                          ml="1"
                          aria-label="remove"
                          icon={
                            <img
                              src="/img/cancelIcon.svg"
                              width={"10px"}
                              height={"10px"}
                              alt="close"
                            />
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(fileUrl);
                          }}
                        />
                      </Box>
                    ))}
                    <Box
                      display="flex"
                      alignItems="center"
                      px="2"
                      py="2px"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="8px"
                      fontSize="13px"
                      color="gray.700"
                      cursor="pointer"
                      _hover={{bg: "gray.50"}}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsModalOpen(true);
                      }}>
                      +{safeValue?.length - 2}
                    </Box>
                  </>
                )}
              </HStack>
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
        <Button
          border="2px solid #ce6c38"
          width="44px"
          height="40px"
          borderRadius="8px"
          bg="#EF6820"
          _hover={{bg: "#EF6820"}}
          aria-label="upload"
          size="xs"
          onClick={() => inputRef.current.click()}
          isDisabled={disabled || loading}>
          <img
            src="/img/uploadWhite.svg"
            alt="upload"
            width="16px"
            height="15px"
          />
        </Button>
      </Flex>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Uploaded Documents</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {safeValue && safeValue.length > 0 ? (
              <VStack align="stretch" spacing={2}>
                {safeValue?.map((fileUrl, idx) => (
                  <HStack
                    key={idx}
                    px="3"
                    py="3"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    justify="space-between"
                    cursor="pointer"
                    _hover={{bg: "gray.50", borderColor: "gray.300"}}
                    transition="all 0.2s"
                    onClick={() => {
                      handleFileClick(fileUrl);
                    }}>
                    <Flex align="center" gap="2" flex="1" minW="0">
                      <Box
                        w="32px"
                        h="32px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bg="gray.100"
                        borderRadius="md"
                        flexShrink={0}>
                        <img
                          src="/img/filePhoto.svg"
                          alt="file"
                          width="20px"
                          height="20px"
                        />
                      </Box>
                      <Text
                        fontSize="14px"
                        fontWeight="500"
                        flex="1"
                        minW="0"
                        isTruncated
                        title={
                          getShortFileName(fileUrl, 100).fullName || fileUrl
                        }>
                        {getShortFileName(fileUrl, 100).fullName ||
                          getShortFileName(fileUrl, 30).shortName ||
                          fileUrl ||
                          "Unknown file"}
                      </Text>
                    </Flex>
                    <IconButton
                      bg="none"
                      _hover={{bg: "red.50"}}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(fileUrl);
                      }}
                    />
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text fontSize="14px" color="gray.500" textAlign="center" py="4">
                No documents uploaded
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <FilesReader
        isOpen={isFileReaderOpen}
        onClose={() => {
          setIsFileReaderOpen(false);
          setSelectedFile(null);
        }}
        file={selectedFile || ""}
      />
    </FormControl>
  );
}

export default function HFFilesField({
  control,
  name,
  label,
  rules,
  required,
  disabled,
  setUploadLoading = () => {},
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => {
        const normalizedValue = useMemo(() => {
          if (!value) return [];

          if (Array.isArray(value)) {
            const filtered = value.filter(
              (v) => v && typeof v === "string" && v.trim() !== ""
            );
            return filtered;
          }

          if (typeof value === "string") {
            const trimmed = value.trim();
            if (trimmed !== "") {
              return [trimmed];
            }
          }

          return [];
        }, [value]);

        return (
          <FormControl isInvalid={!!error}>
            <FileInput
              label={label}
              name={name}
              value={normalizedValue}
              onChange={onChange}
              required={required}
              disabled={disabled}
              setUploadLoading={setUploadLoading}
            />
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </FormControl>
        );
      }}
    />
  );
}
