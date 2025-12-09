import React from "react";
import {Flex, Text} from "@chakra-ui/react";
import Select from "@components/Select";

function PerformanceFilter() {
  return (
    <>
      <Flex
        w={"100%"}
        bg="#FAFAFA"
        p="20px"
        borderRadius="12px"
        justifyContent="space-between"
        alignItems="center"
        gap="12px">
        <Flex w="25%" flexDirection={"column"}>
          <Text mb="8px" h="20px">
            Timeframe <span style={{color: "#1570EF"}}>*</span>
          </Text>
          <Select
            options={[
              {label: "Last 7 Days", value: "last_7_days"},
              {label: "Last 30 Days", value: "last_30_days"},
              {label: "Last 90 Days", value: "last_90_days"},
            ]}
          />
        </Flex>

        <Flex w="25%" flexDirection={"column"}>
          <Text mb="8px" h="20px"></Text>
          <Select
            options={[
              {label: "Last 7 Days", value: "last_7_days"},
              {label: "Last 30 Days", value: "last_30_days"},
              {label: "Last 90 Days", value: "last_90_days"},
            ]}
          />
        </Flex>

        <Flex w="25%" flexDirection={"column"}>
          <Text mb="8px" h="20px">
            Load type <span style={{color: "#1570EF"}}>*</span>
          </Text>
          <Select
            options={[
              {label: "Last 7 Days", value: "last_7_days"},
              {label: "Last 30 Days", value: "last_30_days"},
              {label: "Last 90 Days", value: "last_90_days"},
            ]}
          />
        </Flex>

        <Flex w="25%" flexDirection={"column"}>
          <Text mb="8px" h="20px">
            Domicile <span style={{color: "#1570EF"}}>*</span>
          </Text>
          <Select
            options={[
              {label: "Last 7 Days", value: "last_7_days"},
              {label: "Last 30 Days", value: "last_30_days"},
              {label: "Last 90 Days", value: "last_90_days"},
            ]}
          />
        </Flex>
      </Flex>
    </>
  );
}

export default PerformanceFilter;
