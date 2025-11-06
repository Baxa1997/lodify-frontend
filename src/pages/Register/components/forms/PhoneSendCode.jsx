import React, {useEffect, useRef, useMemo, useCallback, useState} from "react";
import {Box, VStack, Text, Button, Flex, useToast} from "@chakra-ui/react";
import HFPhoneInput from "@components/HFPhoneInput";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  connectAuthEmulator,
} from "firebase/auth";
import {auth} from "../../../../config/firebase";

function PhoneSendCode({
  control,
  setCurrentSubStep = () => {},
  setSessionInfo = () => {},
  formData = {},
}) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const recaptchaRef = useRef(null);

  const isLocal = useMemo(() => {
    if (typeof window === "undefined") return false;
    const h = window.location.hostname;
    return h === "localhost" || h === "127.0.0.1";
  }, []);

  useEffect(() => {
    if (!recaptchaRef.current) {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
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
      });

      recaptchaRef.current = verifier;
      console.log("recaptchaRef.current", recaptchaRef.current, auth);
      verifier
        .render()
        .then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
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

  function getRandomPhone() {
    const phoneNumbers = ["+16289002850"];

    const randomIndex = Math.floor(Math.random() * phoneNumbers.length);
    return phoneNumbers[randomIndex];
  }

  const getPhone = useCallback(() => {
    const raw = formData?.phone;

    return String(raw || "").trim();
  }, [formData]);

  const handleSendPhoneCode = useCallback(
    async (event) => {
      event.preventDefault();

      const phone = getPhone();
      if (!phone || !/^\+\d{10,15}$/.test(phone)) {
        toast({
          title: "Invalid phone",
          description: "Please enter a number with + and country code.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        setIsLoading(true);

        const appVerifier = recaptchaRef.current;
        if (!appVerifier)
          throw new Error("reCAPTCHA not ready yet. Try again.");

        const confirmationResult = await signInWithPhoneNumber(
          auth,
          phone,
          appVerifier
        );
        window.confirmationResult = confirmationResult;
        setSessionInfo(confirmationResult?.verificationId);
        toast({
          title: "SMS sent!",
          description: "Verification code sent successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setCurrentSubStep("phone-verify");
      } catch (error) {
        console.error("Error sending code:", error);
        toast({
          title: "Verification failed",
          description:
            (error && error.message) ||
            "Unable to send code. Check Phone provider, Authorized domains, and reCAPTCHA setup.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [getPhone, toast, setCurrentSubStep]
  );

  return (
    <Box borderRadius="12px" bg="white">
      <VStack align="start" spacing={2}>
        <Text maxW="360px" fontSize="18px" fontWeight="600" color="#111827">
          Enter Mobile Number
        </Text>
        <Text fontSize="16px" maxW="360px" color="#6B7280">
          To ensure the security of your account, we require verification of
          your FMCSA linked phone number.
        </Text>

        <Box w="100%" mt="16px">
          <Text fontSize="14px" fontWeight="500" color="#414651" mb={2}>
            Phone number <span style={{color: "#EF6820"}}>*</span>
          </Text>

          <HFPhoneInput disabled={false} name="phone" control={control} />
        </Box>

        <Button
          mt="10px"
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

      {/* Must exist in the DOM before RecaptchaVerifier is constructed */}
      <div
        id="recaptcha-container"
        style={{
          margin: "20px 0",
          display: "flex",
          justifyContent: "center",
          height: "30px",
          width: "100%",
        }}
      />
    </Box>
  );
}

export default PhoneSendCode;
