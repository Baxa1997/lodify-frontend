import React, {useRef, useState, useMemo} from "react";
import {
  FormErrorMessage,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  IconButton,
  Text,
  Flex,
  Box,
} from "@chakra-ui/react";
import {Controller} from "react-hook-form";
import fileService from "@services/fileService";
import {getShortFileName} from "@utils/getFileName";
import FilesReader from "./FileViewer/FilesReader";

function FileUploadButton({
  value = [],
  onChange,
  name,
  required,
  disabled,
  children,
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
    if (!file) {
      setLoading(false);
      setUploadLoading(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);

    fileService
      .folderUpload(data, {folder_name: "media"})
      .then((res) => {
        onChange([...safeValue, `${"https://cdn.u-code.io"}/${res?.link}`]);
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

  const handleClick = () => {
    if (!disabled && !loading && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <>
      <Input
        ref={inputRef}
        type="file"
        display="none"
        onChange={handleFileChange}
        isDisabled={disabled || loading}
      />
      <Box
        onClick={handleClick}
        cursor={disabled || loading ? "not-allowed" : "pointer"}
        opacity={disabled || loading ? 0.6 : 1}
        display="inline-block">
        {children}
      </Box>

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
    </>
  );
}

export default function HFCustomFilesUpload({
  control,
  name,
  rules,
  required,
  disabled,
  children,
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
          <>
            {" "}
            <FileUploadButton
              name={name}
              value={normalizedValue}
              onChange={onChange}
              required={required}
              disabled={disabled}
              setUploadLoading={setUploadLoading}>
              {children}
            </FileUploadButton>
            <FormErrorMessage>{error?.message}</FormErrorMessage>
          </>
        );
      }}
    />
  );
}
