import React, {useState, useEffect, useRef, useMemo} from "react";
import {Box, Text, Button, useToast} from "@chakra-ui/react";
import HFPhoneInput from "@components/HFPhoneInput";
import {RecaptchaVerifier, signInWithPhoneNumber} from "firebase/auth";
import {auth} from "../../../../../config/firebase";
import HFTextField from "@components/HFTextField";

const VerifyIdentity = ({control, watch, setValue, onSendOtp}) => {
  const [isLoading, setIsLoading] = useState(false);
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
        "recaptcha-container-payment",
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
          window.recaptchaWidgetIdPayment = widgetId;
          console.log("reCAPTCHA ready with ID:", widgetId);
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

  const handleSendOtp = async () => {
    const phone = watch("identity.telephone");

    if (!phone || phone.trim() === "") {
      toast({
        title: "Missing Phone Number",
        description: "Please enter your mobile phone number.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    if (!/^\+\d{10,15}$/.test(phone.trim())) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with country code.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    try {
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
        title: "SMS sent!",
        description: "Verification code sent successfully to your phone.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      if (onSendOtp) {
        onSendOtp();
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      let errorMessage = "Unable to send code. Please try again.";

      if (error?.code === "auth/invalid-phone-number") {
        errorMessage = "Invalid phone number format.";
      } else if (error?.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <Text fontSize="20px" fontWeight="bold" color="#1e293b">
        We need to verify your identity one more time before you can edit your
        payment details.
      </Text>

      <Text fontSize="16px" color="#414651" mb="30px" mt="8px">
        Enter your mobile number to receive a verification code.
      </Text>

      <Box display="flex" flexDirection="column" gap="10px">
        <Box>
          <HFPhoneInput
            label="Mobile phone"
            required
            control={control}
            name="identity.telephone"
            defaultCountry="us"
            forceCallingCode="1"
            preferredCountries={["us"]}
            placeholder="Enter Mobile"
          />
        </Box>

        <Box mt="10px">
          <HFTextField
            label="Email address"
            disabled={true}
            control={control}
            name="payment.verify_email_or_phone"
            placeholder="name@domain.com"
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

        <Text fontSize="14px" color="#414651" mb="16px">
          We&apos;ll send a verification code to your phone number.
        </Text>

        <div
          id="recaptcha-container-payment"
          style={{
            margin: "10px 0",
            display: "flex",
            justifyContent: "center",
            height: "30px",
            width: "100%",
          }}
        />

        <Button
          colorScheme="orange"
          size="lg"
          width="100%"
          onClick={handleSendOtp}
          isLoading={isLoading}
          loadingText="Sending code...">
          Send Verification Code
        </Button>
      </Box>
    </Box>
  );
};

export default VerifyIdentity;
