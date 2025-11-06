import { Box, Text } from "@chakra-ui/react";

const icons = {
  warning: <svg
    xmlns="http://www.w3.org/2000/svg"
    width="38"
    height="38"
    fill="none"><path
      stroke="#D92D20"
      strokeWidth="2"
      d="M19 6c7.18 0 13 5.82 13 13s-5.82 13-13 13S6 26.18 6 19 11.82 6 19 6Z"
      opacity=".3"/><path
      stroke="#D92D20"
      strokeWidth="2"
      d="M19 1c9.941 0 18 8.059 18 18s-8.059 18-18 18S1 28.941 1 19 9.059 1 19 1Z"
      opacity=".1"/><g clipPath="url(#a)"><path
      stroke="#D92D20"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.667"
      d="M19 15.667V19m0 3.333h.009M27.334 19a8.333 8.333 0 1 1-16.667 0 8.333 8.333 0 0 1 16.667 0Z"/></g><defs><clipPath id="a"><path
      fill="#fff"
      d="M9 9h20v20H9z"/></clipPath></defs></svg>,
};

const AlertCard = ({ type = "warning", title, description }) => {
  return <Box
    position="relative"
    padding="16px 16px 16px 52px"
    border="1px solid"
    borderColor="gray.300"
    borderRadius="12px"
    boxShadow="box-shadow: 0 1px 2px 0 rgba(10, 13, 18, 0.5), rgba(10, 13, 18, 0.05)"
  >
    <Box
      position="absolute"
      top="7px"
      left="7px">
      {icons[type]}
    </Box>
    <Box
      display="flex"
      flexDirection="column"
      columnGap="4px">
      <Text
        color="#414651"
        fontWeight="600"
        fontSize="14px">{title}</Text>
      <Text
        color="#535862"
        fontWeight="400"
        fontSize="14px"
        lineHeight="20px"
      >
        {description}
      </Text>
    </Box>
  </Box>;
};

export default AlertCard;
