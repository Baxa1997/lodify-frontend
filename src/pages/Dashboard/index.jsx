import HeadBreadCrumb from "@components/HeadBreadCrumb";
import React from "react";
import {Box, Text} from "@chakra-ui/react";
import {TripsNeedingAttention} from "./components/TripsNeedingAttention";
import {PerformanceGrade} from "./components/PerformanceGrade";
import {SafetyStatus} from "./components/SafetyStatus";
import {GoReadyTrucks} from "./components/GoReadyTrucks";
import useDashboardProps from "./components/useDashboardProps";
import SafetyCarrier from "./components/SafetyCarrier";

const Dashboard = () => {
  const {isBroker, tripsData, performanceData, safetyData} =
    useDashboardProps();

  return (
    <>
      <HeadBreadCrumb />
      <Text
        h={"32px"}
        my="12px"
        color={"#181D27"}
        fontWeight={"600"}
        fontSize={"24px"}>
        Dashboard
      </Text>
      <Box py="20px" pb="32px" bg="#f5f5f5" minH="calc(100vh - 80px)">
        <TripsNeedingAttention tripsData={tripsData} />
        <PerformanceGrade performanceData={performanceData} />
        {isBroker ? (
          <SafetyStatus />
        ) : (
          <SafetyCarrier safetyData={safetyData} />
        )}

        <GoReadyTrucks />
      </Box>
    </>
  );
};

export default Dashboard;
