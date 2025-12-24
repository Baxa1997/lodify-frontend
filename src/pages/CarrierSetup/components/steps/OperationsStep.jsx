import React from "react";
import {Box, Text} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";

const OperationsStep = () => {
  return (
    <Box className={styles.stepContent}>
      <Text fontSize="14x" fontWeight="600" color="#181D27">
        Confirm your contact information.
      </Text>
      <Text fontSize="14px" color="#6B7280" mb="14px">
        Enter the code we just sent to the mobile number you entered.
      </Text>

      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
        <ContactsInfo src="/img/afterHours.svg" />
        <ContactsInfo src="/img/billing.svg" />
        <ContactsInfo src="/img/claims.svg" />
        <ContactsInfo src="/img/dispatch.svg" />
      </Box>
    </Box>
  );
};

const ContactsInfo = ({
  src = "/img/phone.svg",
  contactLabel = "Dispatch",
  name = "Steven Hart",
  phone = "+1 380 444-6066",
  email = "stevenjobs@gmail.com",
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

export default OperationsStep;
