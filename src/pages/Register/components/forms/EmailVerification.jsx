import React, { useState } from "react";
import { Box, Text, VStack, Button, Flex, useToast } from "@chakra-ui/react";
import authService from "../../../../services/auth/authService";

const EmailVerification = ({
  email,
  onNext,
  onBack,
  currentSubStep,
  setCurrentSubStep,
  setValue,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [smsId, setSmsId] = useState(null);
  const toast = useToast();

  const handleSendEmailCode = async () => {
    setIsLoading(true);
    try {
      const response = await authService.sendCode(
        {
          type: "MAILCHIMP",
          recipient: email,
          sms_template_id: "4b73c53e-df0b-4f24-8d24-e7f03d858cda",
          field_slug: "text",
          variables: {},
        },
        {
          project_id: "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1",
        },
      );

      if (response?.data?.sms_id) {
        setSmsId(response.data.sms_id);
        setValue("emailSmsId", response.data.sms_id);

        toast({
          title: "Code Sent Successfully!",
          description: "Verification code has been sent to your email.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        // After sending email code, move to email OTP verification
        setCurrentSubStep("email-verify");
      }
    } catch (error) {
      console.error("Failed to send email code:", error);
      toast({
        title: "Failed to Send Code",
        description:
          error?.response?.data?.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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
            onClick={() => setCurrentSubStep("phone")}>
            Back to Phone Verification
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default EmailVerification;
