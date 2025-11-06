import React, {useState, useEffect} from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Button,
  Link,
  Input,
  HStack,
  useToast,
} from "@chakra-ui/react";
import OtpInput from "react-otp-input";
import HFTextField from "../../../../components/HFTextField";
import styles from "../../MultiStepRegister.module.scss";
import authService from "../../../../services/auth/authService";
import PhoneSendCode from "./PhoneSendCode";

const AddressDetails = ({control, errors, watch, onNext, setValue}) => {
  const [currentSubStep, setCurrentSubStep] = useState("form");
  const [phoneCode, setPhoneCode] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [emailSmsId, setEmailSmsId] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [sessionInfo, setSessionInfo] = useState(null);
  const toast = useToast();

  const formData = watch();

  const handlePhoneCodeChange = (value) => {
    console.log("phoneCodephoneCode", phoneCode);
    setPhoneCode(value);
  };

  const handleEmailCodeChange = (value) => {
    setEmailCode(value);
    setValue("emailCode", value);
  };

  const handleSendPhoneCode = () => {};

  const handleSendEmailCode = async () => {
    setIsLoading(true);
    try {
      const response = await authService.sendCode(
        {
          type: "MAILCHIMP",
          recipient: formData.email,
          sms_template_id: "4b73c53e-df0b-4f24-8d24-e7f03d858cda",
          field_slug: "text",
          variables: {},
        },
        {
          project_id: "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1",
        }
      );

      if (response?.sms_id) {
        setEmailSmsId(response.sms_id);
        setValue("emailSmsId", response.sms_id);
        setCurrentSubStep("email-verify");

        toast({
          title: "Code Sent Successfully!",
          description: "Verification code has been sent to your email.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        setCurrentSubStep("email-verify");
      }
    } catch (error) {
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

  const handleVerifyPhone = async () => {
    if (phoneCode.length === 6) {
      setIsLoading(true);
      try {
        await authService.verifyPhoneCode("verify_otp", {
          otp: phoneCode,
          session_info: sessionInfo,
          provider: "firebase",
        });

        console.log("Phone verification successful");

        toast({
          title: "Phone Verified Successfully!",
          description:
            "Phone number has been verified. Proceeding to email verification.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setValue("phoneVerified", true);
        setValue("phoneVerificationId", "firebase-verified");

        setCurrentSubStep("email");
      } catch (error) {
        console.error("Failed to verify phone code:", error);
        let errorMessage = "Invalid verification code";

        if (error.code === "auth/invalid-verification-code") {
          errorMessage = "Invalid verification code";
        } else if (error.code === "auth/code-expired") {
          errorMessage = "Verification code expired. Please request a new one";
        } else if (error.code === "auth/session-expired") {
          errorMessage = "Session expired. Please request a new code";
        }

        toast({
          title: "Verification Failed",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleResendPhoneCode = async () => {
    setIsLoading(true);
    try {
      setPhoneCode("");
      setConfirmationResult(null);
      await handleSendPhoneCode();
    } catch (error) {
      console.error("Failed to resend phone code:", error);
      toast({
        title: "Failed to Resend Code",
        description: "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (emailCode.length === 4) {
      setIsLoading(true);
      try {
        const smsId = emailSmsId || formData.emailSmsId;
        if (!smsId) {
          throw new Error(
            "No verification session found. Please resend the code."
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
          }
        );

        if (response) {
          toast({
            title: "Email Verified Successfully!",
            description:
              "Your email has been verified. Proceeding to next step.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });

          onNext && onNext();
        }
      } catch (error) {
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

  const handleResendEmailCode = async () => {
    setIsResending(true);
    try {
      const response = await authService.sendCode(
        {
          type: "MAILCHIMP",
          recipient: formData.email,
          sms_template_id: "4b73c53e-df0b-4f24-8d24-e7f03d858cda",
          field_slug: "text",
          variables: {},
        },
        {
          project_id: "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1",
        }
      );

      if (response?.data?.sms_id) {
        setEmailSmsId(response?.data?.sms_id);
        setValue("emailSmsId", response?.data?.sms_id);
        setCurrentSubStep("email-verify");
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

  const handleConfirmAndContinue = () => {
    setCurrentSubStep("phone");
  };

  if (currentSubStep === "phone") {
    return (
      <PhoneSendCode
        control={control}
        formData={formData}
        setSessionInfo={setSessionInfo}
        handleSendPhoneCode={handleSendPhoneCode}
        setCurrentSubStep={setCurrentSubStep}
      />
    );
  }

  if (currentSubStep === "phone-verify") {
    return (
      <Box borderRadius="12px" bg="white">
        <Text
          fontSize="18px"
          w="360px"
          fontWeight="600"
          mb="8px"
          color="#111827">
          Verification
        </Text>
        <Text fontSize="16px" w="360px" color="#6B7280">
          Please input the code we just sent to your FMCSA linked phone number
        </Text>

        <Box display="flex" w="556px" mt="30px">
          <OtpInput
            value={phoneCode}
            onChange={handlePhoneCodeChange}
            numInputs={6}
            renderSeparator={<span style={{width: "0px"}} />}
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
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.1)";
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
          _hover={{bg: "#EF6820"}}
          borderRadius="8px"
          onClick={handleVerifyPhone}
          isLoading={isLoading}
          loadingText="Verifying..."
          isDisabled={phoneCode.length !== 6}>
          Verify phone number
        </Button>

        <VStack spacing={2} w="100%">
          <Text fontSize="16px" color="#6B7280" textAlign="center">
            Code didn't send?{" "}
            <Link color="#EF6820" onClick={handleResendPhoneCode}>
              Click to resend
            </Link>
          </Text>
          <Flex align="center" gap="8px" justify="center">
            <img src="/img/backArrow.svg" alt="arrow-left" />
            <Text
              fontSize="16px"
              color="#6B7280"
              cursor="pointer"
              onClick={() => setCurrentSubStep("form")}>
              Back to Verify Identity
            </Text>
          </Flex>
        </VStack>
      </Box>
    );
  }

  if (currentSubStep === "email") {
    return (
      <Box borderRadius="12px" bg="white">
        <VStack align="start" spacing={2}>
          <Text fontSize="18px" maxW="360px" fontWeight="600" color="#111827">
            Verify your Email address
          </Text>
          <Text fontSize="16px" maxW="360px" color="#6B7280">
            Please input the code we just sent to your FMCSA linked Email
          </Text>

          <Box w="100%" mt="16px" mb="10px">
            <Text fontSize="14px" fontWeight="500" color="#414651" mb={2}>
              Email address
            </Text>
            <HFTextField disabled name="email" control={control} />
          </Box>

          <Button
            w="100%"
            h="44px"
            bg="#EF6820"
            color="white"
            _hover={{bg: "#EF6820"}}
            borderRadius="8px"
            onClick={handleSendEmailCode}
            isLoading={isLoading}
            loadingText="Sending...">
            Send Code
          </Button>

          <Flex align="center" gap="8px" justify="center" w="100%" mt={4}>
            <img src="/img/backArrow.svg" alt="arrow-left" />
            <Text
              fontSize="16px"
              color="#6B7280"
              cursor="pointer"
              onClick={() => setCurrentSubStep("form")}>
              Back to Verify Identity
            </Text>
          </Flex>
        </VStack>
      </Box>
    );
  }

  if (currentSubStep === "email-verify") {
    return (
      <Box borderRadius="12px" bg="white">
        <Text
          fontSize="18px"
          w="360px"
          fontWeight="600"
          mb="8px"
          color="#111827">
          Verify your Email
        </Text>
        <Text w="360px" fontSize="16px" color="#6B7280">
          Please input the code we just sent to your FMCSA linked Email
        </Text>

        <Box display="flex" w="356px" my="20px">
          <OtpInput
            value={emailCode}
            onChange={handleEmailCodeChange}
            numInputs={4}
            renderSeparator={<span style={{width: "0px", gap: "4px"}} />}
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
                  e.target.style.boxShadow =
                    "0 0 0 3px rgba(59, 130, 246, 0.1)";
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
          mb="20px"
          w="100%"
          h="44px"
          bg="#EF6820"
          color="white"
          _hover={{bg: "#EF6820"}}
          borderRadius="8px"
          onClick={handleVerifyEmail}
          isLoading={isLoading}
          loadingText="Verifying..."
          isDisabled={emailCode.length !== 4}>
          Verify Email
        </Button>

        <VStack spacing={2} w="100%">
          <Text fontSize="16px" color="#6B7280" textAlign="center">
            Code didn't send?{" "}
            <Link
              color="#EF6820"
              onClick={handleResendEmailCode}
              cursor={isResending ? "not-allowed" : "pointer"}
              opacity={isResending ? 0.6 : 1}>
              {isResending ? "Resending..." : "Click to resend"}
            </Link>
          </Text>
          <Flex align="center" gap="8px" justify="center">
            <img src="/img/backArrow.svg" alt="arrow-left" />
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
  }

  return (
    <Box borderRadius="12px" bg="white">
      <VStack align="start" spacing={2} mb={6}>
        <Text fontSize="18px" fontWeight="600" color="#111827">
          Let’s start with the basics.
        </Text>
        <Text maxW="560px" fontSize="18px" color="#535862" fontWeight="400">
          Please review the information below and confirm that it matches your
          FMCSA records
        </Text>
      </VStack>

      <Flex className={styles.formRow}>
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="legal_name"
          label="Legal name"
          disabled
        />
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="dba_name"
          label="DBA Name"
          placeholder=""
          disabled
        />
      </Flex>

      <Flex mt={4} className={styles.formRow}>
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="us_dot"
          label="US DOT"
          placeholder="US DOT Number"
          disabled
        />
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="mc_number"
          label="MC"
          placeholder="MC number"
          disabled
        />
      </Flex>

      <Text my="20px" fontSize="16px" fontWeight="600" color="#1e293b">
        Physical Address
      </Text>

      <Flex className={styles.formRow}>
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="physical_address1"
          label="Address Line 1"
          placeholder="Address Line 1"
          disabled
        />
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="physical_address2"
          label="Address Line 2"
          placeholder="Address Line 2"
          disabled
        />
      </Flex>

      <Flex mt={4} className={styles.formRow}>
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="city"
          label="City"
          placeholder="City"
          disabled
        />
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="state"
          label="State"
          placeholder="State"
          disabled
        />
      </Flex>

      <Flex mt={4} className={styles.formRow}>
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="zip_code"
          label="ZIP"
          placeholder="Zip code"
          disabled
        />
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="country"
          label="Country"
          placeholder="Country"
          disabled
        />
      </Flex>

      <Text fontSize="16px" fontWeight="600" color="#1e293b" my="20px">
        Contact Information
      </Text>

      <Flex className={styles.formRow}>
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="email"
          label="Email address"
          placeholder="Email address"
          disabled
        />
        <HFTextField
          borderColor={"#d6d7da"}
          control={control}
          name="phone"
          label="Phone number"
          placeholder="Phone number"
          disabled
        />
      </Flex>

      <Button
        mt={6}
        h="44px"
        w="100%"
        bg="#EF6820"
        color="white"
        _hover={{bg: "#EF6820"}}
        borderRadius="8px"
        onClick={handleConfirmAndContinue}>
        Confirm & Continue
      </Button>

      <VStack mt={4} spacing={2}>
        <Text fontSize="16px" color="#000" fontWeight="600">
          If something doesn’t look right,{" "}
          <Link color="#EF6820" href="#">
            Contact us
          </Link>
        </Text>
        <Flex align="center" gap="8px">
          <img src="/img/backArrow.svg" alt="arrow-left" />
          <Text fontSize="16px" color="#6B7280" cursor="pointer">
            Back to Select Carrier
          </Text>
        </Flex>
      </VStack>
    </Box>
  );
};

export default AddressDetails;
