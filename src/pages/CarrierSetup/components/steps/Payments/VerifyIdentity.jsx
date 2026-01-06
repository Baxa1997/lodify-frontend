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

  const normalizePhoneNumber = (phone) => {
    if (!phone) return null;

    const digitsOnly = phone.replace(/\D/g, "");

    if (phone.trim().startsWith("+")) {
      const afterPlus = phone.replace(/[^\d]/g, "");
      if (afterPlus.startsWith("1") && afterPlus.length === 11) {
        return `+${afterPlus}`;
      }
      if (afterPlus.length === 10) {
        return `+1${afterPlus}`;
      }
      if (afterPlus.length >= 10 && afterPlus.length <= 15) {
        return `+${afterPlus}`;
      }
    }

    if (digitsOnly.length === 10) {
      return `+1${digitsOnly}`;
    }

    if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
      return `+${digitsOnly}`;
    }

    if (phone.trim().startsWith("+") && /^\+\d{10,15}$/.test(phone.trim())) {
      return phone.trim();
    }

    return null;
  };

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

    const normalizedPhone = normalizePhoneNumber(phone);

    if (!normalizedPhone || !/^\+\d{10,15}$/.test(normalizedPhone)) {
      toast({
        title: "Invalid Phone Number",
        description:
          "Please enter a valid phone number. We'll automatically format it with country code.",
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
        normalizedPhone,
        appVerifier
      );

      window.confirmationResultPayment = confirmationResult;
      const verificationId = confirmationResult?.verificationId;

      setValue("payment.verify_verification_id", verificationId);
      setValue("payment.verify_phone", normalizedPhone);

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
