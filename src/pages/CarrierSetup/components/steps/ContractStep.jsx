import React from "react";
import {Box, Text, Flex} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import HFTextField from "@components/HFTextField";

const ContractStep = ({control, subView = 1}) => {
  if (subView === 2) {
    return (
      <Box className={styles.stepContentContract}>
        <Text fontSize="20px" fontWeight="bold" color="#1e293b" mb="8px">
          Failed Assesment
        </Text>
        <Text fontSize="14px" color="#414651" mb="18px">
          We cannot connect EAGLE EYE TRUCKING LLC to R & R Express, Inc. due to
          unmet requirements.
        </Text>

        <Box
          border="1px solid #E2E8F0"
          borderRadius="8px"
          p="12px"
          bg="white"
          mb="24px">
          <Flex alignItems="flex-start" gap="12px">
            <img src="/img/inspectionsIcon.svg" alt="" />
            <Box>
              <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="4px">
                Important
              </Text>
              <Text fontSize="14px" color="#414651">
                EAGLE EYE TRUCKING LLC does not meet 3 of R & R Express,
                Inc.&apos;s requirements.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box p="12px" border="1px solid #E2E8F0" borderRadius="8px" bg="white">
          <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="6px">
            Temperature Controlled
          </Text>

          <Text fontSize="14px" fontWeight="500" color="#414651">
            Failed Rules
          </Text>
          <Text fontSize="12px" color="#414651">
            These rules are enforced automatically and cannot be modified by
            Lodify
          </Text>
          <Flex mt="4px">
            <Text fontSize="14px" fontWeight="500" color="#414651">
              Carrier has refrigeration breakdown coverage
            </Text>
            <Flex
              w="48px"
              h="28px"
              bg="rgba(254, 223, 137, .4)"
              border="1px solid #FEDF89"
              borderRadius="24px"
              justifyContent="center"
              alignItems="center"
              color="#B54708"
              fontSize="12px"
              fontWeight="500">
              Fail
            </Flex>
          </Flex>

          <Flex mt="4px">
            <Text fontSize="14px" fontWeight="500" color="#414651">
              Certain data properties require broker approval
            </Text>
            <Flex
              w="48px"
              h="28px"
              bg="rgba(254, 223, 137, .4)"
              border="1px solid #FEDF89"
              borderRadius="24px"
              justifyContent="center"
              alignItems="center"
              color="#B54708"
              fontSize="12px"
              fontWeight="500">
              Fail
            </Flex>
          </Flex>
        </Box>

        <Box
          mt="20px"
          p="12px"
          border="1px solid #E2E8F0"
          borderRadius="8px"
          bg="white">
          <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="6px">
            Interstate
          </Text>

          <Text fontSize="14px" fontWeight="500" color="#414651">
            Failed Rules
          </Text>
          <Text fontSize="12px" color="#414651">
            These rules are enforced automatically and cannot be modified by
            Lodify
          </Text>
          <Flex mt="4px">
            <Text fontSize="14px" fontWeight="500" color="#414651">
              Carrier has refrigeration breakdown coverage
            </Text>
            <Flex
              w="48px"
              h="28px"
              bg="rgba(254, 223, 137, .4)"
              border="1px solid #FEDF89"
              borderRadius="24px"
              justifyContent="center"
              alignItems="center"
              color="#B54708"
              fontSize="12px"
              fontWeight="500">
              Fail
            </Flex>
          </Flex>
        </Box>

        <Box
          mt="20px"
          p="12px"
          border="1px solid #E2E8F0"
          borderRadius="8px"
          bg="white">
          <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="6px">
            Interstate - California
          </Text>

          <Text fontSize="14px" fontWeight="500" color="#414651">
            Failed Rules
          </Text>
          <Text fontSize="12px" color="#414651">
            These rules are enforced automatically and cannot be modified by
            Lodify
          </Text>
          <Flex mt="4px">
            <Text fontSize="14px" fontWeight="500" color="#414651">
              Carrier has refrigeration breakdown coverage
            </Text>
            <Flex
              w="48px"
              h="28px"
              bg="rgba(254, 223, 137, .4)"
              border="1px solid #FEDF89"
              borderRadius="24px"
              justifyContent="center"
              alignItems="center"
              color="#B54708"
              fontSize="12px"
              fontWeight="500">
              Fail
            </Flex>
          </Flex>
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.stepContentContract}>
      <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
        Contract
      </Text>
      <Text fontSize="16px" color="#414651" mb="24px">
        Review your tax identification number and federal tax classification for
        your W-9
      </Text>

      <Box>
        <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="16px">
          W9 Information
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
              TIN
            </Text>
            <HFTextField
              placeholder="Enter TIN"
              borderColor="#d5d7da"
              control={control}
              name="tin"
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
              Federal Tax Classification
            </Text>
            <HFTextField
              placeholder="Enter Federal Tax Classification"
              borderColor="#d5d7da"
              control={control}
              name="federal_tax_classification"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ContractStep;
