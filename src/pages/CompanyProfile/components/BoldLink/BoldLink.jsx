import { Link } from "@chakra-ui/react";

export const BoldLink = ({ children, icon }) => {
  return <Link
    href="#"
    color="blue.500"
    fontWeight="600"
    display="flex"
    alignItems="center"
    gap="6px"
  >
    {icon}
    <span>{children}</span>
  </Link>;
};
