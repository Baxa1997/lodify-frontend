import React from "react";
import {Box, Text, Flex, Button} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";

const OperationsStep = ({onNext = () => {}, onBack = () => {}}) => {
  return (
    <Box className={styles.stepContent}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mt="40px"
        pt="24px"
        borderTop="1px solid #E5E7EB">
        <Flex
          alignItems="center"
          gap="8px"
          cursor="pointer"
          onClick={onBack}
          color="#535862">
          <img src="/img/backArrow.svg" alt="arrow-left" />
          <Text fontSize="14px" fontWeight="400">
            Back
          </Text>
        </Flex>

        <Button
          bg="#EF6820"
          color="white"
          fontSize="14px"
          fontWeight="600"
          px="20px"
          py="10px"
          borderRadius="8px"
          _hover={{bg: "#DC5A1A"}}
          onClick={onNext}>
          Continue
        </Button>
      </Flex>
    </Box>
  );
};

export default OperationsStep;
