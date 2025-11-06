import { Badge } from "@chakra-ui/react";

export const StatusBadge = ({ children, status }) => {

  const statuses = {
    active: {
      bg: "success.500",
      color: "#fff",
    },
    inactive: {
      bg: "red.500",
      color: "#fff",
    },
    rejected: {
      bg: "red.500",
      color: "#fff",
    },
    property: {
      bg: "secondary.700",
      color: "#fff",
    },
  };

  return <Badge
    padding="1px 12px"
    borderRadius="16px"
    fontSize="12px"
    fontWeight="500"
    color={statuses[status]?.color || statuses["active"].color}
    border="1px solid"
    borderColor={statuses[status]?.border || statuses["active"].border}
    bgColor={statuses[status]?.bg || statuses["active"].bg}
  >
    {children}  
  </Badge>;
};
