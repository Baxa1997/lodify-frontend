import React, {useCallback, useRef, useState, useMemo, useEffect} from "react";
import GoogleMapReact from "google-map-react";
import {Box, Text, Flex, Button} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

const DriverMarker = ({onClick, driver}) => {
  const isSelected = driver?.isSelected;
  
  return (
    <Box
      position="absolute"
      transform="translate(-50%, -100%)"
      cursor="pointer"
      zIndex={isSelected ? 20 : 10}
      onClick={onClick}>
      <Flex
        bg="#fff"
        minW="70px"
        h="30px"
        alignItems="center"
        justifyContent="center"
        borderRadius="6px"
        border="1px solid #E2E8F0"
        px="6px"
        fontSize="12px"
        fontWeight="600"
        mb="4px">
        {driver?.licence_plate || driver?.truckId || "T-4829"}
      </Flex>
      <Box position="relative" display="inline-block">
        <Box
          as="img"
          src="/img/TruckMarker.svg"
          alt="truck marker"
          w="40px"
          h="40px"
        />
        {isSelected && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="24px"
            h="24px"
            borderRadius="50%"
            bg="#374151"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="2px solid white"
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)">
            <Text fontSize="12px" fontWeight="700" color="white">
              F
            </Text>
          </Box>
        )}
      </Box>
      {driver?.tripId && (
        <Text
          mt="4px"
          px="4px"
          py="2px"
          bg="white"
          borderRadius="4px"
          fontSize="10px"
          fontWeight="600"
          color="#181D27"
          textAlign="center"
          boxShadow="0 1px 3px rgba(0, 0, 0, 0.2)"
          whiteSpace="nowrap">
          {driver.tripId}
        </Text>
      )}
    </Box>
  );
};

const DriverInfoPopup = ({isOpen, onClose, driver, onSendMessage}) => {
  if (!isOpen || !driver) return null;

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "23 min 3 sec ago";
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    if (diffMins > 0) {
      return `${diffMins} min ${diffSecs} sec ago`;
    }
    return `${diffSecs} sec ago`;
  };

  const driverName = driver.driver
    ? `${driver.driver.first_name || ""} ${driver.driver.last_name || ""}`.trim()
    : driver.driverName || "Driver Name";
  const truckId = driver.licence_plate || driver.truckId || "T-4829";
  const location = driver.current_location || driver.location || "Memphis, TN 38134";

  return (
    <Box
      position="absolute"
      bottom="20px"
      left="20px"
      bg="white"
      borderRadius="12px"
      boxShadow="0 10px 25px rgba(0, 0, 0, 0.15)"
      minW="300px"
      maxW="400px"
      zIndex={30}
      border="1px solid #E2E8F0">
      <Flex
        justifyContent="space-between"
        alignItems="flex-start"
        p="16px"
        borderBottom="1px solid #E5E7EB">
        <Flex alignItems="center" gap="12px" flex="1">
          <Box
            w="56px"
            h="56px"
            borderRadius="50%"
            bg="#1570EF"
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            flexShrink={0}
            overflow="hidden">
            {driver.driver?.profile_picture ? (
              <Box
                as="img"
                src={driver.driver.profile_picture}
                alt={driverName}
                w="100%"
                h="100%"
                borderRadius="50%"
                objectFit="cover"
              />
            ) : (
              <Text fontSize="20px" fontWeight="700" color="white">
                {driverName.charAt(0).toUpperCase()}
              </Text>
            )}
            <Box
              position="absolute"
              bottom="0"
              right="0"
              w="20px"
              h="20px"
              borderRadius="50%"
              bg="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid #1570EF">
              <Text fontSize="10px" fontWeight="700" color="#1570EF">
                F
              </Text>
            </Box>
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="16px" fontWeight="600" color="#181D27" mb="4px">
              {truckId}
            </Text>
            <Text fontSize="14px" color="#6B7280" fontWeight="400" noOfLines={1}>
              {driverName}
            </Text>
          </Box>
        </Flex>
        <Box
          w="24px"
          h="24px"
          borderRadius="50%"
          bg="#F3F4F6"
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          fontSize="18px"
          color="#4A5568"
          _hover={{bg: "#E5E7EB"}}
          onClick={onClose}
          flexShrink={0}
          ml="12px">
          ×
        </Box>
      </Flex>

      <Box p="16px">
        <Flex align="center" gap="8px" mb="12px">
          <Box
            as="img"
            src="/img/modelYear.svg"
            alt="model year"
            w="16px"
            h="16px"
          />
          <Text fontSize="14px" fontWeight="600" color="#374151">
            Model year: {driver.year || "2020"}
          </Text>
        </Flex>

        <Flex align="center" gap="8px" mb="12px">
          <Box
            as="img"
            src="/img/mapTruck.svg"
            alt="location"
            w="16px"
            h="16px"
          />
          <Text fontSize="14px" fontWeight="600" color="#374151" noOfLines={2}>
            {location}
          </Text>
        </Flex>

        <Text fontSize="12px" color="#6B7280" mb="16px">
          Last Verification {formatTimeAgo(driver.last_updated || driver.updated_at)}
        </Text>

        <Button
          width="100%"
          bg="#EF6820"
          color="white"
          borderRadius="12px"
          border="2px solid #cc6c38"
          _hover={{bg: "#d45a1a"}}
          onClick={() => {
            onSendMessage(driver);
          }}
          fontSize="14px"
          fontWeight="600"
          h="40px">
          Send Message
        </Button>
      </Box>
    </Box>
  );
};

