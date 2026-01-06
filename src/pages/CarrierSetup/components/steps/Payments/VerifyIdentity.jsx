import React, {useState} from "react";
import {Box, Text, Input, Button, useToast} from "@chakra-ui/react";
import {Controller} from "react-hook-form";
import {PhoneInput} from "react-international-phone";
import "react-international-phone/style.css";
import authService from "../../../../../services/auth/authService";
import HFPhoneInput from "@components/HFPhoneInput";

const VerifyIdentity = ({control, watch, setValue, onSendOtp}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSendOtp = async () => {
    const phone = watch("payment.verify_mobile_phone");
    const emailOrPhone = watch("payment.verify_email_or_phone");

    if (!phone || !emailOrPhone) {
      toast({
        title: "Missing Information",
        description: "Please enter both mobile phone and email/phone number.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsLoading(true);
    try {
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
          title: "Code Sent Successfully!",
          description: `Verification code has been sent to your ${
            isEmail ? "email" : "phone"
          }.`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top-right",
        });

        if (onSendOtp) {
          onSendOtp();
        }
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
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
          <Text
            as="label"
            fontSize="14px"
            fontWeight="500"
            color="#414651"
            mb="6px"
            display="block">
            Mobile phone
            <Box as="span" color="blue.500" ml="2px">
              *
            </Box>
          </Text>
          <HFPhoneInput
            control={control}
            name="telephone"
            defaultCountry="us"
            forceCallingCode="1"
            preferredCountries={["us"]}
            placeholder="Enter Mobile"
            style={{
              "--rip-border-radius": "0",
              "--rip-border-color": "transparent",
              "--rip-border-color-focus": "transparent",
              "--rip-font-size": "14px",
              "--rip-height": "40px",
              "--rip-gap": "0px",
              "--rip-outline": "none",
              "--rip-box-shadow": "none",
              width: "100%",
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
            inputStyle={{
              fontSize: "14px",
              height: "38px",
              border: "none",
              borderRadius: "0",
              padding: "8px 12px 8px 44px",
              outline: "none",
              boxShadow: "none",
              flex: 1,
            }}
            countrySelectorStyleProps={{
              style: {
                position: "absolute",
                zIndex: 10,
                background: "#fff",
                outline: "none",
                border: "none",
                height: "100%",
                display: "flex",
                alignItems: "center",
              },
            }}
            hideDropdown={false}
            showDropdownSearch={true}
            disableFormatting={false}
          />
        </Box>

        <Box mt="10px">
          <Text
            as="label"
            fontSize="14px"
            fontWeight="500"
            color="#414651"
            mb="6px"
            display="block">
            Email or phone number
            <Box as="span" color="blue.500" ml="2px">
              *
            </Box>
          </Text>
          <Controller
            control={control}
            name="payment.verify_email_or_phone"
            render={({field}) => (
              <Input
                {...field}
                placeholder="name@domain.com or +1 555-123-4567"
                border="1px solid #D5D7DA"
                borderRadius="8px"
                fontSize="14px"
                px="12px"
                py="8px"
                height="40px"
                _focus={{
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 1px #3b82f6",
                }}
              />
            )}
          />
        </Box>

        <Text fontSize="14px" color="#414651" mb="16px">
          We&apos;ll send a one-time code to what you enter.
        </Text>

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
