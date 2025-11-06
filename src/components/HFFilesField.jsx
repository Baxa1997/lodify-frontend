import React, {useRef, useState} from "react";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Text,
  Badge,
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

  const safeValue = Array.isArray(value) ? value : [];

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
    onChange(safeValue.filter((f) => f !== fileUrl));
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
                      onClick={() => setIsModalOpen(true)}>
                      <Text fontSize="13px" isTruncated maxW="150px">
                        {getShortFileName(fileUrl, 7).shortName}
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
                        onClick={() => setIsModalOpen(true)}>
                        <Text fontSize="13px" isTruncated maxW="150px">
                          {getShortFileName(fileUrl, 7).shortName}
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
                      onClick={() => setIsModalOpen(true)}>
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
        size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Uploaded Files</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={1}>
              {safeValue?.map((fileUrl, idx) => (
                <HStack
                  key={idx}
                  px="3"
                  py="2"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  justify="space-between">
                  <Text fontSize="14px" w="300px">
                    {getShortFileName(fileUrl, 30).shortName}
                  </Text>
                  <IconButton
                    bg="none"
                    _hover={{bg: "none"}}
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
                    onClick={() => removeFile(fileUrl)}
                  />
                </HStack>
              ))}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <FormControl isInvalid={!!error}>
          <FileInput
            label={label}
            name={name}
            value={Array.isArray(value) ? value : []}
            onChange={onChange}
            required={required}
            disabled={disabled}
            setUploadLoading={setUploadLoading}
          />
          <FormErrorMessage>{error?.message}</FormErrorMessage>
        </FormControl>
      )}
    />
  );
}
