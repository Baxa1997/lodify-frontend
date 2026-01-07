import React from "react";
import {Box, Text, Input} from "@chakra-ui/react";
import {Controller, useWatch} from "react-hook-form";
import HFTextField from "@components/HFTextField";

const ConfirmCompany = ({control}) => {
  const values = useWatch({control});

  return (
    <Box>
      <Text fontSize="20px" fontWeight="bold" color="#1e293b" mb="8px">
        Please confirm your factoring company below.
      </Text>
      <Text fontSize="16px" color="#414651" mb="30px">
        Enter the code we just sent to the mobile number you entered.
      </Text>

      <Box>
        <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="16px">
          Factoring Company Details
        </Text>

        <Box display="flex" flexDirection="column" gap="16px">
          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              Factoring Company name
            </Text>
            <HFTextField
              border="1px solid #D5D7DA"
              control={control}
              name="payment.factoring_company_name"
              placeholder="Enter factoring company name"
            />
          </Box>

          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              Telephone
            </Text>
            <HFTextField
              border="1px solid #D5D7DA"
              control={control}
              name="payment.factoring_phone"
              placeholder="Enter factoring company phone"
            />
          </Box>

          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              E-Mail
            </Text>
            <HFTextField
              border="1px solid #D5D7DA"
              control={control}
              name="payment.factoring_email"
              placeholder="Enter factoring company email"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ConfirmCompany;
