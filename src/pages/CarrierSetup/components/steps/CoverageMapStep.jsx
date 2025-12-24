import React, {useState} from "react";
import {Box, Text, Flex} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import {CarrierUsMap} from "./CoverageMapStep/components/CarrierUsMap";

const CoverageMapStep = ({control}) => {
  const [selectedTab, setSelectedTab] = useState("Pacific");

  const regions = [
    "Pacific",
    "Rocky Mtn",
    "Midwest",
    "Southwest",
    "Southeast",
    "Northeast",
  ];

  return (
    <Box className={styles.stepContentCoverageMap}>
      <Flex justifyContent="space-between" alignItems="flex-start" mb="24px">
        <Box>
          <Text fontSize="24px" fontWeight="bold" mb="12px" color="#1e293b">
            Please confirm your Operating Regions
          </Text>
          <Flex gap="24px" mb="24px">
            <Text fontSize="14px" color="#414651">
              Team in Canada:{" "}
              <Text as="span" fontWeight="600">
                No
              </Text>
            </Text>
            <Text fontSize="14px" color="#414651">
              Team in Mexico:{" "}
              <Text as="span" fontWeight="600">
                No
              </Text>
            </Text>
          </Flex>

          <Flex gap="24px" className={styles.regionTabs}>
            {regions.map((region) => (
              <Box
                key={region}
                className={`${styles.regionTab} ${
                  selectedTab === region ? styles.active : ""
                }`}
                onClick={() => setSelectedTab(region)}
                cursor="pointer">
                <Text
                  fontSize="14px"
                  fontWeight={selectedTab === region ? "600" : "500"}>
                  {region}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>

        <Box className={styles.inspectionsInfo}>
          <Text fontSize="14px" color="#414651" mb="8px">
            Inspections in last 24 month
          </Text>
          <Flex alignItems="center" gap="8px">
            <Box width="16px" height="16px" bg="#e2e8f0" borderRadius="4px" />
            <Text fontSize="14px" color="#414651">
              Observed Inspections
            </Text>
          </Flex>
        </Box>
      </Flex>

      <Flex justifyContent="center" alignItems="center">
        <CarrierUsMap />
      </Flex>

      <Flex gap="24px" mt="16px" mb="32px" justifyContent="center">
        <Flex alignItems="center" gap="8px">
          <img src="/img/pinlocationBlue.svg" alt="" />
          <Text fontSize="14px" color="#414651">
            Vehicle
          </Text>
        </Flex>
        <Flex alignItems="center" gap="8px">
          <img src="/img/pinlocationGreen.svg" alt="" />
          <Text fontSize="14px" color="#414651">
            Driver
          </Text>
        </Flex>
        <Flex alignItems="center" gap="8px">
          <img src="/img/pinlocationRed.svg" alt="" />
          <Text fontSize="14px" color="#414651">
            Hazmat
          </Text>
        </Flex>
      </Flex>

      <Box className={styles.performanceGrid}>
        <Box className={styles.performanceCard}>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb="12px">
            Unsafe driving percentile
          </Text>
          <Flex alignItems="center" gap="8px" mb="12px">
            <Text fontSize="24px" fontWeight="600" color="#1e293b">
              49%
            </Text>
            <Flex
              width="28px"
              height="28px"
              bg="#079455"
              fontSize="16px"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="600">
              ✓
            </Flex>
          </Flex>
          <Box className={styles.progressBarWrapper}>
            <Box className={styles.progressBar}>
              <Box className={styles.progressFill} width="49%" />
            </Box>
            <Text
              fontSize="12px"
              color="#64748b"
              className={styles.progressLabel}>
              49%
            </Text>
          </Box>
        </Box>

        <Box className={styles.performanceCard}>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb="12px">
            HOS compliance Percentile
          </Text>
          <Flex alignItems="center" gap="8px" mb="12px">
            <Text fontSize="24px" fontWeight="600" color="#1e293b">
              49%
            </Text>
            <Flex
              width="28px"
              height="28px"
              bg="#079455"
              fontSize="16px"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="600">
              ✓
            </Flex>
          </Flex>
          <Box className={styles.progressBarWrapper}>
            <Box className={styles.progressBar}>
              <Box className={styles.progressFill} width="49%" />
            </Box>
            <Text
              fontSize="12px"
              color="#64748b"
              className={styles.progressLabel}>
              49%
            </Text>
          </Box>
        </Box>

        <Box className={styles.performanceCard}>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb="12px">
            Vehicle Maintenance Percentile
          </Text>
          <Flex alignItems="center" gap="8px" mb="12px">
            <Text fontSize="24px" fontWeight="600" color="#1e293b">
              66%
            </Text>
            <Flex
              width="28px"
              height="28px"
              bg="#079455"
              fontSize="16px"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="600">
              ✓
            </Flex>
          </Flex>
          <Box className={styles.progressBarWrapper}>
            <Box className={styles.progressBar}>
              <Box className={styles.progressFill} width="66%" />
            </Box>
            <Text
              fontSize="12px"
              color="#64748b"
              className={styles.progressLabel}>
              66%
            </Text>
          </Box>
        </Box>

        <Box className={styles.performanceCard}>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb="12px">
            Unsafe driving percentile
          </Text>
          <Flex alignItems="center" gap="8px">
            <Text fontSize="22px" color="#181D27" fontWeight="600">
              No data available
            </Text>
            <Flex
              width="28px"
              height="28px"
              bg="#079455"
              fontSize="16px"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="600">
              ✓
            </Flex>
          </Flex>
        </Box>

        <Box className={styles.performanceCard}>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb="12px">
            Unsafe driving percentile
          </Text>
          <Flex alignItems="center" gap="8px">
            <Text fontSize="22px" color="#181D27" fontWeight="600">
              No data available
            </Text>
            <Flex
              width="28px"
              height="28px"
              bg="#079455"
              fontSize="16px"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="600">
              ✓
            </Flex>
          </Flex>
        </Box>

        <Box className={styles.performanceCard}>
          <Text fontSize="14px" fontWeight="500" color="#414651" mb="12px">
            Unsafe driving percentile
          </Text>
          <Flex alignItems="center" gap="8px">
            <Text fontSize="22px" color="#181D27" fontWeight="600">
              No data available
            </Text>
            <Flex
              width="28px"
              height="28px"
              bg="#079455"
              fontSize="16px"
              borderRadius="50%"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="600">
              ✓
            </Flex>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default CoverageMapStep;
