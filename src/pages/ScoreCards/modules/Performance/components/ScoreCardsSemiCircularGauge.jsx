import React from "react";
import {Box, Text} from "@chakra-ui/react";

export const ScoreCardsSemiCircularGauge = ({
  value,
  maxValue = 100,
  color,
  label,
  showValue = true,
}) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const radius = 50;
  const strokeWidth = 10;
  const centerX = 60;
  const centerY = 60;

  const angle = (percentage / 100) * 180;
  const angleRad = (angle * Math.PI) / 180;

  const endX = centerX + radius * Math.cos(Math.PI - angleRad);
  const endY = centerY - radius * Math.sin(Math.PI - angleRad);

  const largeArcFlag = angle > 180 ? 1 : 0;
  const progressPath = `M ${
    centerX - radius
  } ${centerY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

  const backgroundPath = `M ${
    centerX - radius
  } ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`;

  return (
    <Box
      position="relative"
      w="160px"
      h="80px"
      display="flex"
      justifyContent="center"
      alignItems="flex-end">
      <svg
        width="160px"
        height="80px"
        viewBox="0 0 120 70"
        style={{overflow: "visible"}}>
        <path
          d={backgroundPath}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {percentage > 0 && (
          <path
            d={progressPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              transition: "all 0.5s ease",
            }}
          />
        )}
      </svg>
      {showValue && (
        <Box
          position="absolute"
          bottom="4px"
          left="50%"
          transform="translateX(-50%)"
          textAlign="center"
          w="100%">
          {label && (
            <Text fontSize="12px" fontWeight="600" color="#181D27" mb="2px">
              {label}
            </Text>
          )}
          <Text fontSize="14px" fontWeight="700" color={color}>
            {value}
          </Text>
        </Box>
      )}
    </Box>
  );
};