export const MapView = () => {
  const navigate = useNavigate();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const mapRef = useRef(null);

  // Mock truck data - replace with actual API call
  const trucksData = useMemo(
    () => [
      {
        id: 1,
        lat: 31.2304,
        lng: -82.5704,
        licence_plate: "T-4829",
        truckId: "T-4829",
        driver: {
          first_name: "John",
          last_name: "Doe",
          profile_picture: null,
        },
        current_location: "Memphis, TN 38134",
        year: "2020",
        last_updated: new Date(Date.now() - 23 * 60 * 1000 - 3 * 1000),
        isSelected: true,
      },
      {
        id: 2,
        lat: 31.2404,
        lng: -82.5804,
        licence_plate: "T-4830",
        truckId: "T-4830",
        driver: {
          first_name: "Jane",
          last_name: "Smith",
        },
        current_location: "Atlanta, GA 30309",
        year: "2021",
        last_updated: new Date(Date.now() - 15 * 60 * 1000),
      },
      {
        id: 3,
        lat: 31.2204,
        lng: -82.5604,
        licence_plate: "T-4831",
        truckId: "T-4831",
        driver: {
          first_name: "Bob",
          last_name: "Johnson",
        },
        current_location: "Savannah, GA 31401",
        year: "2019",
        last_updated: new Date(Date.now() - 45 * 60 * 1000),
      },
    ],
    []
  );

  const {center, zoom} = useMemo(() => {
    if (!trucksData || trucksData.length === 0) {
      return {center: {lat: 31.2304, lng: -82.5704}, zoom: 10};
    }

    const validTrucks = trucksData.filter(
      (truck) => truck.lat && truck.lng && !isNaN(truck.lat) && !isNaN(truck.lng)
    );

    if (validTrucks.length === 0) {
      return {center: {lat: 31.2304, lng: -82.5704}, zoom: 10};
    }

    const lats = validTrucks.map((truck) => parseFloat(truck.lat));
    const lngs = validTrucks.map((truck) => parseFloat(truck.lng));

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const avgLat = (minLat + maxLat) / 2;
    const avgLng = (minLng + maxLng) / 2;

    return {
      center: {lat: avgLat || 31.2304, lng: avgLng || -82.5704},
      zoom: 10,
    };
  }, [trucksData]);

  const onMapLoad = useCallback((map, maps) => {
    mapRef.current = {map, maps};
  }, []);

  const handleMarkerClick = (driver) => {
    // Mark all trucks as not selected
    trucksData.forEach((truck) => {
      truck.isSelected = false;
    });
    // Mark clicked truck as selected
    driver.isSelected = true;
    setSelectedDriver(driver);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedDriver(null);
  };

  const handleSendMessage = (driver) => {
    navigate(`/admin/collabrations`, {
      state: {
        tripId: driver?.driver?.guid || driver?.id,
        tripName: `${driver.driver?.first_name || ""} ${driver.driver?.last_name || ""}`.trim(),
      },
    });
  };

  return (
    <Box
      width="100%"
      height="600px"
      borderRadius="12px"
      border="1px solid #E2E8F0"
      overflow="hidden"
      position="relative">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAdBRYyeH13KXV-VtXpQuG36A7vbBjibMU",
          language: "en",
        }}
        defaultCenter={center}
        center={center}
        defaultZoom={zoom}
        zoom={zoom}
        onGoogleApiLoaded={({map, maps}) => onMapLoad(map, maps)}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          mapTypeId: "roadmap",
        }}>
        {trucksData?.map((driver, index) => (
          <DriverMarker
            key={driver.id || driver.truckId || index}
            lat={driver.lat}
            lng={driver.lng}
            driver={driver}
            onClick={() => handleMarkerClick(driver)}
          />
        ))}
      </GoogleMapReact>

      <DriverInfoPopup
        isOpen={showPopup}
        onClose={handleClosePopup}
        driver={selectedDriver}
        onSendMessage={handleSendMessage}
      />
    </Box>
  );
};

