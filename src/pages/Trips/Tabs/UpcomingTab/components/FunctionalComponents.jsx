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
