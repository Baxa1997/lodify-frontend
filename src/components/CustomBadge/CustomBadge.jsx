import { Badge } from "@chakra-ui/react";

const CustomBadge = ({ children, variant = "success", withBgColor = false, size="md", ...props }) => {

  const statuses = {
    success: {
      bg: "#ECFDF3",
      color: "#067647",
      border: "#ABEFC6",
    },
    warning: {
      bg: "#FFFAEB",
      color: "#B54708",
      border: "#FEDF89",
    },
    error: {
      bg: "#FEF3F2",
      color: "#B42318",
      border: "#FECDCA",
    },
  };

  return <Badge
    padding={size === "md" ? "2px 12px" : "2px 8px"}
    borderRadius="16px"
    fontSize="14px"
    fontWeight="500"
    bg={withBgColor ? statuses[variant].bg : "transparent"}
    color={statuses[variant].color}
    border={`1px solid ${withBgColor ? statuses[variant].border : statuses[variant].color}`}
    textTransform={"capitalize"}
    {...props}
  >
    {children}
  </Badge>;
};

export default CustomBadge;
