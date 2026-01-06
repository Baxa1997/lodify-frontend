import React from "react";
import {Box, Text, Flex, Button} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import HFTextField from "@components/HFTextField";
import {useWatch} from "react-hook-form";

const IdentityStep = ({
  control,
  onNext,
  onBack,
  subView = 1,
  isEditable = false,
}) => {
  const values = useWatch({control});

  if (subView === 2) {
    return (
      <Box className={styles.stepContentIdentityContact}>
        <Text fontSize="14x" fontWeight="600" color="#181D27">
          Confirm your contact information.
        </Text>
        <Text fontSize="14px" color="#6B7280" mb="14px">
          Enter the code we just sent to the mobile number you entered.
        </Text>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
          {values?.identity?.company_officer_1 && (
            <ContactsInfo
              name={values?.identity?.company_officer_1}
              src="/img/afterHours.svg"
            />
          )}
          {values?.identity?.company_officer_2 && (
            <ContactsInfo
              name={values?.identity?.company_officer_2}
              src="/img/billing.svg"
            />
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.stepContentIdentity}>
      <Text fontSize="14x" fontWeight="600" color="#181D27">
        Let&apos;s start with the basics.
      </Text>
      <Text fontSize="14px" color="#6B7280" mb="14px">
        Please confirm the information below.
      </Text>

      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
        <HFTextField
          disabled={!isEditable}
          label="Legal name"
          control={control}
          name="identity.legal_name"
          placeholder="Enter carrier name"
          style={{
            border: "1px solid #D5D7DA",
          }}
          labelStyle={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#414651",
          }}
        />

        <HFTextField
          disabled={!isEditable}
          label="Identifires"
          control={control}
          name="identity.us_dot_number"
          placeholder="Enter carrier name"
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

      <Box mt="14px">
        <Text fontSize="14px" fontWeight="600" color="#181D27" mb="12px">
          Physical Address
        </Text>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
          <HFTextField
            disabled={!isEditable}
            label="Address Line 1"
            control={control}
            name="identity.phy_street"
            placeholder="Address Line 1"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={!isEditable}
            label="Address Line 2"
            control={control}
            name=""
            placeholder="Address Line 2"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={!isEditable}
            label="City"
            control={control}
            name="identity.phy_city"
            placeholder="City"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={!isEditable}
            label="State"
            control={control}
            name="identity.phy_state"
            placeholder="State"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={!isEditable}
            label="ZIP"
            control={control}
            name="identity.phy_zip"
            placeholder="ZIP"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={!isEditable}
            label="Country"
            control={control}
            name="identity.phy_country"
            placeholder="Country"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={!isEditable}
            label="Phone(s)"
            control={control}
            name="identity.telephone"
            placeholder="Phones"
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
      </Box>

      <Box mt="14px">
        <Text fontSize="14px" fontWeight="600" color="#181D27" mb="6px">
          Physical Address
        </Text>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="12px">
          <HFTextField
            disabled={!isEditable}
            label="Email address"
            control={control}
            name="identity.email"
            placeholder="Email address"
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            disabled={!isEditable}
            label="Phone number"
            control={control}
            name="identity.telephone"
            placeholder="Phone number"
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
      </Box>
    </Box>
  );
};

const ContactsInfo = ({
  src = "/img/phone.svg",
  contactLabel = "Dispatch",
  name = "",
  phone = "",
  email = "",
}) => {
  return (
    <Box>
      <Text fontSize="14x" fontWeight="500" color="#414651" mb="8px">
        {contactLabel}
      </Text>
      <Box border="1px solid #D5D7DA" p="12px 14px" borderRadius="8px">
        <img width="28px" height="28px" src={src} alt="phone" />
        <Text
          color="#181D27"
          fontSize="16px"
          fontWeight="600"
          mt="12px"
          mb="6px">
          {name}
        </Text>
        <Text mb="6px" color="#535862" fontSize="14px">
          {email}
        </Text>
        <Text color="#535862" fontSize="14px">
          {phone}
        </Text>
      </Box>
    </Box>
  );
};

export default IdentityStep;
