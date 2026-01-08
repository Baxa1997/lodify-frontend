import React, {useState, useMemo} from "react";
import {
  Box,
  Text,
  RadioGroup,
  Radio,
  Stack,
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
import styles from "../../CarrierSetup.module.scss";
import HFMultiSelect from "@components/HFMultiSelect";
import HFTextField from "@components/HFTextField";
import HFDatePicker from "@components/HFDatePicker";
import HFPhoneInput from "@components/HFPhoneInput";
import {Controller, useWatch, useController} from "react-hook-form";
import HFCustomFilesUpload from "@components/HFCustomFilesUpload";
import {getShortFileName} from "@utils/getFileName";
import FilesReader from "@components/FileViewer/FilesReader";

const InsuranceStep = ({control, subView = 1, isEditable = false}) => {
  const isFieldsDisabled = !isEditable;
  const compensationInsurance = useWatch({
    control,
    name: "insurance.compensation_insurance",
  });
  const {field} = useController({
    control,
    name: "insurance.compensation_insurance",
    defaultValue: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileReaderOpen, setIsFileReaderOpen] = useState(false);

  const hasFile = useMemo(() => {
    if (!compensationInsurance) return false;
    if (
      typeof compensationInsurance === "string" &&
      compensationInsurance.trim() !== ""
    ) {
      return true;
    }
    return false;
  }, [compensationInsurance]);

  const handleRemoveFile = () => {
    field.onChange("");
  };

  const handleFileClick = (fileUrl) => {
    setSelectedFile(fileUrl);
    setIsFileReaderOpen(true);
  };
  const commodityTypes = [
    {label: "Agriculture", value: "Agriculture"},
    {label: "Alcohol", value: "Alcohol"},
    {label: "Automotive", value: "Automotive"},
    {label: "Chemicals", value: "Chemicals"},
    {label: "Electronics", value: "Electronics"},
    {label: "Food", value: "Food"},
  ];

  if (subView === 2) {
    return (
      <Box className={styles.stepContentInsuranceWorkersComp}>
        <Text
          fontSize="24px"
          fontWeight="bold"
          color="#1e293b"
          mb="8px"
          maxWidth="300px">
          Worker&apos;s compensation
        </Text>
        <Text fontSize="14px" color="#414651" mb="20px">
          Confirm whether your company is required to carry Workers&apos;
          Compensation Insurance.
        </Text>

        <Controller
          control={control}
          name="insurance.worker_compensation"
          defaultValue="yes"
          render={({field}) => (
            <RadioGroup {...field} mb="24px" isDisabled={isFieldsDisabled}>
              <Stack direction="row" spacing="24px">
                <Radio value="yes" colorScheme="orange" isDisabled={isFieldsDisabled}>
                  <Text fontSize="14px" color="#414651">
                    Yes
                  </Text>
                </Radio>
                <Radio value="no" colorScheme="orange" isDisabled={isFieldsDisabled}>
                  <Text fontSize="14px" color="#414651">
                    No
                  </Text>
                </Radio>
              </Stack>
            </RadioGroup>
          )}
        />

        <Flex
          border="1px solid #D5D7DA"
          mb="24px"
          p="10px"
          justifyContent="space-between"
          borderRadius="10px">
          <Box>
            <Text
              fontSize="16px"
              fontWeight="600"
              color="#1e293b"
              maxWidth="200px">
              Worker&apos;s compensation insurance
            </Text>
            <Text fontSize="14px" color="#414651" mb="8px">
              Upload Document
            </Text>
            {hasFile && (
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
                File uploaded
              </Badge>
            )}
          </Box>
          <Flex>
            <HFCustomFilesUpload
              control={control}
              name="insurance.compensation_insurance"
              multiple={false}
              rules={{
                required: "Worker's compensation insurance is required",
              }}
              disabled={isFieldsDisabled}>
              <Button
                className={styles.uploadButton}
                disabled={isFieldsDisabled}
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
        </Flex>

        <Box display="flex" flexDirection="column" gap="16px">
          <HFTextField
            control={control}
            name="insurance.policy_number"
            label="Policy number"
            placeholder="Enter policy number"
            required
            isReadOnly={isFieldsDisabled}
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              Effective date
              <Box as="span" color="blue.500">
                *
              </Box>
            </Text>
            <Box
              sx={{
                "& input": {
                  border: "1px solid #D5D7DA",
                  borderRadius: "8px",
                  height: "40px",
                  fontSize: "14px",
                },
              }}>
              <HFDatePicker control={control} name="insurance.effective_date" isReadOnly={isFieldsDisabled} />
            </Box>
          </Box>

          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              Cancellation date
              <Box as="span" color="blue.500">
                *
              </Box>
            </Text>
            <Box
              sx={{
                "& input": {
                  border: "1px solid #D5D7DA",
                  borderRadius: "8px",
                  height: "40px",
                  fontSize: "14px",
                },
              }}>
              <HFDatePicker
                control={control}
                name="insurance.cancellation_date"
                isReadOnly={isFieldsDisabled}
              />
            </Box>
          </Box>

          <HFTextField
            control={control}
            name="insurance.issued_by"
            label="Issued by"
            placeholder="Enter issuer name"
            required
            isReadOnly={isFieldsDisabled}
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            control={control}
            name="insurance.full_name"
            label="Full name"
            placeholder="Enter full name"
            required
            isReadOnly={isFieldsDisabled}
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              Phone number
              <Box as="span" color="blue.500">
                *
              </Box>
            </Text>
            <HFPhoneInput control={control} name="insurance.phone_number" isReadOnly={isFieldsDisabled} />
          </Box>

          <HFTextField
            control={control}
            name="insurance.worker_email"
            label="Email"
            placeholder="Enter email address"
            type="email"
            required
            isReadOnly={isFieldsDisabled}
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />
        </Box>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="md"
          isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Uploaded Document</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {hasFile ? (
                <VStack align="stretch" spacing={2}>
                  <HStack
                    px="3"
                    py="3"
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    justify="space-between"
                    cursor="pointer"
                    _hover={{bg: "gray.50", borderColor: "gray.300"}}
                    transition="all 0.2s"
                    onClick={() => handleFileClick(compensationInsurance)}>
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
                          getShortFileName(compensationInsurance, 100)
                            .fullName || compensationInsurance
                        }>
                        {getShortFileName(compensationInsurance, 100)
                          .fullName ||
                          getShortFileName(compensationInsurance, 30)
                            .shortName ||
                          compensationInsurance ||
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
                        handleRemoveFile();
                        setIsModalOpen(false);
                      }}
                    />
                  </HStack>
                </VStack>
              ) : (
                <Text
                  fontSize="14px"
                  color="gray.500"
                  textAlign="center"
                  py="4">
                  No document uploaded
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
  }

  return (
    <Box className={styles.stepContentInsurance}>
      <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
        Cargo Insurance
      </Text>
      <Text fontSize="14px" color="#414651" mb="12px">
        Please confirm your policy exclusions below{" "}
      </Text>

      <Box>
        <Text fontSize="14px" fontWeight="600" color="#414651" mb="8px">
          Commodity type
        </Text>
        <HFMultiSelect
          options={commodityTypes}
          control={control}
          name="insurance.commodity_type"
          label="Commodity type"
          disabled={isFieldsDisabled}
        />
      </Box>
    </Box>
  );
};

export default InsuranceStep;
