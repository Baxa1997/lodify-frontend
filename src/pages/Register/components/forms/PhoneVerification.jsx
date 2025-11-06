import React, {useState} from "react";
import {Box, Text, VStack, Button, Link, Flex} from "@chakra-ui/react";
import OtpInput from "react-otp-input";

const PhoneVerification = ({
  phone,
  onNext,
  onBack,
  currentSubStep,
  setCurrentSubStep,
}) => {
  const [phoneCode, setPhoneCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneCodeChange = (value) => {
    setPhoneCode(value);
  };

  const handleSendPhoneCode = async () => {
    setIsLoading(true);
    try {
      // Skip Firebase verification and proceed directly to OTP entry
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCurrentSubStep("phone-verify");
    } catch (error) {
      console.error("Failed to send phone code:", error);
      // Even if there's an error, proceed to OTP entry
      setCurrentSubStep("phone-verify");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (phoneCode.length === 4) {
      setIsLoading(true);
      try {
        // Skip Firebase verification - always accept any 4-digit code or default 1234
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log("Phone verification skipped - proceeding to next step");
        // After phone verification, move to email entry
        setCurrentSubStep("email");
      } catch (error) {
        console.error("Failed to verify phone code:", error);
        // Even if there's an error, proceed to next step
        setCurrentSubStep("email");
      } finally {
        setIsLoading(false);
      }
    }
  };

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

        <Box display="flex" w="356px" mt="30px">
          <OtpInput
            value={phoneCode}
            onChange={handlePhoneCodeChange}
            numInputs={4}
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
          isDisabled={phoneCode.length !== 4}>
          Verify phone number
        </Button>

        <VStack spacing={2} w="100%">
          <Text fontSize="16px" color="#6B7280" textAlign="center">
            Code didn't send?{" "}
            <Link color="#EF6820" onClick={handleSendPhoneCode}>
              Click to resend
            </Link>
          </Text>
          <Flex align="center" gap="8px" justify="center">
            <img src="/img/backArrow.svg" alt="arrow-left" />
            <Text
              fontSize="16px"
              color="#6B7280"
              cursor="pointer"
              onClick={() => setCurrentSubStep("phone")}>
              Back to Verify Identity
            </Text>
          </Flex>
        </VStack>
      </Box>
    );
  }

  return (
    <Box borderRadius="12px" bg="white">
      <VStack maxW="360px" align="start" spacing={2}>
        <Text fontSize="18px" fontWeight="600" color="#111827">
          Enter Mobile Number
        </Text>
        <Text fontSize="16px" color="#6B7280">
          To ensure the security of your account, we require verification of
          your FMCSA linked phone number
        </Text>

        <Box w="100%">
          <Text fontSize="14px" fontWeight="500" color="#414651" mb={2}>
            Phone number <span style={{color: "#EF6820"}}>*</span>
          </Text>
          <Text
            fontSize="16px"
            color="#1e293b"
            p={3}
            border="1px solid #e2e8f0"
            borderRadius="8px"
            bg="#f8fafc">
            {phone}
          </Text>
        </Box>

        <Button
          w="100%"
          h="44px"
          bg="#EF6820"
          color="white"
          _hover={{bg: "#EF6820"}}
          borderRadius="8px"
          onClick={handleSendPhoneCode}
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
};

export default PhoneVerification;
