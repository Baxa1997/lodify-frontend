import React, {useState} from "react";
import {Box, Text, Flex} from "@chakra-ui/react";
import {Controller} from "react-hook-form";
import OtpInput from "react-otp-input";

const OtpPhoneConfirm = ({control}) => {
  const [otpCode, setOtpCode] = useState("");

  const handleOtpChange = (value) => {
    setOtpCode(value);
  };

  const handleResend = () => {
    console.log("Resending code...");
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
          name="otp_code"
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
                  }}
                  placeholder="0"
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

      <Flex justifyContent="center" alignItems="center" gap="4px">
        <Text fontSize="14px" color="#414651">
          Code didn&apos;t send?
        </Text>
        <Text
          fontSize="14px"
          color="#FF5B04"
          cursor="pointer"
          fontWeight="500"
          onClick={handleResend}
          _hover={{textDecoration: "underline"}}>
          Click to resend
        </Text>
      </Flex>
    </Box>
  );
};

export default OtpPhoneConfirm;
