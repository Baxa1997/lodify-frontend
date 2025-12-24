import React from "react";
import {Box, Text} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";

const CoverageMapStep = ({control}) => {
  return (
    <Box className={styles.stepContentCoverageMap}>
      <Text fontSize="24px" fontWeight="bold">
        Please confirm your Operating Regions
      </Text>
    </Box>
  );
};

export default CoverageMapStep;
