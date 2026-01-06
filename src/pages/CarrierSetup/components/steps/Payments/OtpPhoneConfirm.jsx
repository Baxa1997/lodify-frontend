import React, {useState, useEffect, useRef, useMemo} from "react";
import {Box, Text, Flex, useToast} from "@chakra-ui/react";
import {Controller} from "react-hook-form";
import OtpInput from "react-otp-input";
import authService from "../../../../../services/auth/authService";
import {RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
import {auth} from "../../../../../config/firebase";

const OtpPhoneConfirm = ({control, watch, setValue, onVerifySuccess}) => {
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const toast = useToast();
  const recaptchaRef = useRef(null);

  const isLocal = useMemo(() => {
    if (typeof window === "undefined") return false;
    const h = window.location.hostname;
    return h === "localhost" || h === "127.0.0.1";
  }, []);

  useEffect(() => {
    if (!recaptchaRef.current) {
      const verifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container-otp-payment",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved ✅");
          },
          "expired-callback": () => {
            toast({
              title: "reCAPTCHA expired",
              description: "Please try again.",
              status: "warning",
              duration: 3000,
              isClosable: true,
            });
          },
        }
      );

      recaptchaRef.current = verifier;
      verifier
        .render()
        .then((widgetId) => {
          window.recaptchaWidgetIdOtpPayment = widgetId;
        })
        .catch((e) => console.error("reCAPTCHA render error:", e));
    }

    return () => {
      try {
        recaptchaRef.current && recaptchaRef.current.clear();
      } catch (_) {}
      recaptchaRef.current = null;
    };
  }, [isLocal, toast]);

  const handleOtpChange = (value) => {
    setOtpCode(value);
  };

  useEffect(() => {
    if (otpCode.length === 6) {
      handleVerifyOtp();
    }
  }, [otpCode]);

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) return;

    setIsVerifying(true);
    try {
      const verificationId = watch("payment.verify_verification_id");

      if (!verificationId) {
        throw new Error(
          "No verification session found. Please go back and resend the code."
        );
      }

      const response = await authService.verifyPhoneCode("verify_otp", {
        otp: otpCode,
        session_info: verificationId,
        provider: "firebase",
      });
      console.log({response});
      // Check HTTP status code for success (200-299 range)
      if (response?.status >= 200 && response?.status < 300) {
        setValue("payment.phone_verified", true);

        toast({
          title: "Phone Verified Successfully!",
          description: "Your phone number has been verified.",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        if (onVerifySuccess) {
          onVerifySuccess();
        }
      } else {
        throw new Error("Verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);

      let errorMessage = "Invalid verification code";
      if (error?.code === "auth/invalid-verification-code") {
        errorMessage = "Invalid verification code";
      } else if (error?.code === "auth/code-expired") {
        errorMessage = "Verification code expired. Please request a new one";
      } else if (error?.code === "auth/session-expired") {
        errorMessage = "Session expired. Please request a new code";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Verification Failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setOtpCode("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const phone =
        watch("payment.verify_phone") || watch("identity.telephone");

      if (!phone || phone.trim() === "") {
        throw new Error(
          "Missing phone information. Please go back and try again."
        );
      }

      if (!/^\+\d{10,15}$/.test(phone.trim())) {
        throw new Error("Invalid phone number format.");
      }

      const appVerifier = recaptchaRef.current;
      if (!appVerifier) {
        throw new Error("reCAPTCHA not ready yet. Please try again.");
      }

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phone.trim(),
        appVerifier
      );

      window.confirmationResultPayment = confirmationResult;
      const verificationId = confirmationResult?.verificationId;

      setValue("payment.verify_verification_id", verificationId);
      setValue("payment.verify_phone", phone.trim());

      toast({
        title: "Code Resent Successfully!",
        description: "New verification code has been sent to your phone.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      setOtpCode("");
    } catch (error) {
      console.error("Failed to resend code:", error);

      let errorMessage = "Please try again later.";
      if (error?.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format.";
      } else if (error?.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Failed to Resend Code",
        description: errorMessage,
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

      <Box display="flex" justifyContent="center" mb="24px" width="100%">
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
              numInputs={6}
              renderSeparator={<span style={{width: "8px"}} />}
              renderInput={(props) => (
                <input
                  {...props}
                  style={{
                    width: "56px",
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
                    opacity: isVerifying ? 0.6 : 1,
                    cursor: isVerifying ? "not-allowed" : "text",
                  }}
                  placeholder="0"
                  disabled={isVerifying}
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
              containerStyle={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                width: "100%",
              }}
            />
          )}
        />
      </Box>

      {isVerifying && (
        <Text fontSize="14px" color="#3b82f6" textAlign="center" mb="12px">
          Verifying code...
        </Text>
      )}

      <div
        id="recaptcha-container-otp-payment"
        style={{
          margin: "10px 0",
          display: "flex",
          justifyContent: "center",
          height: "30px",
          width: "100%",
        }}
      />

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
