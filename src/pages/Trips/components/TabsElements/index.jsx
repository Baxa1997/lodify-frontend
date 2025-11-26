import {Flex, Text, Box} from "@chakra-ui/react";

export const TripStatus = ({status, onExpand = () => {}, tripId = ""}) => {
  return (
    <Flex
      onClick={(e) => {
        e.stopPropagation();
        onExpand(tripId, e);
      }}
      alignItems="center"
      justifyContent="center"
      flexDirection="row-reverse"
      w="36px"
      gap="4px"
      p="2px 8px"
      borderRadius="100px"
      border="1px solid #B2DDFF"
      cursor="pointer">
      {status === 0 && <img src="/img/statusArrow.svg" alt="" />}
      <Text fontSize="12px" fontWeight="500" color="#175CD3">
        {status || 1}
      </Text>
      {status !== 0 && <img src="/img/statusArrow.svg" alt="" />}
    </Flex>
  );
};

export const TripProgress = ({total_trips = 0, current_trips = 0}) => {
  const colors = ["#FF5B04", "#00707A", "#003B63"];
  return (
    <Flex alignItems="center" justifyContent="flex-start" gap="6px">
      {Array.from({length: total_trips}).map((_, index) => {
        const isFilled = index < current_trips;
        const color = colors[index % colors.length];

        return (
          <Box
            key={index}
            w="13px"
            h="13px"
            borderRadius="50%"
            bg={isFilled ? color : "#E0E0E0"}
          />
        );
      })}
    </Flex>
  );
};
