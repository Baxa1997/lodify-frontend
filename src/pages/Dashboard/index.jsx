import HeadBreadCrumb from "@components/HeadBreadCrumb";
import React from "react";
import {Box, Text} from "@chakra-ui/react";
import {TripsNeedingAttention} from "./components/TripsNeedingAttention";
import {PerformanceGrade} from "./components/PerformanceGrade";
import {SafetyStatus} from "./components/SafetyStatus";
import {GoReadyTrucks} from "./components/GoReadyTrucks";
import useDashboardProps from "./components/useDashboardProps";
import SafetyCarrier from "./components/SafetyCarrier";
import NationalAverage from "./components/SafetyCarrier/NationalAverage";
import {ShippersScore} from "./components/ShippersScore/ShippersScore";

const Dashboard = () => {
  const {
    isBroker,
    tripsData,
    performanceData,
    safetyData,
    brokerSafetyData,
    carrierInfoData,
    nationalAverageData,
    shippersScoreData,
    isTripsLoading,
    isPerformanceLoading,
    isSafetyLoading,
    isBrokerSafetyLoading,
    isCarrierInfoLoading,
    isNationalAverageLoading,
    isShippersLoading,
  } = useDashboardProps();

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
        <TripsNeedingAttention
          tripsData={tripsData}
          isLoading={isTripsLoading}
        />
        {!isBroker && (
          <PerformanceGrade
            performanceData={performanceData}
            isLoading={isPerformanceLoading}
          />
        )}
        {isBroker ? (
          <SafetyStatus
            brokerSafetyData={brokerSafetyData}
            isLoading={isBrokerSafetyLoading}
          />
        ) : (
          <SafetyCarrier
            carrierInfoData={carrierInfoData}
            safetyData={safetyData}
            isLoading={isSafetyLoading || isCarrierInfoLoading}
          />
        )}

        {Boolean(isBroker) && (
          <ShippersScore
            shippersScoreData={shippersScoreData}
            isLoading={isShippersLoading}
          />
        )}

        <NationalAverage
          nationalAverageData={nationalAverageData}
          isLoading={isNationalAverageLoading}
        />

        <GoReadyTrucks />
      </Box>
    </>
  );
};

export default Dashboard;
