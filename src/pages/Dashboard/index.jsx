import HeadBreadCrumb from "@components/HeadBreadCrumb";
import React from "react";
import {Box} from "@chakra-ui/react";
import {TripsNeedingAttention} from "./components/TripsNeedingAttention";
import {PerformanceGrade} from "./components/PerformanceGrade";
import {SafetyStatus} from "./components/SafetyStatus";

const Dashboard = () => {
  return (
    <>
      <HeadBreadCrumb />
      <Box py="20px" pb="32px" bg="#f5f5f5" minH="calc(100vh - 80px)">
        <TripsNeedingAttention />
        <PerformanceGrade />
        <SafetyStatus />
      </Box>
    </>
  );
};

export default Dashboard;
