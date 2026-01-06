import React, {useState, useMemo} from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import {useWatch, useController} from "react-hook-form";
import styles from "../../CarrierSetup.module.scss";
import HFTextField from "@components/HFTextField";
import HFPhoneInput from "@components/HFPhoneInput";
import HFCustomFilesUpload from "@components/HFCustomFilesUpload";
import {getShortFileName} from "@utils/getFileName";
import FilesReader from "@components/FileViewer/FilesReader";

const CertificationsStep = ({control, isEditable = false}) => {
  const certificateFiles = useWatch({control, name: "insurance.certificate"});
  const {field} = useController({
    control,
    name: "insurance.certificate",
    defaultValue: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileReaderOpen, setIsFileReaderOpen] = useState(false);

  const safeFiles = useMemo(() => {
    if (!certificateFiles) return [];
    if (Array.isArray(certificateFiles)) {
      return certificateFiles.filter(
        (f) => f && typeof f === "string" && f.trim() !== ""
      );
    }
    if (
      typeof certificateFiles === "string" &&
      certificateFiles.trim() !== ""
    ) {
      return [certificateFiles];
    }
    return [];
  }, [certificateFiles]);

  const handleRemoveFile = (fileUrl) => {
    const updatedFiles = safeFiles.filter((f) => f !== fileUrl);
    field.onChange(updatedFiles);
  };

  const handleFileClick = (fileUrl) => {
    setSelectedFile(fileUrl);
    setIsFileReaderOpen(true);
  };
  return (
    <Box className={styles.stepContentIdentityCertifications}>
      <Box mb="20px">
        <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
          Insurance
        </Text>
        <Text fontSize="14px" color="#414651" mb="12px">
          Lodify will email your insurance agent to confirm coverage. Please
          ensure they add Lodify.io as a certificate holder.
        </Text>
        <Box className={styles.insuranceNoticeBox}>
          <Flex alignItems="flex-start" gap="12px">
            <img src="/img/importantSymbol.svg" alt="" />
            <Text fontSize="14px" color="#414651" lineHeight="1.5">
              Important we will send email to your insurance agent to confirm
              current policy status ask them to check the email (
              <Text as="span" textDecoration="underline" color="#3b82f6">
                cert@lodify.io
              </Text>
              ) and make Lodify.io certificate holder
            </Text>
          </Flex>
        </Box>
      </Box>

      <Flex
        border="1px solid #D5D7DA"
        borderRadius="8px"
        padding="10px"
        justifyContent="space-between"
        alignItems="center"
        mb="20px">
        <Box>
          <Text fontSize="18px" fontWeight="600" color="#1e293b" mb="4px">
            Certificate
          </Text>
          <Text fontSize="14px" color="#414651" mb="8px">
            Upload your Certificate of Liability Insurance
          </Text>
          {safeFiles.length > 0 && (
            <Badge
              cursor="pointer"
              bg="#EF6820"
              color="white"
              px="12px"
              py="4px"
              borderRadius="16px"
              fontSize="12px"
              fontWeight="500"
              _hover={{bg: "#d95a1a"}}
              onClick={() => setIsModalOpen(true)}
              display="inline-flex"
              alignItems="center"
              gap="6px">
              {safeFiles.length} file{safeFiles.length !== 1 ? "s" : ""}{" "}
              uploaded
            </Badge>
          )}
        </Box>
        <HFCustomFilesUpload
          control={control}
          name="insurance.certificate"
          rules={{
            required: "Certificate is required",
          }}>
          <Button
            className={styles.uploadButton}
            leftIcon={
              <img
                src="/img/upload.svg"
                alt="upload"
                width="16px"
                height="16px"
              />
            }>
            Upload
          </Button>
        </HFCustomFilesUpload>
      </Flex>

      <Box>
        <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="10px">
          Enter your agent&apos;s contact details. An email will be sent from
          cert@lodify.io
        </Text>
        <Box
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap="12px"
          mb="18px">
          <HFTextField
            label="First Name"
            control={control}
            name="insurance.first_name"
            placeholder="First Name"
            style={{
              border: "1px solid #D5D7DA",
              bg: "#F8F9FA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />
          <HFTextField
            label="Last Name"
            control={control}
            name="insurance.last_name"
            placeholder="Last Name"
            style={{
              border: "1px solid #D5D7DA",
              bg: "#F8F9FA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />
          <HFTextField
            label="Email"
            control={control}
            name="insurance.email"
            placeholder="Email"
            type="email"
            style={{
              border: "1px solid #D5D7DA",
              bg: "#F8F9FA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />
          <Box>
            <Text fontSize="14px" fontWeight="500" color="#414651" mb="6px">
              Phone Number
            </Text>
            <Box className={styles.phoneInputWrapper}>
              <HFPhoneInput control={control} name="insurance.phone" />
            </Box>
          </Box>
        </Box>
        {/* <Button
          className={styles.addAgentButton}
          bg="#EF6820"
          color="white"
          _hover={{bg: "#d95a1a"}}
          fontWeight="500">
          Add Agent
        </Button> */}
      </Box>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Uploaded Certificates</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {safeFiles.length > 0 ? (
              <VStack align="stretch" spacing={2}>
                {safeFiles.map((fileUrl, idx) => (
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
                    onClick={() => handleFileClick(fileUrl)}>
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
                        handleRemoveFile(fileUrl);
                      }}
                    />
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text fontSize="14px" color="gray.500" textAlign="center" py="4">
                No certificates uploaded
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
    </Box>
  );
};

export default CertificationsStep;
