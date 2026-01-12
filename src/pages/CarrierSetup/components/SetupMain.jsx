import React from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import {useWatch} from "react-hook-form";
import StepRenderer from "./StepRenderer";
import styles from "../CarrierSetup.module.scss";

const SetupMain = ({
  currentStep,
  control,
  watch,
  setValue,
  identitySubView = 1,
  insuranceSubView = 1,
  paymentSubView = 1,
  contractSubView = 1,
  isInsuranceLoading = false,
  isConfirmModalOpen = false,
  isConnecting = false,
  isEditable = false,
  canSkipSetup = false,
  isCarrierSetup = false,
  showSuccess = false,
  onNext = () => {},
  onBack = () => {},
  onSkipSetup = () => {},
  onConfirmAddCarrier = () => {},
  onCancelAddCarrier = () => {},
  onPaymentOtpSent = () => {},
  onPaymentOtpVerified = () => {},
  onPaymentOtpSkip = () => {},
}) => {
  const phoneVerified = useWatch({
    control,
    name: "payment.phone_verified",
    defaultValue: false,
  });

  const verificationId = useWatch({
    control,
    name: "payment.verify_verification_id",
    defaultValue: "",
  });

  const isPaymentOtpRequired =
    currentStep === 5 &&
    paymentSubView === 3 &&
    (!phoneVerified || !verificationId);
  return (
    <Box className={styles.mainContent} position={"relative"}>
      <Flex
        width="100%"
        bg="#FAFAFA"
        p="6px 24px"
        gap="16px"
        borderBottom={"1px solid #d6d7da"}>
        <Flex
          bg="#fff"
          border={"1px solid #d6d7da"}
          alignItems="center"
          justifyContent="center"
          w="52px"
          h="53px"
          borderRadius="12px">
          <img src="/img/registerUserIcon.svg" alt="" width="28px" h="28px" />
        </Flex>

        <Box>
          <Text color="#181D27" fontWeight="600" fontSize="16px">
            Carrier Setup
          </Text>
          <Text mt="4px" color="#535862" fontSize="13px" fontWeight="400">
            Complete your carrier profile
          </Text>
        </Box>
      </Flex>
      <Box className={styles.formContainer}>
        {showSuccess ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="400px"
            gap="24px">
            <Box
              w="80px"
              h="80px"
              borderRadius="50%"
              bg="#10B981"
              display="flex"
              alignItems="center"
              justifyContent="center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  fill="white"
                />
              </svg>
            </Box>
            <Text fontSize="24px" fontWeight="bold" color="#1e293b">
              Success!
            </Text>
            <Text
              fontSize="16px"
              color="#414651"
              textAlign="center"
              maxW="400px">
              All your information has been saved successfully. You will be
              redirected to the dashboard shortly.
            </Text>
          </Flex>
        ) : (
          <StepRenderer
            currentStep={currentStep}
            control={control}
            watch={watch}
            setValue={setValue}
            onNext={onNext}
            onBack={onBack}
            identitySubView={identitySubView}
            insuranceSubView={insuranceSubView}
            paymentSubView={paymentSubView}
            contractSubView={contractSubView}
            isEditable={isEditable}
            onPaymentOtpSent={onPaymentOtpSent}
            onPaymentOtpVerified={onPaymentOtpVerified}
            onPaymentOtpSkip={onPaymentOtpSkip}
          />
        )}

        {!showSuccess && (
          <Flex
            position={"absolute"}
            bottom={"0"}
            left={"0"}
            right={"0"}
            bg={"#fff"}
            p={"4px 12px"}
            borderTop={"1px solid #d6d7da"}
            justifyContent="space-between"
            alignItems="center">
            <Flex alignItems="center" gap="12px">
              <Flex
                alignItems="center"
                gap="8px"
                cursor="pointer"
                onClick={onBack}
                color="#535862">
                <img src="/img/backArrow.svg" alt="arrow-left" />
                <Text fontSize="14px" fontWeight="400">
                  Back
                </Text>
              </Flex>
            </Flex>

            <Text fontSize="14px" color="#6B7280">
              Is this information correct?
            </Text>

            <Flex gap="12px">
              {canSkipSetup && (
                <Button
                  variant="outline"
                  borderColor="#D1D5DB"
                  color="#374151"
                  fontSize="14px"
                  fontWeight="500"
                  px="20px"
                  py="6px"
                  borderRadius="8px"
                  _hover={{bg: "#F9FAFB"}}
                  onClick={onSkipSetup}>
                  Skip setup
                </Button>
              )}
              <Button
                bg="#EF6820"
                color="white"
                fontSize="14px"
                fontWeight="600"
                px="20px"
                py="6px"
                borderRadius="8px"
                _hover={{bg: "#DC5A1A"}}
                onClick={onNext}
                isLoading={isInsuranceLoading}
                loadingText="Loading..."
                isDisabled={isInsuranceLoading || isPaymentOtpRequired}
                opacity={isPaymentOtpRequired ? 0.5 : 1}>
                {isPaymentOtpRequired
                  ? "Verify OTP to continue"
                  : "Yes, continue"}
              </Button>
            </Flex>
          </Flex>
        )}
      </Box>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={onCancelAddCarrier}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isCarrierSetup ? "Confirm Save Changes" : "Confirm Add Carrier"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="16px" color="#414651">
              {isCarrierSetup
                ? "Are you sure you want to save these changes? This data cannot be changed further."
                : "Are you sure you want to add this carrier to your list?"}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              borderColor="#D1D5DB"
              color="#374151"
              fontSize="14px"
              fontWeight="500"
              px="20px"
              py="6px"
              borderRadius="8px"
              _hover={{bg: "#F9FAFB"}}
              onClick={onCancelAddCarrier}
              isDisabled={isConnecting}
              mr={3}>
              No, Cancel
            </Button>
            <Button
              bg="#EF6820"
              color="white"
              fontSize="14px"
              fontWeight="600"
              px="20px"
              py="6px"
              borderRadius="8px"
              _hover={{bg: "#DC5A1A"}}
              onClick={onConfirmAddCarrier}
              isLoading={isConnecting}
              loadingText={isCarrierSetup ? "Saving..." : "Connecting..."}>
              {isCarrierSetup ? "Yes, Save Changes" : "Yes, Add Carrier"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SetupMain;
