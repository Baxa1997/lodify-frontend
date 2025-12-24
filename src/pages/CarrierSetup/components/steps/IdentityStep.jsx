import React from "react";
import {Box, Text, Flex, Button} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import HFTextField from "@components/HFTextField";

const IdentityStep = ({control}) => {
  return (
    <Box className={styles.stepContent}>
      <Text fontSize="14x" fontWeight="600" color="#181D27">
        Let&apos;s start with the basics.
      </Text>
      <Text fontSize="14px" color="#6B7280" mb="14px">
        Please confirm the information below.
      </Text>

      <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
        <HFTextField
          label="Legal name"
          control={control}
          name="carrier_name"
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
          label="Identifires"
          control={control}
          name="carrier_name"
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

      <Box mt="20px">
        <Text fontSize="14px" fontWeight="600" color="#181D27" mb="12px">
          Physical Address
        </Text>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
          <HFTextField
            label="Identifires"
            control={control}
            name="carrier_name"
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
            label="Identifires"
            control={control}
            name="carrier_name"
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
            label="Identifires"
            control={control}
            name="carrier_name"
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
            label="Identifires"
            control={control}
            name="carrier_name"
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
            label="Identifires"
            control={control}
            name="carrier_name"
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
            label="Identifires"
            control={control}
            name="carrier_name"
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
            label="Identifires"
            control={control}
            name="carrier_name"
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
      </Box>

      <Box mt="20px">
        <Text fontSize="14px" fontWeight="600" color="#181D27" mb="6px">
          Physical Address
        </Text>

        <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="16px">
          <HFTextField
            label="Identifires"
            control={control}
            name="carrier_name"
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
            label="Identifires"
            control={control}
            name="carrier_name"
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
      </Box>
    </Box>
  );
};

export default IdentityStep;
