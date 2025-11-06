import React, { useState } from "react";
import {
  Box,
  Text,
  VStack,
  Button,
  Link,
  Flex,
  useToast,
} from "@chakra-ui/react";
import OtpInput from "react-otp-input";
import authService from "../../../../services/auth/authService";

const EmailOTP = ({
  email,
  onNext,
  onBack,
  currentSubStep,
  setCurrentSubStep,
  watch,
  setValue,
}) => {
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const toast = useToast();

  const handleEmailCodeChange = (value) => {
    setEmailCode(value);
    setValue("emailCode", value);
  };

  const handleSendEmailCode = async () => {
    setIsResending(true);
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
        setValue("emailSmsId", response.data.sms_id);

        toast({
          title: "Code Resent Successfully!",
          description: "New verification code has been sent to your email.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Failed to resend email code:", error);
      toast({
        title: "Failed to Resend Code",
        description:
          error?.response?.data?.message || "Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (emailCode.length === 4) {
      setIsLoading(true);
      try {
        const smsId = watch("emailSmsId");
        if (!smsId) {
          throw new Error(
            "No verification session found. Please resend the code.",
          );
        }

        const response = await authService.verifyCode(
          smsId,
          {
            provider: "email",
            otp: emailCode,
          },
          {
            project_id: "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1",
          },
        );

        if (response?.data) {
          toast({
            title: "Email Verified Successfully!",
            description:
              "Your email has been verified. Proceeding to registration.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });

          // After email verification, proceed to next step
          onNext && onNext();
        }
      } catch (error) {
        console.error("Failed to verify email code:", error);
        toast({
          title: "Verification Failed",
          description:
            error?.response?.data?.message || "Invalid code. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Box
      borderRadius="12px"
      bg="white">
      <Text
        fontSize="18px"
        w="360px"
        fontWeight="600"
        mb="8px"
        color="#111827">
        Check your email
      </Text>
      <Text
        fontSize="16px"
        w="360px"
        color="#6B7280"
        mb="30px">
        We sent a verification code to {email}
      </Text>

      <Box
        display="flex"
        w="356px"
        mt="30px">
        <OtpInput
          value={emailCode}
          onChange={handleEmailCodeChange}
          numInputs={4}
          renderSeparator={<span style={{ width: "0px" }} />}
          renderInput={(props) => (
            <input
              {...props}
              style={{
                width: "80px",
                height: "80px",
                fontSize: "24px",
                fontWeight: "600",
                textAlign: "center",
                border: "2px solid #e2e8f0",
                borderRadius: "8px",
                background: "#f8fafc",
                color: "#1e293b",
                outline: "none",
                transition: "all 0.2s ease",
              }}
              placeholder="0"
              onFocus={(e) => {
                e.target.style.borderColor = "#3b82f6";
                e.target.style.background = "white";
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e2e8f0";
                e.target.style.background = "#f8fafc";
                e.target.style.boxShadow = "none";
              }}
              onMouseEnter={(e) => {
                if (document.activeElement !== e.target) {
                  e.target.style.borderColor = "#cbd5e1";
                }
              }}
              onMouseLeave={(e) => {
                if (document.activeElement !== e.target) {
                  e.target.style.borderColor = "#e2e8f0";
                }
              }}
            />
          )}
          inputStyle={{
            width: "70px",
            height: "70px",
            fontSize: "24px",
            fontWeight: "600",
            textAlign: "center",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            background: "#f8fafc",
            color: "#1e293b",
            outline: "none",
            transition: "all 0.2s ease",
          }}
          focusStyle={{
            borderColor: "#3b82f6",
            background: "white",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
          }}
          containerStyle={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
          }}
        />
      </Box>

      <Button
        my="20px"
        w="100%"
        h="44px"
        bg="#EF6820"
        color="white"
        _hover={{ bg: "#EF6820" }}
        borderRadius="8px"
        onClick={handleVerifyEmail}
        isLoading={isLoading}
        loadingText="Verifying..."
        isDisabled={emailCode.length !== 4}>
        Verify email
      </Button>

      <VStack
        spacing={2}
        w="100%">
        <Text
          fontSize="16px"
          color="#6B7280"
          textAlign="center">
          Code didn't send?{" "}
          <Link
            color="#EF6820"
            onClick={handleSendEmailCode}
            cursor={isResending ? "not-allowed" : "pointer"}
            opacity={isResending ? 0.6 : 1}>
            {isResending ? "Resending..." : "Click to resend"}
          </Link>
        </Text>
        <Flex
          align="center"
          gap="8px"
          justify="center">
          <img
            src="/img/backArrow.svg"
            alt="arrow-left" />
          <Text
            fontSize="16px"
            color="#6B7280"
            cursor="pointer"
            onClick={() => setCurrentSubStep("email")}>
            Back to Email Entry
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default EmailOTP;
