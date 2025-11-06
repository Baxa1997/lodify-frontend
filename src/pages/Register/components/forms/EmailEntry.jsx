import React, { useState } from "react";
import { Box, Text, VStack, Button, Flex } from "@chakra-ui/react";

const EmailVerification = ({
  email,
  onNext,
  onBack,
  currentSubStep,
  setCurrentSubStep,
  setValue,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmailCode = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // After sending email code, move to email OTP verification
      setCurrentSubStep("email-verify");
    } catch (error) {
      console.error("Failed to send email code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      borderRadius="12px"
      bg="white">
      <VStack
        maxW="360px"
        align="start"
        spacing={2}>
        <Text
          fontSize="18px"
          fontWeight="600"
          color="#111827">
          Verify your Email address
        </Text>
        <Text
          fontSize="16px"
          color="#6B7280">
          A one-time passcode (OTP) will be sent to your FMCSA email
        </Text>

        <Box w="100%">
          <Text
            fontSize="14px"
            fontWeight="500"
            color="#414651"
            mb={2}>
            Email address <span style={{ color: "#EF6820" }}>*</span>
          </Text>
          <Text
            fontSize="16px"
            color="#1e293b"
            p={3}
            border="1px solid #e2e8f0"
            borderRadius="8px"
            bg="#f8fafc">
            {email}
          </Text>
        </Box>

        <Button
          w="100%"
          h="44px"
          bg="#EF6820"
          color="white"
          _hover={{ bg: "#EF6820" }}
          borderRadius="8px"
          onClick={handleSendEmailCode}
          isLoading={isLoading}
          loadingText="Sending...">
          Send Code
        </Button>

        <Flex
          align="center"
          gap="8px"
          justify="center"
          w="100%"
          mt={4}>
          <img
            src="/img/backArrow.svg"
            alt="arrow-left" />
          <Text
            fontSize="16px"
            color="#6B7280"
            cursor="pointer"
            onClick={() => setCurrentSubStep("phone-verify")}>
            Back to Phone Verification
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default EmailVerification;
