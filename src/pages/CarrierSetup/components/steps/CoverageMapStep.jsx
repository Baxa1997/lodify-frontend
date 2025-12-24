import React from "react";
import {Box, Text} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import HFTextField from "@components/HFTextField";
import HFSelect from "@components/HFSelect";
import HFMultiSelect from "@components/HFMultiSelect";

const CoverageMapStep = ({control}) => {
  const trailerTypes = [
    {label: "Van", value: "van"},
    {label: "Reefer", value: "reefer"},
    {label: "Flatbed", value: "flatbed"},
    {label: "Car Hauler", value: "car_hauler"},
    {label: "Double Drop", value: "double_drop"},
    {label: "Drop Deck", value: "drop_deck"},
  ];

  return (
    <Box w="420px" className={styles.stepContent}>
      <Text fontSize="14x" fontWeight="600" color="#181D27">
        Confirm these details about your operations
      </Text>
      <Text fontSize="14px" color="#6B7280" mb="14px">
        Enter the code we just sent to the mobile number you entered.
      </Text>

      <Box display="grid" gridTemplateColumns="repeat(1, 1fr)" gap="16px">
        <HFTextField
          label="Total power unites "
          control={control}
          name="total_power_units"
          placeholder="Enter total power units"
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
          label="Total drives  "
          control={control}
          name="total_drives"
          placeholder="Enter total drives"
          style={{
            border: "1px solid #D5D7DA",
          }}
          labelStyle={{
            fontSize: "14px",
            fontWeight: "500",
            color: "#414651",
          }}
        />

        <Box>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb="8px">
            Trailer types
          </Text>
          <HFMultiSelect
            options={trailerTypes}
            control={control}
            name="trailer_types"
            placeholder="Enter trailer types"
            style={{
              border: "1px solid #D5D7DA",
            }}
          />
        </Box>

        <Box>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb="8px">
            Models
          </Text>
          <HFSelect
            options={[]}
            control={control}
            name="models"
            placeholder="Enter models"
            style={{
              border: "1px solid #D5D7DA",
            }}
          />
        </Box>

        <HFTextField
          label="Trailer count"
          control={control}
          name="trailer_count"
          placeholder="Enter trailer count"
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
          label="Specialization"
          control={control}
          name="specialization"
          placeholder="Enter specialization"
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
  );
};

export default CoverageMapStep;
