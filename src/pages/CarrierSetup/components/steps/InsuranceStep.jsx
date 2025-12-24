import React from "react";
import {Box, Text} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import HFMultiSelect from "@components/HFMultiSelect";

const InsuranceStep = ({control}) => {
  const commodityTypes = [
    {label: "Agriculture", value: "agriculture"},
    {label: "Alcohol", value: "alcohol"},
    {label: "Automotive", value: "automotive"},
    {label: "Chemicals", value: "chemicals"},
    {label: "Electronics", value: "electronics"},
    {label: "Food", value: "food"},
  ];
  return (
    <Box className={styles.stepContentInsurance}>
      <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
        Cargo Insurance
      </Text>
      <Text fontSize="14px" color="#414651" mb="12px">
        Please confirm your policy exclusions below{" "}
      </Text>

      <Box>
        <Text fontSize="14px" fontWeight="600" color="#414651" mb="8px">
          Commodity type
        </Text>
        <HFMultiSelect
          options={commodityTypes}
          control={control}
          name="commodity_types"
          label="Commodity type"
        />
      </Box>
    </Box>
  );
};

export default InsuranceStep;
