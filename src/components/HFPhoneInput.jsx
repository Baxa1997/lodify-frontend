import React from "react";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { Box } from "@chakra-ui/react";
import { Controller } from "react-hook-form";

const HFPhoneInput = ({ control, name, disabled }) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Box
          display="flex"
          border="1px solid #E2E8F0"
          borderRadius="6px"
          overflow="hidden"
          height="40px"
          _focusWithin={{
            borderColor: "#E2E8F0",
            boxShadow: "none",
          }}>
          <PhoneInput
            disableCountryGuess
            defaultCountry="us"
            forceCallingCode="1"
            preferredCountries={["us"]}
            value={field.value}
            onChange={(phone) => field.onChange(phone)}
            id="phone"
            disabled={disabled}
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
  );
};

export default HFPhoneInput;
