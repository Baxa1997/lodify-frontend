import {
  Flex,
  Text,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import {BsThreeDotsVertical} from "react-icons/bs";

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

export const TripDriverVerification = ({trip = {}}) => {
  const stop = trip?.stop?.[0];

  return (
    <Flex gap="24px" alignItems="center">
      <Box w="22px" h="22px">
        {stop?.equipment_availability?.[0] === "Required" ? (
          trip?.is_truck_verified ? (
            <img
              src="/img/verifiedFullTruck.svg"
              alt="powerOnly"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <img
              src="/img/unverifiedFullTruck.svg"
              alt="powerOnly"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )
        ) : trip?.is_truck_verified ? (
          <img
            src="/img/verifiedEmptyTruck.svg"
            alt="truck"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : (
          <img
            src="/img/unverifiedEmptyTruck.svg"
            alt="truck"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        )}
      </Box>

      <Flex
        alignItems="center"
        justifyContent="center"
        w="44px"
        h="27px"
        p="5px"
        gap="4px"
        bg={trip?.is_driver_verified ? "#DEFFEE" : "#EDEDED"}
        borderRadius="16px">
        <Box w="17px" h="17px">
          {trip?.driver_type?.[0] === "Team" &&
            (trip?.is_driver_verified ? (
              <img
                src="/img/unverifiedSecondDriver.svg"
                alt="driver"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <img
                src="/img/unvSecondDriver.svg"
                alt="driver"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ))}
        </Box>
        <Box w="17px" h="17px">
          {trip?.is_driver_verified ? (
            <img
              src="/img/driverVerified.svg"
              alt="driver"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <img
              src="/img/unverifiedDriver.svg"
              alt="driver"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export const ReAssignDriverButton = ({
  driverType = "solo",
  trip,
  setSelectedRow = () => {},
  setIsAssignDriverModalOpen = () => {},
}) => {
  return (
    <>
      <Menu>
        <MenuButton
          p="0"
          maxWidth="22px"
          width="22px"
          minWidth="22px"
          height="22px"
          bg="none"
          onClick={(e) => e.stopPropagation()}
          as={Button}>
          <BsThreeDotsVertical style={{width: "22px", height: "14px"}} />
        </MenuButton>
        <MenuList zIndex={8}>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsAssignDriverModalOpen(true);
              setSelectedRow({
                trip: trip,
                driverType: driverType,
              });
            }}>
            <Text color="#535862" fontWeight="600">
              Re-Assign Driver
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export const ReAssignCarrierButton = ({
  carrierType = "solo",
  trip,
  setSelectedRow = () => {},
  setIsAssignCarrierModalOpen = () => {},
}) => {
  return (
    <>
      <Menu>
        <MenuButton
          p="0"
          maxWidth="22px"
          width="22px"
          minWidth="22px"
          height="22px"
          bg="none"
          onClick={(e) => e.stopPropagation()}
          as={Button}>
          <BsThreeDotsVertical style={{width: "22px", height: "14px"}} />
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsAssignCarrierModalOpen(true);
              setSelectedRow({
                trip: trip,
                carrierType: carrierType,
              });
            }}>
            <Text color="#535862" fontWeight="600">
              Re-Assign Carrier
            </Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
