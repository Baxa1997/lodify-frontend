import { Box, Text } from "@chakra-ui/react";

export const StatusText = ({ title, data = "", status }) => {
  const statusMap = {
    "ACTIVE": "success.600",
    "YES": "success.600",
    "NO": "error.600",
    "NONE": "error.600",
    "ERROR": "error.600",
    "SUCCESS": "success.600",
    "NA": "error.600",
  };

  return <Box
    display="flex"
    gap="8px">
    <Text
      fontSize="14px"
      fontWeight="600"
      color="secondary.700"
    >
      {title}
    </Text>
    <Text
      fontSize="14px"
      fontWeight="400"
      color={statusMap[status] || statusMap[typeof data === "string" ? data?.toUpperCase() : data]}
    >
      {data}
    </Text>
  </Box>;
};
