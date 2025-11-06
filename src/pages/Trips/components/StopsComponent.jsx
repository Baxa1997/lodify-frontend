import React, {useMemo, useState} from "react";
import styles from "../style.module.scss";
import {Box, Text, Button, Flex} from "@chakra-ui/react";
import StopsRoute from "./StopsRoute";

function StopsComponent({tripData = {}}) {
  // Calculate custom indices based on "Started" status
  const stopsWithCustomIndex = useMemo(() => {
    if (!tripData?.trip_logs) return [];

    let groupNumber = 0;
    let subIndex = 0;

    return tripData.trip_logs.map((stop, index) => {
      // Check if this stop has "Started" status
      if (stop?.status?.[0] === "Started") {
        groupNumber += 1;
        subIndex = 1;
      } else if (groupNumber > 0) {
        subIndex += 1;
      } else {
        // If no "Started" found yet, use default numbering
        groupNumber = 1;
        subIndex = index + 1;
      }

      return {
        ...stop,
        customIndex: `${groupNumber}.${subIndex}`,
        originalIndex: index,
      };
    });
  }, [tripData?.trip_logs]);

  return (
    <>
      <Flex w="100%" borderBottom={"1px solid #D5D7DA"} p={"20px"}>
        <Flex
          w="100%"
          h={"28px"}
          alignItems={"center"}
          gap={"10px"}
          justifyContent={"space-between"}>
          <Text color={"#181D27"} fontSize={"16px"} fontWeight={"600"}>
            Stop
          </Text>
          <Button
            minW={"20px"}
            h={"20px"}
            p="0"
            bg={"none"}
            _hover={{bg: "none"}}>
            <img src="/img/threeDots.svg" alt="menu" />
          </Button>
        </Flex>
      </Flex>

      <Flex m={"20px"} alignItems={"center"} justifyContent={"space-between"}>
        <Button className={styles.stepsButton}>
          <img src="/img/datepicker.svg" alt="calendar" />
          <Text>Select dates</Text>
        </Button>
        <Button className={styles.stepsButton}>
          <img src="/img/filter-lines.svg" alt="" />
          <Text>Filters</Text>
        </Button>
      </Flex>

      <Box overflowX="hidden">
        {stopsWithCustomIndex?.map((stop, index) => (
          <StopsRoute
            key={stop.originalIndex}
            initialStops={stopsWithCustomIndex}
            index={index}
            stop={stop}
            displayIndex={stop.customIndex}
          />
        ))}
      </Box>
    </>
  );
}

export default StopsComponent;
