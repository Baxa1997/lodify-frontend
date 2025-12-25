import React, {useRef} from "react";
import {Box, Text, Flex, Button} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import HFTextField from "@components/HFTextField";
import HFPhoneInput from "@components/HFPhoneInput";

const CertificationsStep = ({control}) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    // certificate
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
          <Text fontSize="14px" color="#414651" mb="12px">
            Upload your Certificate of Liability Insurance
          </Text>
        </Box>
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            style={{display: "none"}}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <Button
            className={styles.uploadButton}
            onClick={handleUploadClick}
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
        </Box>
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
        <Button
          className={styles.addAgentButton}
          bg="#EF6820"
          color="white"
          _hover={{bg: "#d95a1a"}}
          fontWeight="500">
          Add Agent
        </Button>
      </Box>
    </Box>
  );
};

export default CertificationsStep;
