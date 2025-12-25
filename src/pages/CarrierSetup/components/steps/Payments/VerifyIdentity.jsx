import React from "react";
import {Box, Text, Input} from "@chakra-ui/react";
import {Controller} from "react-hook-form";
import {PhoneInput} from "react-international-phone";
import "react-international-phone/style.css";

const VerifyIdentity = ({control}) => {
  return (
    <Box>
      <Text fontSize="20px" fontWeight="bold" color="#1e293b">
        We need to verify your identity one more time before you can edit your
        payment details.
      </Text>

      <Text fontSize="16px" color="#414651" mb="30px" mt="8px">
        Enter the code we just sent to the mobile number you entered.
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
          <Controller
            control={control}
            name="verify_mobile_phone"
            render={({field}) => (
              <Box
                display="flex"
                border="1px solid #D5D7DA"
                borderRadius="8px"
                overflow="hidden"
                height="40px"
                _focusWithin={{
                  borderColor: "#3b82f6",
                  boxShadow: "0 0 0 1px #3b82f6",
                }}>
                <PhoneInput
                  disableCountryGuess
                  defaultCountry="us"
                  forceCallingCode="1"
                  preferredCountries={["us"]}
                  value={field.value || ""}
                  onChange={(phone) => field.onChange(phone)}
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
            )}
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
            name="verify_email_or_phone"
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

        <Text fontSize="14px" color="#414651">
          We&apos;ll send a one-time code to what you enter.
        </Text>
      </Box>
    </Box>
  );
};

export default VerifyIdentity;
