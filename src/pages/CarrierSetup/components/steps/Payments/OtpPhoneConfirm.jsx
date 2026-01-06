import React, {useState, useEffect} from "react";
import {Box, Text, Flex, useToast} from "@chakra-ui/react";
import {Controller} from "react-hook-form";
import OtpInput from "react-otp-input";
import authService from "../../../../../services/auth/authService";

const OtpPhoneConfirm = ({control, watch, setValue, onVerifySuccess}) => {
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const toast = useToast();

  const handleOtpChange = (value) => {
    setOtpCode(value);
  };

  useEffect(() => {
    if (otpCode.length === 4) {
      handleVerifyOtp();
    }
  }, [otpCode]);

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 4) return;

    setIsVerifying(true);
    try {
      const smsId = watch("payment.verify_sms_id");
      if (!smsId) {
        throw new Error(
          "No verification session found. Please resend the code."
        );
      }

      const response = await authService.verifyCode(
        smsId,
        {
          provider: "sms",
          otp: otpCode,
        },
        {
          project_id: "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1",
        }
      );

      if (response?.data) {
        // Store verification status
        setValue("payment.phone_verified", true);

        toast({
          title: "Verification Successful!",
          description: "Your phone number has been verified.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        // Call success callback to navigate to next sub-view
        if (onVerifySuccess) {
          onVerifySuccess();
        }
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      toast({
        title: "Verification Failed",
        description:
          error?.response?.data?.message || "Invalid code. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      // Reset OTP input on error
      setOtpCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const phone = watch("payment.verify_mobile_phone");
      const emailOrPhone = watch("payment.verify_email_or_phone");

      if (!phone || !emailOrPhone) {
        throw new Error(
          "Missing phone information. Please go back and try again."
        );
      }

      const isEmail = emailOrPhone.includes("@");

      const response = await authService.sendCode(
        {
          type: isEmail ? "MAILCHIMP" : "SMS",
          recipient: isEmail ? emailOrPhone : phone,
          sms_template_id: "4b73c53e-df0b-4f24-8d24-e7f03d858cda",
          field_slug: "text",
          variables: {},
        },
        {
          project_id: "7380859b-8dac-4fe3-b7aa-1fdfcdb4f5c1",
        }
      );

      if (response?.data?.sms_id) {
        setValue("payment.verify_sms_id", response.data.sms_id);

        toast({
          title: "Code Resent Successfully!",
          description: "New verification code has been sent.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        // Reset OTP input
        setOtpCode("");
      }
    } catch (error) {
      console.error("Failed to resend code:", error);
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

  return (
    <Box>
      <Text fontSize="18px" fontWeight="bold" color="#1e293b" mb="8px">
        Please enter the code we just sent to your mobile phone number
      </Text>
      <Text fontSize="14px" color="#414651" mb="30px" mt="8px">
        Enter the code we just sent to the mobile number you entered.
      </Text>

      <Box display="flex" justifyContent="center" mb="24px">
        <Controller
          control={control}
          name="payment.otp_code"
          render={({field}) => (
            <OtpInput
              value={otpCode}
              onChange={(value) => {
                handleOtpChange(value);
                field.onChange(value);
              }}
              numInputs={4}
              renderSeparator={<span style={{width: "12px"}} />}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{
                    width: "80px",
                    height: "80px",
                    fontSize: "24px",
                    fontWeight: "600",
                    textAlign: "center",
                    border: "1px solid #D5D7DA",
                    borderRadius: "8px",
                    background: "white",
                    color: "#1e293b",
                    outline: "none",
                    transition: "all 0.2s ease",
                    opacity: isVerifying ? 0.6 : 1,
                    cursor: isVerifying ? "not-allowed" : "text",
                  }}
                  placeholder="0"
                  disabled={isVerifying}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(59, 130, 246, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D5D7DA";
                    e.target.style.boxShadow = "none";
                  }}
                  onMouseEnter={(e) => {
                    if (document.activeElement !== e.target) {
                      e.target.style.borderColor = "#94a3b8";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (document.activeElement !== e.target) {
                      e.target.style.borderColor = "#D5D7DA";
                    }
                  }}
                />
              )}
            />
          )}
        />
      </Box>

      {isVerifying && (
        <Text fontSize="14px" color="#3b82f6" textAlign="center" mb="12px">
          Verifying code...
        </Text>
      )}

      <Flex justifyContent="center" alignItems="center" gap="4px">
        <Text fontSize="14px" color="#414651">
          Code didn&apos;t send?
        </Text>
        <Text
          fontSize="14px"
          color="#FF5B04"
          cursor={isResending ? "not-allowed" : "pointer"}
          fontWeight="500"
          onClick={isResending ? undefined : handleResend}
          opacity={isResending ? 0.6 : 1}
          _hover={{textDecoration: isResending ? "none" : "underline"}}>
          {isResending ? "Sending..." : "Click to resend"}
        </Text>
      </Flex>
    </Box>
  );
};

export default OtpPhoneConfirm;
